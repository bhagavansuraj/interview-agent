import type { CurriculumStage, ProgressState } from "../lib/types";

interface Props {
  progress: ProgressState;
  curriculum: CurriculumStage[];
}

export function ProgressSidebar({ progress, curriculum }: Props) {
  const totalTopics = curriculum.reduce((sum, s) => sum + s.topics.length, 0);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const percentage =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-l border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Your Roadmap
        </p>
        <div className="mt-3">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-sm text-gray-600">
              {completedCount} of {totalTopics} topics
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {percentage}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-gray-900 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-5">
          {curriculum.map((stage) => {
            const stageDone = stage.topics.filter(
              (t) => progress[`stage${stage.stage}-${t.id}`]
            ).length;

            return (
              <div key={stage.stage}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Stage {stage.stage}
                  </p>
                  <span className="text-xs text-gray-400">
                    {stageDone}/{stage.topics.length}
                  </span>
                </div>
                <p className="mb-2 text-xs font-medium text-gray-700">
                  {stage.title}
                </p>
                <ul className="space-y-1.5">
                  {stage.topics.map((topic) => {
                    const key = `stage${stage.stage}-${topic.id}`;
                    const done = progress[key] === true;
                    return (
                      <li
                        key={topic.id}
                        className={`flex items-center gap-2 text-xs ${
                          done ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border text-[10px] ${
                            done
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {done && "✓"}
                        </span>
                        {topic.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
