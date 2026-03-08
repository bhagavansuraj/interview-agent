import type { ChatMessage } from "../lib/types";

interface Props {
  message: ChatMessage;
  onFeedback: (id: string, value: "up" | "down") => void;
  isStreaming?: boolean;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const isBulletList = lines.some((l) => /^[-*] /.test(l));

    if (isBulletList) {
      const items = lines.filter((l) => /^[-*] /.test(l));
      return (
        <ul key={i} className="my-2 list-disc space-y-1 pl-5">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item.replace(/^[-*] /, ""))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i} className="mb-2 last:mb-0">
        {renderInline(block)}
      </p>
    );
  });
}

export function Message({ message, onFeedback, isStreaming }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isUser ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {isUser ? "You" : "AI"}
      </div>

      {/* Content */}
      <div
        className={`flex max-w-prose flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-gray-900 text-white"
              : "bg-gray-50 text-gray-900 ring-1 ring-gray-200"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div>
              {renderMarkdown(message.content)}
              {isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* Thumbs feedback — assistant messages only, once streaming is done */}
        {!isUser && !isStreaming && (
          <div className="flex gap-1">
            <button
              onClick={() => onFeedback(message.id, "up")}
              title="Helpful"
              className={`rounded p-1 text-sm transition ${
                message.feedback === "up"
                  ? "text-gray-900"
                  : "text-gray-300 hover:text-gray-600"
              }`}
            >
              👍
            </button>
            <button
              onClick={() => onFeedback(message.id, "down")}
              title="Not helpful"
              className={`rounded p-1 text-sm transition ${
                message.feedback === "down"
                  ? "text-gray-900"
                  : "text-gray-300 hover:text-gray-600"
              }`}
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
