// app/components/TodoForm.tsx
'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useTodos } from '../context/todo-context';
import { CreateTodoData } from '../types/todo';

export default function TodoForm() {
  const { createTodo, updateTodo, editingTodo, setEditingTodo, setError } = useTodos();
  const [formData, setFormData] = useState<CreateTodoData>({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title,
        description: editingTodo.description || ''
      });
    } else {
      setFormData({ title: '', description: '' });
    }
  }, [editingTodo]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, formData);
        setEditingTodo(null);
      } else {
        await createTodo(formData);
      }
      setFormData({ title: '', description: '' });
    } catch (err) {
      setError(editingTodo ? 'Failed to update todo' : 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = (): void => {
    setEditingTodo(null);
    setFormData({ title: '', description: '' });
  };

  return (
    <div className="todo-form">
      <h2>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter todo title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter todo description (optional)"
          />
        </div>
        
        <div className="todo-actions">
          <button
            type="submit"
            className={`btn ${editingTodo ? 'btn-warning' : 'btn-primary'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : editingTodo ? 'Update Todo' : 'Add Todo'}
          </button>
          
          {editingTodo && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
