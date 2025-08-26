export interface Todo {
  id: string;
  title: string;
  status: "未着手" | "着手中" | "完了";
  deadline?: string;
  createdAt: string;
}

export interface CreateTodoRequest {
  title: string;
  deadline?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  status?: "未着手" | "着手中" | "完了";
  deadline?: string;
}
