import { NextRequest, NextResponse } from "next/server";

import { getLatestNews, getNewsPaginated } from "@/lib/queries/news";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const limit = parseInt(searchParams.get("limit") || "5");
    const offsetParam = searchParams.get("offset");

    let news;
    let total: number | undefined;

    if (offsetParam !== null) {
      const offset = parseInt(offsetParam);
      const result = await getNewsPaginated(limit, offset);

      news = result.rows;
      total = result.total;
    } else {
      news = await getLatestNews(limit);
    }

    const localized = news.map((item) => ({
      id: item.id,
      title: item[`title_${locale}` as keyof typeof item] || item.title_en,
      content:
        item[`content_${locale}` as keyof typeof item] || item.content_en,
      image_url: item.image_url,
      author_name: item.author_name,
      published_at: item.published_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    if (total !== undefined) {
      return NextResponse.json({ news: localized, total });
    }

    return NextResponse.json(localized);
  } catch (error) {
    console.error("News fetch error:", error);

    return NextResponse.json([], { status: 200 });
  }
}
