import { NextResponse } from "next/server";
import { getLatestArticles } from "@/lib/wissen";

export const revalidate = 60;

export async function GET() {
  try {
    const articles = await getLatestArticles(3);
    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ articles: [] });
  }
}
