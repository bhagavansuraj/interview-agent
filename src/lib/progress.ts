import type { ChatMessage, ProgressState } from "./types";

const MESSAGES_KEY = "sd-companion-messages";
const PROGRESS_KEY = "sd-companion-progress";

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm your system design companion — here to help you understand how software systems work, without needing a computer science degree.\n\nSystem design comes up in product interviews, when working with engineers, and when making decisions about your product's roadmap. I'll guide you through it step by step, at your pace.\n\nTo start: how familiar are you with system design right now?\n\n- **Not at all** — I've never really thought about it\n- **A little** — I've heard terms like \"API\" or \"database\" but couldn't explain them\n- **Some** — I know the basics but want to get interview-ready",
    feedback: null,
  },
];

export function parseProgressTags(
  text: string
): Array<{ stage: string; topic: string }> {
  const regex = /<progress stage="(\d+)" topic="([^"]+)" \/>/g;
  const matches: Array<{ stage: string; topic: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ stage: match[1], topic: match[2] });
  }
  return matches;
}

export function stripProgressTags(text: string): string {
  return text.replace(/<progress stage="\d+" topic="[^"]+" \/>\n?/g, "").trim();
}

export function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? (JSON.parse(stored) as ProgressState) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressState): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage errors
  }
}

export function loadMessages(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    return stored ? (JSON.parse(stored) as ChatMessage[]) : INITIAL_MESSAGES;
  } catch {
    return INITIAL_MESSAGES;
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // ignore storage errors
  }
}

export function clearMessages(): void {
  try {
    localStorage.removeItem(MESSAGES_KEY);
  } catch {
    // ignore
  }
}
