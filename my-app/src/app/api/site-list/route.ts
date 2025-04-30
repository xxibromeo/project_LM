// app/api/site-list/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const sites = await prisma.site.findMany();
  return NextResponse.json(sites);
}
