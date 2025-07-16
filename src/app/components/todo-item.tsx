// app/components/TodoItem.tsx
'use client';

import { useTodos } from '../context/todo-context';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { deleteTodo, toggleComplete, setEditingTodo } = useTodos();

  const handleDelete = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo.id);
      } catch (err) {
        console.error('Error deleting todo:', err);
      }
    }
  };

  const handleToggleComplete = async (): Promise<void> => {
    try {
      await toggleComplete(todo.id);
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const handleEdit = (): void => {
    setEditingTodo(todo);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.isApiTask ? 'api-task' : ''}`}>
      <h3>
        {todo.title}
        <span className={`task-badge ${todo.isApiTask ? 'api' : 'local'}`}>
          {todo.isApiTask ? 'API' : 'Local'}
        </span>
      </h3>
      
      {todo.description && (
        <p>{todo.description}</p>
      )}
      
      <div className="todo-actions">
        <button
          className={`btn btn-small ${todo.completed ? 'btn-warning' : 'btn-success'}`}
          onClick={handleToggleComplete}
        >
          {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        
        <button
          className="btn btn-small btn-primary"
          onClick={handleEdit}
        >
          Edit
        </button>
        
        <button
          className="btn btn-small btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
