export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback: "up" | "down" | null;
}

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

export type ProgressState = Record<string, boolean>;

export interface CurriculumTopic {
  id: string;
  label: string;
}

export interface CurriculumStage {
  stage: string;
  title: string;
  topics: CurriculumTopic[];
}
