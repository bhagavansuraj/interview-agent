import type { ChatMessage, Persona, ProgressState } from "./types";

const KEYS: Record<Persona, { messages: string; progress: string }> = {
  pm: {
    messages: "sd-companion-messages",
    progress: "sd-companion-progress",
  },
  "eng-leader": {
    messages: "sd-el-messages",
    progress: "sd-el-progress",
  },
};

export const INITIAL_MESSAGES: Record<Persona, ChatMessage[]> = {
  pm: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your system design companion — here to help you understand how software systems work, without needing a computer science degree.\n\nSystem design comes up in product interviews, when working with engineers, and when making decisions about your product's roadmap. I'll guide you through it step by step, at your pace.\n\nTo start: how familiar are you with system design right now?\n\n- **Not at all** — I've never really thought about it\n- **A little** — I've heard terms like \"API\" or \"database\" but couldn't explain them\n- **Some** — I know the basics but want to get interview-ready",
      feedback: null,
    },
  ],
  "eng-leader": [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey — glad you're here. This is a space to sharpen your system design thinking at the level that matters for engineering leadership: trade-offs at scale, organizational constraints, and the kind of depth that separates good from great in senior interviews.\n\nBefore we dive in, a quick calibration: what's your current focus?\n\n- **Interview prep** — I have an EM, Staff, or VP role coming up and want to sharpen my system design\n- **Depth on a specific area** — distributed systems, reliability, data architecture, etc.\n- **Leadership scenarios** — build vs buy, platform strategy, communicating architecture decisions\n- **General levelling up** — I want to work through the full advanced curriculum",
      feedback: null,
    },
  ],
};

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

export function loadProgress(persona: Persona): ProgressState {
  try {
    const stored = localStorage.getItem(KEYS[persona].progress);
    return stored ? (JSON.parse(stored) as ProgressState) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressState, persona: Persona): void {
  try {
    localStorage.setItem(KEYS[persona].progress, JSON.stringify(progress));
  } catch {
    // ignore storage errors
  }
}

export function loadMessages(persona: Persona): ChatMessage[] {
  try {
    const stored = localStorage.getItem(KEYS[persona].messages);
    return stored
      ? (JSON.parse(stored) as ChatMessage[])
      : INITIAL_MESSAGES[persona];
  } catch {
    return INITIAL_MESSAGES[persona];
  }
}

export function saveMessages(messages: ChatMessage[], persona: Persona): void {
  try {
    localStorage.setItem(KEYS[persona].messages, JSON.stringify(messages));
  } catch {
    // ignore storage errors
  }
}

export function clearMessages(persona: Persona): void {
  try {
    localStorage.removeItem(KEYS[persona].messages);
  } catch {
    // ignore
  }
}
