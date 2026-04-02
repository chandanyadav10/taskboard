"use client";

import { Task, TaskStatus } from "@/types";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

interface TaskCardProps {
  task: Task;
  isUpdating: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskCard({ task, isUpdating, onStatusChange }: TaskCardProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as TaskStatus);
  };

  const createdDate = new Date(task.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 transition-opacity ${isUpdating ? "opacity-50" : ""}`}>
      <p className="text-sm font-medium text-gray-800 mb-2.5 leading-snug">{task.title}</p>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-gray-400">{createdDate}</span>

        <div className="relative">
          {isUpdating ? (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving...
            </div>
          ) : (
            <select
              value={task.status}
              onChange={handleChange}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none pr-5"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
