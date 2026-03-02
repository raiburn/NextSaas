import { NextResponse, NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const payload = await verifyAuthToken(token);
    return NextResponse.json(
      { user: { id: payload.sub, email: payload.email } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}