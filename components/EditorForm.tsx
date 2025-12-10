"use client";
import { useState } from "react";

type Props = {
  templateMeta: { name: string; fields: string[] };
  onPreviewChange?: (fields: Record<string,string>) => void;
};

export default function EditorForm({ templateMeta, onPreviewChange }: Props) {
  // build initial state from templateMeta.fields
  const initial: Record<string,string> = {};
  templateMeta.fields.forEach(f => initial[f] = "");
  const [fields, setFields] = useState<Record<string,string>>(initial);
  const [loading, setLoading] = useState(false);

  function handleChange(key: string, val: string) {
    const next = { ...fields, [key]: val };
    setFields(next);
    onPreviewChange?.(next);
  }

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: templateMeta.name,
          fields,
        }),
      });
      const data = await res.json();
      if (data?.publicUrl) {
        window.open(data.publicUrl, "_blank");
      } else {
        alert("Generate failed: " + (data?.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Error generating page");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{templateMeta.name} — Editor</h3>

      {templateMeta.fields.map((f) => (
        <div key={f}>
          <label className="block text-sm font-medium">{f}</label>
          <input
            className="mt-1 block w-full border rounded px-2 py-1"
            value={fields[f]}
            onChange={(e) => handleChange(f, e.target.value)}
            placeholder={`Masukkan ${f}`}
          />
        </div>
      ))}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-sky-600 text-white rounded"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
