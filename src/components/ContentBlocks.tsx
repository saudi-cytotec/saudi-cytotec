import { Link } from "react-router-dom";
import type { ContentBlock } from "../types";

function renderFormattedText(text?: string) {
  if (!text) return "";
  if (!text.includes("[")) return text;
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    if (url.startsWith("/")) {
      elements.push(
        <Link
          key={`${match.index}-${url}`}
          to={url}
          className="font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-deep hover:decoration-brand"
        >
          {label}
        </Link>
      );
    } else {
      elements.push(
        <a
          key={`${match.index}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-deep hover:decoration-brand"
        >
          {label}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="article-prose">
      {blocks.map((block, i) => {
        if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
        if (block.type === "ul") {
          return (
            <ul key={i}>
              {(block.items ?? []).map((item, j) => (
                <li key={j}>{renderFormattedText(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "callout") {
          const tone =
            block.tone === "emergency"
              ? "border-clay bg-[#fae9ea] text-clay"
              : block.tone === "warning"
                ? "border-warn bg-warn-soft"
                : "border-brand bg-brand-soft";
          return (
            <aside key={i} className={`my-5 rounded-2xl border-r-4 px-4 py-3 leading-[2.05] ${tone}`}>
              {renderFormattedText(block.text)}
            </aside>
          );
        }
        return <p key={i}>{renderFormattedText(block.text)}</p>;
      })}
    </div>
  );
}
