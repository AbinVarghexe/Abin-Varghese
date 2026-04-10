import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.CAL_API_KEY;
    const username = process.env.CAL_USERNAME || "abinvarghese"; // fallback to known username

    if (!apiKey) {
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 }
      );
    }

    // Calculate dates for the next 7 days to check availability
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const dateFrom = today.toISOString().split("T")[0];
    const dateTo = nextWeek.toISOString().split("T")[0];

    // Fetch the user's event types to get the first available one to check slots against
    const eventTypesRes = await fetch(`https://api.cal.com/v1/event-types?apiKey=${apiKey}`);
    
    if (!eventTypesRes.ok) {
      throw new Error("Failed to fetch event types from Cal.com");
    }

    const eventTypesData = await eventTypesRes.json();
    const defaultEventType = eventTypesData.event_types?.[0]; // pick the primary event type

    if (!defaultEventType) {
      return NextResponse.json({ available: false, message: "No event types found." });
    }

    // Now query the available slots for this specific event type in the next 7 days
    const slotsRes = await fetch(
      `https://api.cal.com/v1/slots?apiKey=${apiKey}&eventTypeId=${defaultEventType.id}&startTime=${dateFrom}&endTime=${dateTo}`
    );

    if (!slotsRes.ok) {
      throw new Error("Failed to fetch slots from Cal.com");
    }

    const slotsData = await slotsRes.json();
    
    // slotsData.slots is typically an object with dates as keys, and arrays of slots as values
    const slots = slotsData.slots || {};
    let firstAvailableDate = null;
    let totalSlotsCount = 0;

    for (const [date, dailySlots] of Object.entries(slots)) {
      const arr = dailySlots as any[];
      if (arr && arr.length > 0) {
        totalSlotsCount += arr.length;
        if (!firstAvailableDate) {
          firstAvailableDate = new Date(date);
        }
      }
    }

    if (totalSlotsCount > 0 && firstAvailableDate) {
      const isToday = firstAvailableDate.toDateString() === today.toDateString();
      const isTomorrow = new Date(today.getTime() + 86400000).toDateString() === firstAvailableDate.toDateString();
      
      let relativeText = firstAvailableDate.toLocaleDateString('en-US', { weekday: 'long' });
      if (isToday) relativeText = "Today";
      else if (isTomorrow) relativeText = "Tomorrow";

      return NextResponse.json({
        available: true,
        message: `Available for a call ${relativeText}`,
        nextSlot: firstAvailableDate.toISOString(),
      });
    }

    return NextResponse.json({
      available: false,
      message: "Fully booked right now",
    });

  } catch (error: any) {
    console.error("Cal.com API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability", details: error.message },
      { status: 500 }
    );
  }
}
