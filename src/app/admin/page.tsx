"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { LogOut, LayoutDashboard, Home, User, Briefcase, Mail, Settings, RefreshCw, Eye, EyeOff, Save, ShieldAlert, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import { aboutContentDefaults } from "@/lib/about-content-defaults";
import { heroContentDefaults } from "@/lib/hero-content-defaults";
import { homeContentDefaults } from "@/lib/home-content-defaults";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("hero");
  const [showPreview, setShowPreview] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [editorWidth, setEditorWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Example placeholder state for form
  const [formData, setFormData] = useState({
    // Hero
    heroGreeting: heroContentDefaults.heroGreeting,
    heroName: heroContentDefaults.heroName,
    heroSubcopy: heroContentDefaults.heroSubcopy,
    heroAudienceTags: heroContentDefaults.heroAudienceTags,
    heroAvailabilityText: heroContentDefaults.heroAvailabilityText,
    heroCtaPrimaryLabel: heroContentDefaults.heroCtaPrimaryLabel,
    heroCtaPrimaryUrl: heroContentDefaults.heroCtaPrimaryUrl,
    heroCtaSecondaryLabel: heroContentDefaults.heroCtaSecondaryLabel,
    heroCtaSecondaryUrl: heroContentDefaults.heroCtaSecondaryUrl,
    
    // Home
    scrollingBannerItems: homeContentDefaults.scrollingBannerItems,
    
    // About
    aboutImage: aboutContentDefaults.aboutImage,
    aboutInstagramImage1: aboutContentDefaults.aboutInstagramImage1,
    aboutInstagramImage2: aboutContentDefaults.aboutInstagramImage2,
    aboutInstagramImage3: aboutContentDefaults.aboutInstagramImage3,
    aboutInstagramImage4: aboutContentDefaults.aboutInstagramImage4,
    aboutInstagramLink1: aboutContentDefaults.aboutInstagramLink1,
    aboutInstagramLink2: aboutContentDefaults.aboutInstagramLink2,
    aboutInstagramLink3: aboutContentDefaults.aboutInstagramLink3,
    aboutInstagramLink4: aboutContentDefaults.aboutInstagramLink4,
  });

  useEffect(() => {
    if (status !== "authenticated") return;

    const loadAboutContent = async () => {
      try {
        const response = await fetch("/api/admin/site-content");
        if (!response.ok) return;

        const data = await response.json();
        setFormData((current) => ({
          ...current,
          ...data.about,
          ...data.hero,
          ...data.home,
        }));
      } catch (error) {
        console.error("Failed to load about content:", error);
      }
    };

    loadAboutContent();
  }, [status]);

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center text-green-500 font-mono">Initializing Batcomputer...</div>;
  }

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (activeTab === "about") {
        const response = await fetch("/api/admin/site-content", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "about",
            data: {
              aboutImage: formData.aboutImage,
              aboutInstagramImage1: formData.aboutInstagramImage1,
              aboutInstagramImage2: formData.aboutInstagramImage2,
              aboutInstagramImage3: formData.aboutInstagramImage3,
              aboutInstagramImage4: formData.aboutInstagramImage4,
              aboutInstagramLink1: formData.aboutInstagramLink1,
              aboutInstagramLink2: formData.aboutInstagramLink2,
              aboutInstagramLink3: formData.aboutInstagramLink3,
              aboutInstagramLink4: formData.aboutInstagramLink4,
            }
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save about content");
        }
      }

      if (activeTab === "hero") {
        const response = await fetch("/api/admin/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "hero",
            data: {
              heroGreeting: formData.heroGreeting,
              heroName: formData.heroName,
              heroSubcopy: formData.heroSubcopy,
              heroAudienceTags: formData.heroAudienceTags,
              heroAvailabilityText: formData.heroAvailabilityText,
              heroCtaPrimaryLabel: formData.heroCtaPrimaryLabel,
              heroCtaPrimaryUrl: formData.heroCtaPrimaryUrl,
              heroCtaSecondaryLabel: formData.heroCtaSecondaryLabel,
              heroCtaSecondaryUrl: formData.heroCtaSecondaryUrl,
            }
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save hero content");
        }
      }

      if (activeTab === "home") {
        const response = await fetch("/api/admin/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "home",
            data: {
              scrollingBannerItems: formData.scrollingBannerItems,
            }
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save home content");
        }
      }

      setIsSaving(false);
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    } catch (error) {
      console.error("Save failed:", error);
      setIsSaving(false);
    }
  };

  const handleAboutImageUpload = async (
    field:
      | "aboutImage"
      | "aboutInstagramImage1"
      | "aboutInstagramImage2"
      | "aboutInstagramImage3"
      | "aboutInstagramImage4",
    file: File | null
  ) => {
    if (!file) return;

    setUploadingField(field);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/admin/upload/about-image", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((current) => ({
        ...current,
        [field]: data.url,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadingField(null);
    }
  };

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const sidebarWidth = document.querySelector('aside')?.clientWidth || 88;
      const newWidth = mouseMoveEvent.clientX - sidebarWidth;
      
      if (newWidth > 300 && newWidth < window.innerWidth - 300) {
        setEditorWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "hero", label: "Hero Section", icon: Home },
    { id: "home", label: "Home Section", icon: Monitor },
    { id: "about", label: "About Section", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-300 font-sans overflow-hidden">
      
      {/* Sidebar - The Batcomputer Console */}
      <aside className={`${isSidebarExpanded ? 'w-72' : 'w-[88px]'} bg-black border-r border-neutral-800/60 flex flex-col relative z-20 transition-all duration-300 ease-in-out shrink-0`}>
        <div className={`p-6 border-b border-neutral-800/60 flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 rounded-xl flex items-center justify-center shadow-inner shadow-white/5 shrink-0">
                <ShieldAlert className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-white font-bold tracking-wide truncate">BATCAVE</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase truncate">System Active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 rounded-xl flex items-center justify-center shadow-inner shadow-white/5 shrink-0">
              <ShieldAlert className="w-5 h-5 text-neutral-400" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={!isSidebarExpanded ? item.label : undefined}
              className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-neutral-900 border border-neutral-700/50 text-white shadow-md relative" 
                  : "hover:bg-neutral-900/50 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${activeTab === item.id ? "text-white" : ""}`} />
              {isSidebarExpanded && <span className="font-medium text-sm whitespace-nowrap truncate">{item.label}</span>}
              {!isSidebarExpanded && activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-md"></div>
              )}
            </button>
          ))}
        </div>

        {/* Expand / Collapse Button */}
        <div className="px-4 py-2">
          <button 
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`w-full flex items-center ${isSidebarExpanded ? 'justify-start px-4 gap-3' : 'justify-center px-0'} py-3 rounded-xl hover:bg-neutral-900/50 text-neutral-500 hover:text-white transition-colors border border-transparent hover:border-neutral-800/60`}
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarExpanded ? <ChevronLeft className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
            {isSidebarExpanded && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>

        <div className={`p-4 border-t border-neutral-800/60 flex items-center ${isSidebarExpanded ? 'justify-between' : 'flex-col gap-4 justify-center'}`}>
          <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarExpanded && 'justify-center'}`}>
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-9 h-9 shrink-0 rounded-full border border-neutral-700" />
            ) : (
              <div className="w-9 h-9 shrink-0 bg-neutral-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            {isSidebarExpanded && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-white truncate">{session?.user?.name || "Admin"}</span>
                <span className="text-[10px] text-neutral-500 truncate">
                  {(session?.user as any)?.customEmailDisplay || session?.user?.email}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={() => signOut()}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-red-400 shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area - Split View */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left: Editor Panel */}
        <div 
          className={`flex flex-col bg-neutral-900/20 ${!showPreview ? 'flex-1 w-full' : ''}`}
          style={showPreview ? { width: editorWidth ? `${editorWidth}px` : '40%', flexShrink: 0 } : {}}
        >
          <header className="h-16 px-6 border-b border-neutral-800/60 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-white capitalize">{activeTab} Configuration</h2>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                title="Toggle Preview"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Syncing..." : "Save Changes"}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
            {/* Dynamic Form Content based on Active Tab */}
            {activeTab === "hero" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">GREETING</label>
                  <input 
                    type="text" 
                    value={formData.heroGreeting}
                    onChange={(e) => setFormData({...formData, heroGreeting: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    placeholder="Hi, Guys 👋 I'm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">NAME</label>
                  <input 
                    type="text" 
                    value={formData.heroName}
                    onChange={(e) => setFormData({...formData, heroName: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    placeholder="Abin Varghese."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">SUBCOPY</label>
                  <textarea 
                    rows={3}
                    value={formData.heroSubcopy}
                    onChange={(e) => setFormData({...formData, heroSubcopy: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all resize-none"
                    placeholder="I design with purpose..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">AUDIENCE LABELS (COMMA SEPARATED)</label>
                  <input 
                    type="text" 
                    value={formData.heroAudienceTags}
                    onChange={(e) => setFormData({...formData, heroAudienceTags: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    placeholder="AV, UI, UX, FD, NX"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">AVAILABILITY STATUS TEXT</label>
                  <input 
                    type="text" 
                    value={formData.heroAvailabilityText}
                    onChange={(e) => setFormData({...formData, heroAvailabilityText: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    placeholder="Full-Stack Developer · UI/UX Designer · Kerala, IN."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-500 uppercase">BUTTON 1 LABEL</label>
                    <input 
                      type="text" 
                      value={formData.heroCtaPrimaryLabel}
                      onChange={(e) => setFormData({...formData, heroCtaPrimaryLabel: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-500 uppercase">BUTTON 1 URL</label>
                    <input 
                      type="text" 
                      value={formData.heroCtaPrimaryUrl}
                      onChange={(e) => setFormData({...formData, heroCtaPrimaryUrl: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-500 uppercase">BUTTON 2 LABEL</label>
                    <input 
                      type="text" 
                      value={formData.heroCtaSecondaryLabel}
                      onChange={(e) => setFormData({...formData, heroCtaSecondaryLabel: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-500 uppercase">BUTTON 2 URL</label>
                    <input 
                      type="text" 
                      value={formData.heroCtaSecondaryUrl}
                      onChange={(e) => setFormData({...formData, heroCtaSecondaryUrl: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    />
                  </div>
                </div>

              </div>
            )}
            
            {activeTab === "home" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">SCROLLING BANNER ITEMS (COMMA SEPARATED)</label>
                  <textarea 
                    rows={4}
                    value={formData.scrollingBannerItems}
                    onChange={(e) => setFormData({...formData, scrollingBannerItems: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all resize-none"
                    placeholder="Web Developer, Graphic Designer, Video Editor..."
                  />
                  <p className="text-xs text-neutral-500 mt-2">These items will float continuously across the screen below the hero section.</p>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">ABOUT_IMAGE</label>
                  <input
                    type="text"
                    value={formData.aboutImage}
                    onChange={(e) => setFormData({ ...formData, aboutImage: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                    placeholder="/about/abin-varghese.png or https://..."
                  />
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAboutImageUpload("aboutImage", e.target.files?.[0] || null)}
                      />
                      Upload main image
                    </label>
                    {uploadingField === "aboutImage" && (
                      <span className="text-xs font-mono text-neutral-500 uppercase">Uploading...</span>
                    )}
                  </div>
                </div>

                {[
                  { imageKey: "aboutInstagramImage1", linkKey: "aboutInstagramLink1", label: "INSTAGRAM_CARD_1" },
                  { imageKey: "aboutInstagramImage2", linkKey: "aboutInstagramLink2", label: "INSTAGRAM_CARD_2" },
                  { imageKey: "aboutInstagramImage3", linkKey: "aboutInstagramLink3", label: "INSTAGRAM_CARD_3" },
                  { imageKey: "aboutInstagramImage4", linkKey: "aboutInstagramLink4", label: "INSTAGRAM_CARD_4" },
                ].map((field) => (
                  <div key={field.label} className="rounded-2xl border border-neutral-800 bg-black/30 p-4 space-y-4">
                    <p className="text-xs font-mono text-neutral-500 uppercase">{field.label}</p>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-600 uppercase">IMAGE_URL</label>
                      <input
                        type="text"
                        value={formData[field.imageKey as keyof typeof formData] as string}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.imageKey]: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                        placeholder="Direct image URL for the side photo"
                      />
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm cursor-pointer transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleAboutImageUpload(
                                field.imageKey as
                                  | "aboutInstagramImage1"
                                  | "aboutInstagramImage2"
                                  | "aboutInstagramImage3"
                                  | "aboutInstagramImage4",
                                e.target.files?.[0] || null
                              )
                            }
                          />
                          Upload card image
                        </label>
                        {uploadingField === field.imageKey && (
                          <span className="text-xs font-mono text-neutral-500 uppercase">Uploading...</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-600 uppercase">INSTAGRAM_LINK</label>
                      <input
                        type="text"
                        value={formData[field.linkKey as keyof typeof formData] as string}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.linkKey]: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                        placeholder="Instagram post/profile link for click-through"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab !== "hero" && activeTab !== "home" && activeTab !== "about" && (
              <div className="h-40 border border-dashed border-neutral-800 rounded-xl flex items-center justify-center text-neutral-500">
                Data schema building for {activeTab}...
              </div>
            )}
            
            <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl">
              <p className="text-xs text-blue-400 font-mono">
                &gt; CHANGES AUTO-SYNC TO PREVIEW TERMINAL. HIT "SAVE" TO DEPLOY TO PRODUCTION CACHE.
              </p>
            </div>
          </div>
        </div>

        {/* Draggable Divider */}
        {showPreview && (
          <div 
            onMouseDown={handleDrag}
            className="w-1 hover:w-1.5 bg-neutral-800 hover:bg-neutral-600 cursor-col-resize z-30 transition-all flex items-center justify-center active:bg-neutral-500 relative"
          >
            <div className="absolute h-8 w-1 rounded-full bg-neutral-600 pointer-events-none"></div>
          </div>
        )}

        {/* Right: Live Preview Panel */}
        {showPreview && (
          <div className="flex-1 bg-black flex flex-col min-w-[320px]">
            {/* Simple Browser Bar */}
            <div className="h-10 border-b border-neutral-800/60 bg-neutral-950 flex items-center justify-between px-4 shrink-0 shadow-sm relative z-10">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <div className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md flex items-center gap-2 flex-1 max-w-sm mx-4 justify-center">
                <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline-block">localhost:3000/</span>
              </div>
              <button 
                onClick={() => {
                  if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
                }}
                className="text-neutral-500 hover:text-white transition-colors"
                title="Refresh Preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Iframe */}
            <div className="flex-1 bg-white relative">
              {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize"></div>}
              <iframe 
                ref={iframeRef}
                src="/" 
                className="absolute inset-0 w-full h-full border-none pointer-events-auto"
                title="Live Preview"
              />
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}
