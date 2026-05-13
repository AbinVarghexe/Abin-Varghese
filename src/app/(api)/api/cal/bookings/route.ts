import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.CAL_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 }
      );
    }

    // Fetch upcoming bookings using Cal.com v1 API
    const bookingsRes = await fetch(
      `https://api.cal.com/v1/bookings?apiKey=${apiKey}&status=upcoming`
    );

    if (!bookingsRes.ok) {
      throw new Error(`Failed to fetch bookings: ${bookingsRes.status}`);
    }

    const data = await bookingsRes.json();

    return NextResponse.json({
      bookings: data.bookings || [],
    });

  } catch (error: any) {
    console.error("Cal.com Bookings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
}
