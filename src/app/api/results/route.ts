import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { ResultsMap, MatchResult } from "@/data/schedule";

const RESULTS_KEY = "results";

export async function GET() {
  try {
    const results = (await kv.get<ResultsMap>(RESULTS_KEY)) ?? {};
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  // Check admin password
  const authHeader = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchId, sets } = body as MatchResult;

    if (!matchId || !sets || sets.length !== 3) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const existing = (await kv.get<ResultsMap>(RESULTS_KEY)) ?? {};
    existing[matchId] = { matchId, sets };
    await kv.set(RESULTS_KEY, existing);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin password
  const authHeader = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");
    if (!matchId) return NextResponse.json({ error: "matchId required" }, { status: 400 });

    const existing = (await kv.get<ResultsMap>(RESULTS_KEY)) ?? {};
    delete existing[matchId];
    await kv.set(RESULTS_KEY, existing);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
