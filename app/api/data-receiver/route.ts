import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  // Handle preflight CORS request
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.NEXT_PUBLIC_CENTRAL_SYSTEM_FRONTEND_URL ||
        "http://localhost:3001",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const response = NextResponse.json({ success: true });

    // Set cookie for client route to read
    response.cookies.set("profile_data", JSON.stringify(data), {
      maxAge: 600,
      path: "/",
      httpOnly: false, // Accessible to client-side JavaScript
      sameSite: "lax",
    });

    // ✅ Set CORS headers here too
    response.headers.set(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_CENTRAL_SYSTEM_FRONTEND_URL ||
        "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error processing JSON data:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to process JSON data",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
