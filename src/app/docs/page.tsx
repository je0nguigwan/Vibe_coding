import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NavBar from "@/components/nav-bar";

async function loadDoc(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);
  return fs.readFile(filePath, "utf-8");
}

export default async function DocsPage() {
  const [problem, solution, prd, design] = await Promise.all([
    loadDoc("PROBLEM.md"),
    loadDoc("SOLUTION.md"),
    loadDoc("PRD.md"),
    loadDoc("DESIGN.md"),
  ]);

  return (
    <div className="space-y-6">
      <NavBar title="Docs" showBack />
      {[
        { title: "Problem", body: problem },
        { title: "Solution", body: solution },
        { title: "PRD", body: prd },
        { title: "Design", body: design },
      ].map((doc) => (
        <div key={doc.title} className="rounded-3xl border border-[#ecd9cb] bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[color:var(--primary)]">
            {doc.title}
          </h2>
          <div className="prose prose-sm mt-4 max-w-none text-[#6b4b3e]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
