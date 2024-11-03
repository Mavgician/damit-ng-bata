import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  return NextResponse.json({ message: 'test' }, { status: 200 })
}