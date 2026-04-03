import { create } from "zustand";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface JarvisState {
  isOpen: boolean;
  isThinking: boolean;
  isModelLoaded: boolean; // **New state for preloader sync**
  messages: Message[];
  openJarvis: () => void;
  closeJarvis: () => void;
  setIsModelLoaded: (loaded: boolean) => void; // **New action**
  addMessage: (content: string, role: "user" | "assistant") => void;
  clearHistory: () => void;
  setThinking: (thinking: boolean) => void;
}

export const useJarvisStore = create<JarvisState>((set) => ({
  isOpen: false,
  isThinking: false,
  isModelLoaded: false, // Default to false
  messages: [
    {
      role: "assistant",
      content: "Welcome, sir. I'm your Virtual Self, here to assist with any questions about Abin's portfolio. How can I help you today?",
      timestamp: Date.now(),
    },
  ],
  openJarvis: () => set({ isOpen: true }),
  closeJarvis: () => set({ isOpen: false }),
  setIsModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
  addMessage: (content, role) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { role, content, timestamp: Date.now() },
      ],
    })),
  clearHistory: () =>
    set({
      messages: [
        {
          role: "assistant",
          content: "System reset. How can I help you, sir?",
          timestamp: Date.now(),
        },
      ],
    }),
  setThinking: (thinking) => set({ isThinking: thinking }),
}));
