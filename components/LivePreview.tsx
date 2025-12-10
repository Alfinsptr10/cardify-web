"use client";
import React from "react";

type Props = {
  templateHtml: string; // template with placeholders like {{title}}
  fields: Record<string,string>;
};

function escapeHtml(s: string) {
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

export default function LivePreview({ templateHtml, fields }: Props) {
  // simple replace
  let html = templateHtml;
  for (const k of Object.keys(fields)) {
    const v = escapeHtml(fields[k] || "");
    html = html.split(`{{${k}}}`).join(v);
  }

  return (
    <div className="border p-4 rounded bg-white overflow-auto">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
