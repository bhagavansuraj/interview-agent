import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "./Message";
import { ProgressSidebar } from "./ProgressSidebar";
import type { ChatMessage, ApiMessage, ProgressState } from "../lib/types";
import {
  loadMessages,
  saveMessages,
  clearMessages,
  loadProgress,
  saveProgress,
  parseProgressTags,
  stripProgressTags,
  INITIAL_MESSAGES,
} from "../lib/progress";

let idCounter = 0;
function genId() {
  return `msg-${Date.now()}-${++idCounter}`;
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({});
  const [error, setError] = useState<string | null>(null);
  const streamingIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load persisted state on mount
  useEffect(() => {
    setMessages(loadMessages());
    setProgress(loadProgress());
  }, []);

  // Persist messages whenever they change (skip initial render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveMessages(messages);
  }, [messages]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const applyProgress = useCallback(
    (tags: Array<{ stage: string; topic: string }>) => {
      if (tags.length === 0) return;
      setProgress((prev) => {
        const next = { ...prev };
        tags.forEach(({ stage, topic }) => {
          next[`stage${stage}-${topic}`] = true;
        });
        saveProgress(next);
        return next;
      });
    },
    []
  );

  async function sendMessage(userText: string) {
    if (!userText.trim() || isStreaming) return;

    setError(null);

    const userMsg: ChatMessage = {
      id: genId(),
      role: "user",
      content: userText.trim(),
      feedback: null,
    };

    const assistantId = genId();
    streamingIdRef.current = assistantId;

    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      feedback: null,
    };

    const updatedMessages = [...messages, userMsg, assistantMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    // Build API payload — strip UI-only fields
    const apiMessages: ApiMessage[] = updatedMessages
      .filter((m) => m.id !== assistantId)
      .map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        // Update the streaming message in real time
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullContent } : m
          )
        );
      }

      // Streaming complete — parse progress tags and clean content
      const progressTags = parseProgressTags(fullContent);
      const cleanContent = stripProgressTags(fullContent);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: cleanContent } : m
        )
      );

      applyProgress(progressTags);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
      streamingIdRef.current = null;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  function handleFeedback(id: string, value: "up" | "down") {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, feedback: m.feedback === value ? null : value } : m
      )
    );
  }

  function handleNewChat() {
    clearMessages();
    setMessages(INITIAL_MESSAGES);
    setError(null);
    // Keep progress — it's cumulative across sessions
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
        <span className="font-semibold tracking-tight text-gray-900">
          System Design Companion
        </span>
        <button
          onClick={handleNewChat}
          className="text-sm text-gray-400 transition hover:text-gray-900"
        >
          New chat
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat column */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  message={msg}
                  onFeedback={handleFeedback}
                  isStreaming={
                    isStreaming && msg.id === streamingIdRef.current
                  }
                />
              ))}

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                  {error}
                </p>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 px-6 py-4">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-2xl gap-3"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
                placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-gray-900 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="flex-shrink-0 self-end rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-40"
              >
                Send
              </button>
            </form>
            <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-gray-400">
              Powered by Claude · Progress saved locally in your browser
            </p>
          </div>
        </div>

        {/* Progress sidebar */}
        <ProgressSidebar progress={progress} />
      </div>
    </div>
  );
}
