'use client';

import { useRef, Suspense, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, useGLTF, Environment, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useJarvisStore } from '@/store/useJarvisStore';
import { motion, AnimatePresence } from 'framer-motion';

function Model() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/3d_model/flying_bot.glb');
  const { actions, names } = useAnimations(animations, groupRef);
  const { mouse, camera, size } = useThree();
  const prevIsDragging = useRef(false);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const smoothedScroll = useRef(0);
  
  // -- Neural Side-Swapping AI --
  const sideMultiplier = useRef(1); // 1: Right, -1: Left
  const smoothedSideMultiplier = useRef(1); // **Smoothed state for fluid Transitions**
  const lastFlipTime = useRef(0);
  const lastUserInteractionTime = useRef(0);
  const isTransitioningSide = useRef(false);

  const [currentClip, setCurrentClip] = useState(0);
  const [isGreeting, setIsGreeting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { openJarvis } = useJarvisStore();
  const [showBubble, setShowBubble] = useState(false);

  // Periodical visibility loop (Appear for 3s, Hide for 3s)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBubble((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Track start position to distinguish click vs drag
  const dragStartPos = useRef(new THREE.Vector2());
  // Centered by default on full-screen canvas
  const droppedPos = useRef(new THREE.Vector3(0, -1.5, 0));

  // Global window listeners for reliable drag-release
  useEffect(() => {
    const handleGlobalUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // If it was just a tiny movement, trigger greeting
        const dragDist = dragStartPos.current.distanceTo(new THREE.Vector2(mouse.x, mouse.y));
        if (dragDist < 0.05) {
          handleInteraction();
        }
      }
    };
    
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, [isDragging, mouse]);

  // Update cursor on hover/drag
  useEffect(() => {
    document.body.style.cursor = isDragging ? 'grabbing' : (hovered ? 'grab' : 'auto');
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, isDragging]);

  // Apply shadow casting and optimize textures/materials on all meshes
  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.envMapIntensity = 2.5; 
          mesh.material.side = THREE.DoubleSide; 
          mesh.material.needsUpdate = true;
          
          if (mesh.material.map) {
            mesh.material.map.anisotropy = 16;
            mesh.material.map.needsUpdate = true;
          }
        }
      }
    });
  }, [scene]);

  // Animation Selection (Every 7s)
  useEffect(() => {
    if (names.length === 0) return;
    const interval = setInterval(() => {
      setCurrentClip((prev) => (prev + 1) % names.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [names]);

  // Animation Start (Only when clip index changes)
  useEffect(() => {
    if (names.length === 0) return;
    const name = names[currentClip];
    const action = actions[name];
    if (action) {
      action.reset().setEffectiveTimeScale(0.75).fadeIn(0.5).play();
      return () => { action.fadeOut(0.5); };
    }
  }, [actions, names, currentClip]);

  // Animation Play/Pause (Based on Interaction)
  useEffect(() => {
    const name = names[currentClip];
    const action = actions[name];
    if (action) {
      action.paused = (isDragging || isGreeting);
    }
  }, [isDragging, isGreeting, currentClip, actions, names]);

  // Click Interaction: "HAI" greeting
  const handleInteraction = () => {
    if (!isGreeting) {
      setIsGreeting(true);
      
      const greetClip = names.find(n => 
        n.toLowerCase().includes('wave') || 
        n.toLowerCase().includes('greet') || 
        n.toLowerCase().includes('hi')
      );

      if (greetClip) {
        actions[greetClip]?.reset().fadeIn(0.2).play();
        setTimeout(() => {
          actions[greetClip]?.fadeOut(0.5);
          setIsGreeting(false);
        }, 2500);
      } else {
        setTimeout(() => setIsGreeting(false), 2000);
      }
    }
  };

  const { setIsModelLoaded } = useJarvisStore(); // **New load signaling**

  // **Neural Initialization: Zero-Latency Startup Positioning**
  useLayoutEffect(() => {
    if (!groupRef.current) return;
    
    // Approximate viewport dimensions to avoid [0,0,0] snap
    const vfov = (35 * Math.PI) / 180;
    const vh = 2 * Math.tan(vfov / 2) * 24;
    const vw = vh * (window.innerWidth / window.innerHeight);
    const startX = (vw * 0.35) * sideMultiplier.current;
    
    groupRef.current.position.set(startX, 0, 0);
    
    // Signal to preloader that model is ready
    if (scene) {
      setIsModelLoaded(true);
    }
  }, [scene, setIsModelLoaded]);

  const [scrollY, setScrollY] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);

  // Sync scroll and calculate total page height
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setTotalHeight(document.documentElement.scrollHeight - window.innerHeight);
    
    // Initialize
    handleResize();
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();

      // **Buttery-Smooth Scroll Synchronization**
      const vh = window.innerHeight;
      smoothedScroll.current = THREE.MathUtils.lerp(smoothedScroll.current, scrollY, 0.05);
      const s = smoothedScroll.current;

      // **Fluid Side Transition Smoothing**
      smoothedSideMultiplier.current = THREE.MathUtils.lerp(
        smoothedSideMultiplier.current, 
        sideMultiplier.current, 
        0.012 // **Slow, elegant gliding speed**
      );

      const pCam = camera as THREE.PerspectiveCamera;
      const vfov = (pCam.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vfov / 2) * 24;
      const visibleWidth = visibleHeight * (state.size.width / state.size.height);
      const margin = 3.5; 
      
      const minX = -visibleWidth / 2 + margin;
      const maxX = visibleWidth / 2 - margin;
      const minY = -visibleHeight / 2 + margin + 1.5; 
      const maxY = visibleHeight / 2 - margin + 1.5;

      // **Neural Side-Swapping AI Logic**
      const timeSinceFlip = time - lastFlipTime.current;
      const timeSinceInteraction = time - lastUserInteractionTime.current;

      // Detect "Stagnancy": If idle for 15s, flip side autonomously
      if (!isDragging && timeSinceFlip > 15 && timeSinceInteraction > 15 && velocity.current.length() < 0.01) {
        sideMultiplier.current *= -1; // Flip: if left go right, if right go left
        lastFlipTime.current = time;
        isTransitioningSide.current = true;
      }

      // Reset state once transition settle
      if (isTransitioningSide.current && velocity.current.length() < 0.005) {
        isTransitioningSide.current = false;
      }

      // **AI Dynamic Milestone Generation** (Mirrored by smoothedSideMultiplier)
      // **Neural Global Journey Logic**
      // Calculate 0 to 1 progress of the entire page scroll
      const scrollProgress = totalHeight > 0 ? scrollY / totalHeight : 0;
      
      // Determine Phase Shift: starts at 1 (Right) if sideMultiplier is 1, else -1 (Left)
      // This ensures if it's on the right, it immediately moves to the left on scroll.
      const phase = sideMultiplier.current === 1 ? 0 : Math.PI;
      
      // Oscillation: Completed 4 full "to and fro" cycles across the entire page height.
      const sideFactor = Math.cos(scrollProgress * Math.PI * 4 + phase);
      const targetX = visibleWidth * 0.35 * sideFactor;
      
      // Gentle vertical wave for organic flight (2 cycles across the page)
      const targetY = visibleHeight * 0.1 * Math.sin(scrollProgress * Math.PI * 2);

      const journeyTarget = new THREE.Vector3(targetX, targetY, 0);

      if (prevIsDragging.current && !isDragging) {
        const snapX = mouse.x < -0.4 ? -0.75 : mouse.x > 0.4 ? 0.75 : 0;
        const snapY = mouse.y < -0.4 ? -0.6 : mouse.y > 0.4 ? 0.6 : 0;
        const targetDropX = (visibleWidth / 2) * snapX;
        const targetDropY = (visibleHeight / 2) * snapY;
        droppedPos.current.set(targetDropX - journeyTarget.x, targetDropY - journeyTarget.y, 0);
      }
      prevIsDragging.current = isDragging;

      if (isDragging) {
        lastUserInteractionTime.current = time; // Log interaction

        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        
        pos.x = THREE.MathUtils.clamp(pos.x, minX, maxX);
        pos.y = THREE.MathUtils.clamp(pos.y, minY, maxY);

        // Update side preference based on manual drop location
        if (pos.x > 0) sideMultiplier.current = 1;
        if (pos.x < 0) sideMultiplier.current = -1;

        groupRef.current.position.lerp(pos, 0.15);
        
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI, 0.1);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
        
        droppedPos.current.subVectors(groupRef.current.position, journeyTarget);
        velocity.current.set(0, 0, 0); // No velocity while dragged
        return;
      }

      // **Aero-Dynamic Heading (Facing User & Traveling)**
      if (isGreeting) {
        // Face forward (PI) and pivot slightly toward mouse
        const greetHeadingY = Math.PI + (mouse.x * 0.5);
        const waveAngle = Math.sin(time * 15) * 0.15;
        const waveHop = Math.sin(time * 8) * 0.3;
        
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, greetHeadingY, 0.1);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, waveAngle, 0.1);
        groupRef.current.position.y += waveHop * 0.05;
        // CONTINUE PHYSICS (Do not return) to avoid warping
      }

      // **Neural Physics Engine (Viscous Liquid Momentum)**
      const roamX = (Math.sin(time * 0.4) * 0.8 + Math.cos(time * 0.6) * 0.3); // Softer roam
      const roamY = (Math.cos(time * 0.3) * 0.5 + Math.sin(time * 0.5) * 0.2);
      const roamZ = Math.sin(time * 0.2) * 0.5;

      const idealTarget = new THREE.Vector3(
        journeyTarget.x + droppedPos.current.x + roamX,
        journeyTarget.y + droppedPos.current.y + roamY,
        journeyTarget.z + droppedPos.current.z + roamZ
      );

      // Physics: acceleration = force / mass
      const force = new THREE.Vector3().subVectors(idealTarget, groupRef.current.position);
      force.multiplyScalar(0.02); // **Softer, more natural tracking**
      
      velocity.current.add(force);
      velocity.current.multiplyScalar(0.7); // **Increased damping for viscous feel**
      
      groupRef.current.position.add(velocity.current);

      // **The Final Physical Barrier**
      groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, minX, maxX);
      groupRef.current.position.y = THREE.MathUtils.clamp(groupRef.current.position.y, minY, maxY);

      // **Aero-Dynamic Banking & Neural Heading (Intelligent Blending)**
      const xVel = velocity.current.x;
      const speed = velocity.current.length();
      
      // 1. Calculate Traveling Heading (Face direction of travel)
      const travelHeadingY = Math.PI + THREE.MathUtils.clamp(xVel * 2.5, -Math.PI / 3, Math.PI / 3); 
      
      // 2. Calculate Idle Scanning (Back and forth when settled)
      const idleScanY = Math.sin(time * 0.6) * (25 * Math.PI / 180) + Math.PI;
      
      // 3. Blend based on speed (If speed > 0.02, prioritize Traveling Heading)
      const headingY = THREE.MathUtils.lerp(idleScanY, travelHeadingY, THREE.MathUtils.smoothstep(speed * 10, 0, 1));
      
      // Calculate Banking (Z) - strictly limited for realism
      const bankingZ = THREE.MathUtils.clamp(-xVel * 1.2, -20 * Math.PI / 180, 20 * Math.PI / 180);
      const subtleRoamZ = Math.sin(time * 0.5) * 0.02 + bankingZ; 
      
      // X-Axis (Pitch) is now STABILIZED to prevent Top/Bottom views
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, headingY, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, subtleRoamZ, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* HIT-BOX: Centered on the model, scaled to encapsulate it */}
        <mesh 
          position={[0, 0.5, 1]} 
          onPointerDown={(e) => {
            e.stopPropagation();
            (e.target as any).setPointerCapture(e.pointerId);
            dragStartPos.current.set(mouse.x, mouse.y);
            setIsDragging(true);
          }}
          onPointerOver={() => {
            setHovered(true);
            setShowBubble(true);
          }}
          onPointerOut={() => setHovered(false)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            const dragDist = dragStartPos.current.distanceTo(new THREE.Vector2(mouse.x, mouse.y));
            if (dragDist < 0.05) {
              openJarvis();
            }
          }}
        >
          <sphereGeometry args={[2.5, 16, 16]} /> 
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* ── Jarvis Speech Bubble ────────────────────────────────── */}
        <Html position={[0, 4, 0]} center distanceFactor={15}>
          <AnimatePresence mode="wait">
            {showBubble && (
              <motion.div
                key="jarvis-bubble"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="pointer-events-auto select-none relative cursor-pointer"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  openJarvis();
                }}
              >
                {/* Floating "To and Fro" Layer */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl whitespace-nowrap text-[10px] font-black tracking-widest shadow-[0_0_30px_rgba(0,32,215,0.4)] border border-white/20 uppercase underline-offset-4 decoration-white/30">
                    Double click to chat
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rotate-45 border-r border-b border-white/20" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Html>

        <primitive 
          object={scene} 
          scale={12.5} 
          position={[0, -1.5, 0]}
          rotation={[0, 0, 0]} // Stabilized to Neutral Front View
        />
      </Float>
    </group>
  );
}

useGLTF.preload('/3d_model/flying_bot.glb');

export default function Hero3DLayer() {
  return (
    <div className="h-full w-full outline-none pointer-events-auto">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 24], fov: 35 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: true
        }}
        style={{ pointerEvents: 'auto', touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          
          <directionalLight 
            position={[5, 5, 15]} 
            intensity={3} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
            shadow-bias={-0.0005} // Reduced banding
          />
          
          <spotLight position={[-15, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow={false} />
          <pointLight position={[10, 5, -5]} intensity={1.5} />
          
          <Environment preset="city" />
          
          <Model />

          {/* Vertical Shadow-Catcher Wall */}
          <mesh receiveShadow position={[0, 0, -8]}>
            <planeGeometry args={[300, 300]} />
            <shadowMaterial transparent opacity={0.4} />
          </mesh>
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
