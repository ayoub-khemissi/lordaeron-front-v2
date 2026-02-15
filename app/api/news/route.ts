import { NextRequest, NextResponse } from "next/server";

import { getLatestNews } from "@/lib/queries/news";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const limit = parseInt(searchParams.get("limit") || "5");

    const news = await getLatestNews(limit);

    const localized = news.map((item) => ({
      id: item.id,
      title:
        item[`title_${locale}` as keyof typeof item] || item.title_en,
      content:
        item[`content_${locale}` as keyof typeof item] || item.content_en,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return NextResponse.json(localized);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
