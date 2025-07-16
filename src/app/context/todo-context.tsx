// app/context/TodoContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Todo, ApiTodo, CreateTodoData, UpdateTodoData, FilterType, TodoContextType } from '../types/todo';
import { BASE_URL } from '../utils';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Fetch todos from JSONPlaceholder API
  useEffect(() => {
    fetchApiTodos();
  }, []);

  const fetchApiTodos = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiTodo[]>(BASE_URL);
      // Take only first 10 todos to avoid too much data
      const apiTodos: Todo[] = response.data.slice(0, 10).map((todo: ApiTodo) => ({
        ...todo,
        isApiTask: true,
        description: `Task from API - User ID: ${todo.userId}`
      }));
      setTodos(apiTodos);
    } catch (err) {
      setError('Failed to fetch todos from API');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (todoData: CreateTodoData): Promise<Todo> => {
    try {
      const newTodo: Todo = {
        id: Date.now(), // Simple ID generation for local todos
        title: todoData.title,
        description: todoData.description || '',
        completed: false,
        userId: 1,
        isApiTask: false
      };
      
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError('Failed to create todo');
      throw err;
    }
  };

  // Update todo
  const updateTodo = async (id: number, updates: UpdateTodoData): Promise<void> => {
    try {
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, ...updates } : todo
        )
      );
    } catch (err) {
      setError('Failed to update todo');
      throw err;
    }
  };

  // Delete todo
  const deleteTodo = async (id: number): Promise<void> => {
    try {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      throw err;
    }
  };

  // Toggle todo completion
  const toggleComplete = async (id: number): Promise<void> => {
    try {
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      setError('Failed to toggle todo');
      throw err;
    }
  };

  // Filter todos based on current filter
  const filteredTodos: Todo[] = todos.filter(todo => {
    switch (filter) {
      case 'completed':
        return todo.completed;
      case 'incomplete':
        return !todo.completed;
      default:
        return true;
    }
  });

  const value: TodoContextType = {
    todos,
    filteredTodos,
    loading,
    error,
    filter,
    editingTodo,
    setFilter,
    setEditingTodo,
    setError,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    fetchApiTodos
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}
