import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Privacy Policy | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: "Read our full privacy policy.",
};

export default function PrivacyPage() {
  const filePath = path.join(
    process.cwd(),
    "src/app/(landing)/privacy-policy/privacy.md"
  );
  // Handle case where file might not exist during build if not careful, but for this task it exists.
  let markdown = "";
  try {
    markdown = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error("Error reading privacy.md", error);
    markdown = "# Privacy Policy\n\nContent not found.";
  }

  return (
    <div className="container mx-auto py-24 px-4 max-w-3xl">
      <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}
