import { NextRequest, NextResponse } from "next/server";

import { getNewsById } from "@/lib/queries/news";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const { id } = await params;

    const item = await getNewsById(parseInt(id));

    if (!item) {
      return NextResponse.json({ error: "notFound" }, { status: 404 });
    }

    const article = {
      id: item.id,
      title: item[`title_${locale}` as keyof typeof item] || item.title_en,
      content:
        item[`content_${locale}` as keyof typeof item] || item.content_en,
      image_url: item.image_url,
      author_name: item.author_name,
      published_at: item.published_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };

    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
