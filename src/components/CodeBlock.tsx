"use client";

import { useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";

export function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const html = Prism.highlight(code, Prism.languages.tsx, "tsx");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Буфер обмена недоступен (например, нет разрешения в браузере) — молча игнорируем.
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700/50">
      <div className="flex items-center justify-between bg-[#242424] px-3 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded px-2 py-0.5 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
        >
          {copied ? "✓ Скопировано" : "Copy"}
        </button>
      </div>
      <pre className="code-darcula overflow-x-auto px-4 py-3 text-xs leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
