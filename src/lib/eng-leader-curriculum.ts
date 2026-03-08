import type { CurriculumStage } from "./types";

export const ENG_LEADER_CURRICULUM: CurriculumStage[] = [
  {
    stage: "1",
    title: "Distributed Systems Depth",
    topics: [
      { id: "cap-theorem", label: "CAP theorem in practice" },
      { id: "consistency-models", label: "Consistency models" },
      { id: "fault-tolerance", label: "Failure modes & fault tolerance" },
      { id: "distributed-consensus", label: "Distributed consensus" },
    ],
  },
  {
    stage: "2",
    title: "Advanced Architecture Patterns",
    topics: [
      { id: "event-driven", label: "Event-driven architecture" },
      { id: "cqrs-event-sourcing", label: "CQRS & event sourcing" },
      { id: "saga-pattern", label: "Saga pattern" },
      { id: "api-design-scale", label: "API design at scale" },
    ],
  },
  {
    stage: "3",
    title: "Infrastructure & Reliability",
    topics: [
      { id: "multi-region", label: "Multi-region deployment" },
      { id: "database-scaling", label: "Database scaling deep-dive" },
      { id: "rate-limiting", label: "Rate limiting & backpressure" },
      { id: "observability", label: "Observability at scale" },
    ],
  },
  {
    stage: "4",
    title: "Technical Leadership",
    topics: [
      { id: "build-buy-integrate", label: "Build vs buy vs integrate" },
      { id: "platform-engineering", label: "Platform engineering strategy" },
      { id: "technical-debt", label: "Technical debt as strategy" },
      { id: "communicating-arch", label: "Communicating architecture" },
    ],
  },
  {
    stage: "5",
    title: "Senior Interview Scenarios",
    topics: [
      { id: "staff-principal-design", label: "Staff/Principal level design" },
      { id: "em-vp-format", label: "EM/VP/HoE interview format" },
      { id: "architecture-review", label: "Architecture review & RFCs" },
      { id: "conways-law", label: "Conway's Law & team topology" },
    ],
  },
];

export const ENG_LEADER_TOTAL_TOPICS = ENG_LEADER_CURRICULUM.reduce(
  (sum, stage) => sum + stage.topics.length,
  0
);
