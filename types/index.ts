export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTaskPayload {
  title: string;
  status: TaskStatus;
}

export interface UpdateTaskPayload {
  status: TaskStatus;
}
