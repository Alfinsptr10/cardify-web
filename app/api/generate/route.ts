import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId, fields } = body;
    const slug = `${templateId}-${Date.now().toString(36).slice(-6)}`;

    const storePath = path.join(process.cwd(), "data", "projects.json");
    let arr = [];
    try {
      arr = JSON.parse(fs.readFileSync(storePath, "utf-8") || "[]");
    } catch (e) { arr = []; }

    const project = {
      id: slug,
      templateId,
      fields,
      createdAt: new Date().toISOString()
    };
    arr.push(project);
    fs.writeFileSync(storePath, JSON.stringify(arr, null, 2), "utf-8");

    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/p/${slug}`;
    return NextResponse.json({ ok: true, publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
