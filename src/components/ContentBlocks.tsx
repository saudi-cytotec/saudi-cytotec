import type { ContentBlock } from "../types";

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="article-prose">
      {blocks.map((block, i) => {
        if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
        if (block.type === "ul") {
          return (
            <ul key={i}>
              {(block.items ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "callout") {
          const tone =
            block.tone === "emergency"
              ? "border-clay bg-[#f8ece6]"
              : block.tone === "warning"
                ? "border-gold bg-[#f6efe3]"
                : "border-sage bg-[#eef5f0]";
          return (
            <aside key={i} className={`my-5 rounded-2xl border-r-4 px-4 py-3 leading-[2.05] ${tone}`}>
              {block.text}
            </aside>
          );
        }
        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}
