"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { LogOut, LayoutDashboard, Home, User, Briefcase, Mail, Settings, RefreshCw, Eye, EyeOff, Save, ShieldAlert } from "lucide-react";
import { aboutContentDefaults } from "@/lib/about-content-defaults";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("hero");
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Example placeholder state for form
  const [formData, setFormData] = useState({
    heroTitle: "ABIN'S ABODE",
    heroSubtitle: "Creative Developer & Designer",
    aboutText: "Welcome to my digital batcave.",
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
            aboutImage: formData.aboutImage,
            aboutInstagramImage1: formData.aboutInstagramImage1,
            aboutInstagramImage2: formData.aboutInstagramImage2,
            aboutInstagramImage3: formData.aboutInstagramImage3,
            aboutInstagramImage4: formData.aboutInstagramImage4,
            aboutInstagramLink1: formData.aboutInstagramLink1,
            aboutInstagramLink2: formData.aboutInstagramLink2,
            aboutInstagramLink3: formData.aboutInstagramLink3,
            aboutInstagramLink4: formData.aboutInstagramLink4,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save about content");
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

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "hero", label: "Hero Section", icon: Home },
    { id: "about", label: "About Section", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-300 font-sans overflow-hidden">
      
      {/* Sidebar - The Batcomputer Console */}
      <aside className="w-72 bg-black border-r border-neutral-800/60 flex flex-col relative z-20">
        <div className="p-6 border-b border-neutral-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 rounded-xl flex items-center justify-center shadow-inner shadow-white/5">
              <ShieldAlert className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-white font-bold tracking-wide">BATCAVE</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase">System Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-neutral-900 border border-neutral-700/50 text-white shadow-md" 
                  : "hover:bg-neutral-900/50 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-white" : ""}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-9 h-9 rounded-full border border-neutral-700" />
            ) : (
              <div className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-white truncate">{session?.user?.name || "Admin"}</span>
              <span className="text-[10px] text-neutral-500 truncate">
                {(session?.user as any)?.customEmailDisplay || session?.user?.email}
              </span>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area - Split View */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left: Editor Panel */}
        <div className={`flex-1 flex flex-col bg-neutral-900/20 max-w-3xl ${!showPreview ? 'max-w-none' : ''} transition-all duration-300`}>
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
                  <label className="text-xs font-mono text-neutral-500 uppercase">HERO_TITLE</label>
                  <input 
                    type="text" 
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">HERO_SUBTITLE</label>
                  <textarea 
                    rows={3}
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all resize-none"
                  />
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
            
            {activeTab !== "hero" && activeTab !== "about" && (
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

        {/* Right: Live Preview Panel */}
        {showPreview && (
          <div className="flex-1 border-l border-neutral-800/60 bg-black flex flex-col">
            <div className="h-12 border-b border-neutral-800/60 bg-neutral-950 flex items-center justify-between px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="px-4 py-1 bg-black border border-neutral-800 rounded-md flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-mono">localhost:3000/</span>
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
            <div className="flex-1 bg-white relative">
              {/* Iframe pointing to the live site. Uses a key to force rerender if needed, but mainly we use the ref */}
              <iframe 
                ref={iframeRef}
                src="/" 
                className="absolute inset-0 w-full h-full border-none"
                title="Live Preview"
              />
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}
