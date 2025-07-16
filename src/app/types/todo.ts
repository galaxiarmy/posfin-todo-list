// app/types/todo.ts
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  isApiTask: boolean;
}

export interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface CreateTodoData {
  title: string;
  description?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export type FilterType = 'all' | 'completed' | 'incomplete';

export interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
  editingTodo: Todo | null;
  setFilter: (filter: FilterType) => void;
  setEditingTodo: (todo: Todo | null) => void;
  setError: (error: string | null) => void;
  createTodo: (todoData: CreateTodoData) => Promise<Todo>;
  updateTodo: (id: number, updates: UpdateTodoData) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
  fetchApiTodos: () => Promise<void>;
}
