"use client";

import { useEffect, useState } from "react";
import AdminSectionWorkspace, { 
  SectionTitle, 
  SectionPanel, 
  TinyButton, 
  ActionButton 
} from "@/components/admin/AdminSectionWorkspace";
import { 
  Calendar, 
  User, 
  Mail, 
  Video, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  RefreshCcw, 
  ChevronRight,
  Sparkles,
  Link2,
  CalendarDays,
  BellRing,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData(isSilent = false) {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const response = await fetch("/api/cal/bookings", { cache: "no-store" });
      if (!response.ok) {
        setStatus("Failed to synchronize with Cal.com protocols.");
        return;
      }

      const data = await response.json();
      if (data.error) {
        setStatus(data.error);
      } else {
        setBookings(data.bookings || []);
        if (isSilent) toast.success("Schedule synchronized.");
      }
    } catch {
      setStatus("Protocol handshake failed. Check network integrity.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 bg-[#f7f4ef]/50 rounded-[33px] border-[5px] border-[#e4e4e7]">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-[#0020d7]/10 border-t-[#0020d7] rounded-full animate-spin" />
          <Calendar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0020d7]" size={28} />
        </div>
        <div className="text-center">
          <p className="text-[14px] font-extrabold text-[#0b0b0c] uppercase tracking-[0.25em]">Synchronizing</p>
          <p className="text-[12px] font-medium text-[#4a4a68] mt-2 opacity-70">Establishing link with Cal.com protocols...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Temporal Management"
      sectionTitle="Schedule Intelligence Center"
      sectionDescription="A high-fidelity view of your incoming appointments, synchronized in real-time from your integrated booking infrastructure."
      icon={CalendarDays}
      iconColor="#0020d7"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* Intelligence Sidebar */}
        <aside className="xl:col-span-4 space-y-8">
          <SectionPanel className="p-8 bg-[#0b0b0c] text-white overflow-hidden relative border-none shadow-2xl">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4a4a68]">Sync Status</p>
                <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#34c759]/15 text-[#34c759] border border-[#34c759]/20">
                  <span className="h-2 w-2 rounded-full bg-[#34c759] animate-pulse" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest">Active</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-[32px] font-bold tracking-tighter">{bookings.length}</h3>
                <p className="text-[13px] font-bold text-[#4a4a68] uppercase tracking-[0.15em] mt-1.5">Pending Appointments</p>
              </div>

              <button 
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-[20px] bg-white text-black text-[13px] font-extrabold uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/20"
              >
                {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                Manual Refresh
              </button>
            </div>
            {/* Abstract Background Element */}
            <div className="absolute -right-12 -bottom-12 h-48 w-48 bg-[#0020d7] rounded-full blur-[100px] opacity-30" />
          </SectionPanel>

          <SectionPanel className="p-8 border-dashed border-[#0020d7]/30 bg-[#0020d7]/[0.03]">
            <div className="flex gap-5">
              <div className="h-12 w-12 rounded-[18px] bg-[#0020d7] text-white flex items-center justify-center shadow-xl shadow-[#0020d7]/30 flex-shrink-0">
                <BellRing size={24} />
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#0b0b0c] tracking-tight">Booking Logic</p>
                <p className="text-[12px] text-[#4a4a68] leading-relaxed mt-1.5 font-medium">Appointments are auto-imported from your linked Cal.com account. Video links activate 5 minutes before scheduled start.</p>
              </div>
            </div>
          </SectionPanel>
        </aside>

        {/* Appointments Feed */}
        <main className="xl:col-span-8 space-y-8">
          <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <SectionTitle title="Appointment Feed" copy="Live transmission of scheduled meetings." icon={Clock} />
              <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-extrabold text-[#4a4a68] uppercase tracking-[0.2em]">
                <Calendar size={14} className="text-[#0020d7]" />
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            {status && (
              <div className="flex items-center gap-4 p-5 rounded-[22px] bg-[#ff3b30]/5 border-2 border-[#ff3b30]/10 text-[#ff3b30]">
                <AlertCircle size={20} />
                <p className="text-[14px] font-extrabold uppercase tracking-widest">{status}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {bookings.length === 0 && !status ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="md:col-span-2 py-24 rounded-[33px] border-4 border-dashed border-[#e4e4e7] bg-white text-center"
                  >
                    <Sparkles className="mx-auto mb-5 text-[#0020d7] opacity-20" size={56} />
                    <h4 className="text-[18px] font-extrabold text-[#0b0b0c] tracking-tight">Optimal Availability</h4>
                    <p className="text-[14px] text-[#4a4a68] mt-1.5 font-medium">No upcoming transmissions detected in the current cycle.</p>
                  </motion.div>
                ) : (
                  bookings.map((booking: any) => {
                    const date = new Date(booking.startTime).toLocaleDateString("en-US", {
                      weekday: 'long', month: 'short', day: 'numeric'
                    });
                    const time = new Date(booking.startTime).toLocaleTimeString("en-US", {
                      hour: 'numeric', minute: '2-digit'
                    });

                    return (
                      <motion.article 
                        key={booking.uid || booking.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group p-6 rounded-[28px] border-2 border-[#e4e4e7] bg-white hover:border-[#0020d7]/40 hover:shadow-2xl hover:shadow-[#0020d7]/5 transition-all duration-500 flex flex-col gap-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="h-14 w-14 rounded-[20px] bg-[#f7f4ef] group-hover:bg-[#0020d7] group-hover:text-white transition-all duration-500 flex items-center justify-center shadow-inner">
                            <Calendar size={24} />
                          </div>
                          <div className="text-right">
                            <p className="text-[16px] font-extrabold text-[#0b0b0c]">{time}</p>
                            <p className="text-[11px] font-extrabold text-[#4a4a68] uppercase tracking-wider mt-0.5 opacity-70">{date}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[18px] font-bold tracking-tight text-[#0b0b0c] line-clamp-1 group-hover:text-[#0020d7] transition-colors">
                            {booking.title || "Consultation Meeting"}
                          </h4>
                          <div className="flex items-center gap-2.5 text-[13px] font-bold text-[#4a4a68]">
                            <div className="h-6 w-6 rounded-full bg-[#f7f4ef] flex items-center justify-center">
                              <User size={12} className="text-[#0020d7]" />
                            </div>
                            <span>{booking.attendees?.[0]?.name || "Unidentified Guest"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <a 
                            href={`mailto:${booking.attendees?.[0]?.email}`}
                            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-[16px] bg-[#f7f4ef] text-[11px] font-extrabold uppercase tracking-widest text-[#0b0b0c] hover:bg-[#e4e4e7] transition-all active:scale-95"
                          >
                            <Mail size={14} />
                            Mail
                          </a>
                          {booking.videoCallUrl && (
                            <a 
                              href={booking.videoCallUrl}
                              target="_blank"
                              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-[16px] bg-[#0020d7] text-[11px] font-extrabold uppercase tracking-widest text-white hover:bg-[#001bb0] transition-all active:scale-95 shadow-lg shadow-[#0020d7]/20"
                            >
                              <Video size={14} />
                              Join
                            </a>
                          )}
                        </div>
                      </motion.article>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </SectionPanel>
        </main>
      </div>
    </AdminSectionWorkspace>
  );
}
