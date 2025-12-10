import fs from "fs";
import path from "path";

export default function PublicPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const storePath = path.join(process.cwd(), "data", "projects.json");
  let projects = [];
  try { projects = JSON.parse(fs.readFileSync(storePath, "utf-8") || "[]"); } catch(e){ projects = []; }

  const project = projects.find((p: any) => p.id === slug);
  if (!project) {
    return <div className="p-8">Page not found</div>;
  }

  const templatesDir = path.join(process.cwd(), "templates", project.templateId);
  let html = "<div>template missing</div>";
  try {
    html = fs.readFileSync(path.join(templatesDir, "index.html"), "utf-8");
    for (const k of Object.keys(project.fields || {})) {
      const v = String(project.fields[k] || "");
      // basic escape
      const esc = v.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
      html = html.split(`{{${k}}}`).join(esc);
    }
  } catch(e) {}

  return (
    <div className="p-6">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
