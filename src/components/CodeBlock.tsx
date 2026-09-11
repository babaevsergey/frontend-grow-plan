import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";

export function CodeBlock({ code }: { code: string }) {
  const html = Prism.highlight(code, Prism.languages.tsx, "tsx");

  return (
    <pre className="code-darcula overflow-x-auto rounded-lg px-4 py-3 text-xs leading-relaxed">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
