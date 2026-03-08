import type { CurriculumStage } from "./types";

export const CURRICULUM: CurriculumStage[] = [
  {
    stage: "1",
    title: "The Big Picture",
    topics: [
      { id: "what-is-a-system", label: "What is a system?" },
      { id: "clients-and-servers", label: "Clients & servers" },
      { id: "how-internet-works", label: "How the internet works" },
      { id: "pm-why-system-design", label: "Why PMs need this" },
    ],
  },
  {
    stage: "2",
    title: "Core Building Blocks",
    topics: [
      { id: "databases", label: "Databases" },
      { id: "apis", label: "APIs" },
      { id: "caching", label: "Caching" },
      { id: "cdns", label: "CDNs" },
    ],
  },
  {
    stage: "3",
    title: "Scaling Up",
    topics: [
      { id: "scaling-basics", label: "What scaling means" },
      { id: "load-balancing", label: "Load balancing" },
      { id: "horizontal-vertical", label: "Horizontal vs vertical scaling" },
      { id: "microservices", label: "Microservices vs monolith" },
    ],
  },
  {
    stage: "4",
    title: "Real-World Design",
    topics: [
      { id: "url-shortener", label: "Design a URL shortener" },
      { id: "social-feed", label: "Design a social feed" },
      { id: "notifications", label: "Design a notification system" },
      { id: "search", label: "Design a search feature" },
    ],
  },
  {
    stage: "5",
    title: "Interview Ready",
    topics: [
      { id: "interview-structure", label: "Structuring your answer" },
      { id: "clarifying-questions", label: "Clarifying questions" },
      { id: "trade-offs", label: "Discussing trade-offs" },
      { id: "practice", label: "Practice questions" },
    ],
  },
];

export const TOTAL_TOPICS = CURRICULUM.reduce(
  (sum, stage) => sum + stage.topics.length,
  0
);
