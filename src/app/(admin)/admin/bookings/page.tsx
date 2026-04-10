"use client";

import { useEffect, useState } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetch("/api/cal/bookings", { cache: "no-store" });
        if (!response.ok) {
          setStatus("Failed to load upcoming bookings.");
          return;
        }

        const data = await response.json();
        if (data.error) {
          setStatus(data.error);
        } else {
          setBookings(data.bookings || []);
        }
      } catch {
        setStatus("Network error loading bookings.");
      } finally {
        setLoading(false);
      }
    }

    queueMicrotask(() => {
      void loadData();
    });
  }, []);

  if (loading) {
    return <div className="text-sm text-[var(--color-text-body)]">Loading upcoming bookings...</div>;
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Appointments"
      sectionTitle="Incoming Call Bookings"
      sectionDescription="Review your scheduled Cal.com appointments synced directly from the API."
      previewPath="/"
    >
      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-[#0b0b0c]">Upcoming Appointments</h3>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0020d7] border border-blue-200">
            Live from Cal.com
          </span>
        </div>

        {status && <p className="mb-4 text-sm text-red-500">{status}</p>}

        {bookings.length === 0 && !status ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border-medium)] p-8 text-center bg-[#f8f5f2]">
            <p className="text-sm text-[var(--color-text-body)]">No upcoming bookings found at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking: any) => {
              const date = new Date(booking.startTime).toLocaleDateString("en-US", {
                weekday: 'short', month: 'short', day: 'numeric'
              });
              const time = new Date(booking.startTime).toLocaleTimeString("en-US", {
                hour: 'numeric', minute: '2-digit'
              });

              return (
                <div 
                  key={booking.uid || booking.id} 
                  className="rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-black/20 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-[#0b0b0c]">
                      {booking.title || "Meeting"}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text-body)] mt-1">
                      with {booking.attendees?.[0]?.name || "Guest"}
                    </span>
                    {booking.attendees?.[0]?.email && (
                      <a href={`mailto:${booking.attendees[0].email}`} className="text-xs text-[#0020d7] hover:underline mt-1">
                        {booking.attendees[0].email}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <div className="rounded-md border border-[var(--color-border-medium)] bg-white px-3 py-1.5 shadow-sm text-sm font-medium text-black">
                      {date} at {time}
                    </div>
                    {booking.videoCallUrl && (
                      <a 
                        href={booking.videoCallUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#0020d7] hover:underline mt-1"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AdminSectionWorkspace>
  );
}
