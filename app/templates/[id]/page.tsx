"use client";

import fs from "fs";
import path from "path";
import EditorForm from "@/components/EditorForm";
import LivePreview from "@/components/LivePreview";
import { useState } from "react";

type Params = { params: { id: string } };

export default function TemplateEditor({ params }: Params) {
  const id = params.id;
  // read template files server-side
  const templatesDir = path.join(process.cwd(), "templates", id);
  let html = "<div>Template not found</div>";
  let meta = { name: id, fields: [] as string[] };
  try {
    html = fs.readFileSync(path.join(templatesDir, "index.html"), "utf-8");
    const mf = fs.readFileSync(path.join(templatesDir, "metadata.json"), "utf-8");
    meta = JSON.parse(mf);
  } catch (e) {
    // ignore
  }

  // Client state for preview fields
  const [fields, setFields] = useState<Record<string,string>>({});

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div>
        <EditorForm templateMeta={meta} onPreviewChange={(f)=>setFields(f)} />
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Live Preview</h3>
        <LivePreview templateHtml={html} fields={fields} />
      </div>
    </div>
  );
}
