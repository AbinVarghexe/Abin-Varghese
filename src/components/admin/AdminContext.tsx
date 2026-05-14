"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AdminContextType {
  saveAction: (() => Promise<void>) | null;
  setSaveAction: (action: (() => Promise<void>) | null) => void;
  isSaving: boolean;
  setIsSaving: (loading: boolean) => void;
  statusText: string;
  setStatusText: (text: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [saveAction, setSaveActionState] = useState<(() => Promise<void>) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("System Standby");

  const setSaveAction = useCallback((action: (() => Promise<void>) | null) => {
    setSaveActionState(() => action);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        saveAction,
        setSaveAction,
        isSaving,
        setIsSaving,
        statusText,
        setStatusText,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
