"use client";
import { useState } from "react";
import EditorForm from "@/components/EditorForm";
import LivePreview from "@/components/LivePreview";

export default function EditorShell({ meta, html }: { meta: any, html: string }) {
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
