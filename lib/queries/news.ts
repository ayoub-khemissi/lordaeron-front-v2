import type { NewsRow } from "@/types";

import { RowDataPacket, ResultSetHeader } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function getLatestNews(limit: number = 5): Promise<NewsRow[]> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM news WHERE is_active = 1 AND published_at <= NOW() ORDER BY published_at DESC LIMIT ?",
    [String(limit)],
  );

  return (rows as NewsRow[]).map(parseNewsRow);
}

export async function getNewsById(id: number): Promise<NewsRow | null> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM news WHERE id = ? AND is_active = 1 AND published_at <= NOW()",
    [id],
  );

  if (rows.length === 0) return null;

  return parseNewsRow(rows[0] as NewsRow);
}

export async function getNewsPaginated(
  limit: number,
  offset: number,
): Promise<{ rows: NewsRow[]; total: number }> {
  const [countResult] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM news WHERE is_active = 1 AND published_at <= NOW()",
  );
  const total = (countResult[0] as { total: number }).total;

  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM news WHERE is_active = 1 AND published_at <= NOW() ORDER BY published_at DESC LIMIT ? OFFSET ?",
    [String(limit), String(offset)],
  );

  return { rows: (rows as NewsRow[]).map(parseNewsRow), total };
}

export async function getAllNewsAdmin(): Promise<NewsRow[]> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM news ORDER BY created_at DESC",
  );

  return (rows as NewsRow[]).map(parseNewsRow);
}

export async function getNewsByIdAdmin(id: number): Promise<NewsRow | null> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM news WHERE id = ?",
    [id],
  );

  if (rows.length === 0) return null;

  return parseNewsRow(rows[0] as NewsRow);
}

export async function createNews(data: {
  title_en: string;
  title_fr: string;
  title_es: string;
  title_de: string;
  title_it: string;
  content_en: string;
  content_fr: string;
  content_es: string;
  content_de: string;
  content_it: string;
  image_url: string | null;
  author_name: string;
  published_at: string;
  is_active: boolean;
}): Promise<number> {
  const [result] = await websiteDb.execute<ResultSetHeader>(
    `INSERT INTO news (
      title_en, title_fr, title_es, title_de, title_it,
      content_en, content_fr, content_es, content_de, content_it,
      image_url, author_name, published_at, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title_en,
      data.title_fr,
      data.title_es,
      data.title_de,
      data.title_it,
      data.content_en,
      data.content_fr,
      data.content_es,
      data.content_de,
      data.content_it,
      data.image_url,
      data.author_name,
      data.published_at,
      data.is_active ? 1 : 0,
    ],
  );

  return result.insertId;
}

export async function updateNews(
  id: number,
  data: Partial<{
    title_en: string;
    title_fr: string;
    title_es: string;
    title_de: string;
    title_it: string;
    content_en: string;
    content_fr: string;
    content_es: string;
    content_de: string;
    content_it: string;
    image_url: string | null;
    author_name: string;
    published_at: string;
    is_active: boolean;
  }>,
): Promise<boolean> {
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  const fieldMap: Record<string, unknown> = {
    title_en: data.title_en,
    title_fr: data.title_fr,
    title_es: data.title_es,
    title_de: data.title_de,
    title_it: data.title_it,
    content_en: data.content_en,
    content_fr: data.content_fr,
    content_es: data.content_es,
    content_de: data.content_de,
    content_it: data.content_it,
    image_url: data.image_url,
    author_name: data.author_name,
    published_at: data.published_at,
  };

  for (const [key, value] of Object.entries(fieldMap)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      params.push(value as string | number | null);
    }
  }

  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    params.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return false;

  params.push(id);
  const [result] = await websiteDb.execute<ResultSetHeader>(
    `UPDATE news SET ${fields.join(", ")} WHERE id = ?`,
    params,
  );

  return result.affectedRows > 0;
}

export async function deleteNews(id: number): Promise<boolean> {
  const [result] = await websiteDb.execute<ResultSetHeader>(
    "DELETE FROM news WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
}

function parseNewsRow(row: NewsRow): NewsRow {
  return {
    ...row,
    is_active: Boolean(row.is_active),
  };
}
