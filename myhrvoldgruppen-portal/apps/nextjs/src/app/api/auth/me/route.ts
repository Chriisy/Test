import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("X-Replit-User-Id");
  const userName = request.headers.get("X-Replit-User-Name");
  const userImage = request.headers.get("X-Replit-User-Profile-Image");

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    id: userId,
    name: userName || "Bruker",
    profileImage: userImage,
  });
}
