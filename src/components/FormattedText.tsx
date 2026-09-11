/**
 * Рендерит текст с поддержкой **жирного** (markdown-lite) и абзацев.
 * Абзацы разделяются пустой строкой (\n\n), одиночный \n внутри абзаца — <br/>.
 * Используется там, где контент — это обычная строка в content.ts (не JSX),
 * но некоторые строки (заголовки блоков, подвопросы) должны быть выделены жирным.
 */
function renderInline(line: string, keyPrefix: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export function FormattedText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <div className={className}>
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n");
        return (
          <p key={pi} className={pi > 0 ? "mt-3" : undefined}>
            {lines.map((line, li) => (
              <span key={li}>
                {renderInline(line, `${pi}-${li}`)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
