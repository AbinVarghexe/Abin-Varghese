"use client";

import { motion } from "framer-motion";

type Sticker = {
  id: string;
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
  rotation: number;
  left: string;
  top: string;
  objectPosition?: string;
  frameTint: string;
  pin: string;
  shadow: string;
};

const milesStickerImage =
  "https://i.pinimg.com/736x/f7/24/74/f72474f49e55bbf4d4c4b2e95e437d68.jpg";
const milesStickerImageTwo =
  "https://i.pinimg.com/736x/3d/64/12/3d6412a2a18b6b0204ac8dc64b7db7dc.jpg";
const milesStickerImageThree =
  "https://i.pinimg.com/736x/b6/8f/7a/b68f7aee5bff5b4bd250a31e20dd516f.jpg";
const milesStickerImageFour =
  "https://i.pinimg.com/736x/fd/ea/9c/fdea9c7a13cb46ee05064c8683fc37dd.jpg";

const stickers: Sticker[] = [
  {
    id: "brooklyn",
    imageUrl: milesStickerImage,
    alt: "Miles Morales sticker collage",
    width: 176,
    height: 176,
    rotation: -8,
    left: "7%",
    top: "10%",
    objectPosition: "center top",
    frameTint: "#f3e3c7",
    pin: "#111111",
    shadow: "rgba(193,18,31,0.22)",
  },
  {
    id: "spidey-sense",
    imageUrl: milesStickerImageTwo,
    alt: "Miles Morales anime style sticker",
    width: 168,
    height: 214,
    rotation: 7,
    left: "78%",
    top: "16%",
    objectPosition: "center top",
    frameTint: "#efe0c5",
    pin: "#d62828",
    shadow: "rgba(0,0,0,0.18)",
  },
  {
    id: "venom",
    imageUrl: milesStickerImageThree,
    alt: "Miles Morales portrait sticker",
    width: 156,
    height: 156,
    rotation: -7,
    left: "18%",
    top: "60%",
    objectPosition: "center center",
    frameTint: "#f5e7cf",
    pin: "#171717",
    shadow: "rgba(184,15,10,0.2)",
  },
  {
    id: "earth-1610",
    imageUrl: milesStickerImageFour,
    alt: "Miles Morales spider logo sticker sheet",
    width: 190,
    height: 238,
    rotation: 10,
    left: "71%",
    top: "53%",
    objectPosition: "center center",
    frameTint: "#f0dec0",
    pin: "#ef233c",
    shadow: "rgba(32,32,32,0.2)",
  },
];

export default function MilesStickerBoard() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {stickers.map((sticker) => (
        <motion.div
          key={sticker.id}
          drag
          dragMomentum={false}
          dragElastic={0.12}
          initial={{ y: 0, scale: 1, rotate: sticker.rotation }}
          animate={{
            y: [0, -5, 0, 3, 0],
            scale: [1, 1.01, 1, 0.995, 1],
            rotate: [
              sticker.rotation,
              sticker.rotation + 1,
              sticker.rotation,
              sticker.rotation - 0.8,
              sticker.rotation,
            ],
          }}
          transition={{
            duration: 5.5 + (sticker.width % 4) * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (sticker.height % 5) * 0.2,
          }}
          whileTap={{
            scale: 1.05,
            zIndex: 50,
            rotate: sticker.rotation * 0.35,
            y: -2,
          }}
          whileHover={{
            scale: 1.04,
            rotate: sticker.rotation + (sticker.rotation > 0 ? 2 : -2),
            y: -7,
          }}
          className="pointer-events-auto absolute cursor-grab active:cursor-grabbing touch-none"
          style={{
            left: sticker.left,
            top: sticker.top,
            width: sticker.width,
            height: sticker.height,
          }}
        >
          <div className="relative h-full w-full">
            <div
              className="absolute left-1/2 top-[-12px] h-7 w-7 -translate-x-1/2 rounded-full border border-white/60 shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-transform duration-200"
              style={{
                background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${sticker.pin} 58%, #3d3d3d 100%)`,
              }}
            />
            <div
              className="relative h-full w-full overflow-hidden rounded-[24px] border border-black/10 p-3 transition-shadow duration-300"
              style={{
                boxShadow: `0 18px 32px ${sticker.shadow}, 0 4px 8px rgba(0,0,0,0.12)`,
                background: `linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.14) 100%), ${sticker.frameTint}`,
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-black/10 bg-[#1b1713]">
                <img
                  src={sticker.imageUrl}
                  alt={sticker.alt}
                  draggable={false}
                  className="h-full w-full select-none object-cover transition-[transform,filter] duration-300"
                  style={{ objectPosition: sticker.objectPosition ?? "center" }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_26%,rgba(0,0,0,0.12)_100%)]" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
