// app/components/TodoList.tsx
'use client';

import TodoItem from './todo-item';
import { useTodos } from '../context/todo-context';
import { FilterType } from '../types/todo';

export default function TodoList() {
  const { filteredTodos, loading, error, filter, setFilter, fetchApiTodos } = useTodos();

  const handleFilterChange = (newFilter: FilterType): void => {
    setFilter(newFilter);
  };

  const handleRefreshApi = async (): Promise<void> => {
    try {
      await fetchApiTodos();
    } catch (err) {
      console.error('Error refreshing API data:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div>
      {error && (
        <div className="error">
          {error}
          <button 
            onClick={handleRefreshApi}
            className="btn btn-small btn-primary"
            style={{ marginLeft: '10px' }}
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All Tasks ({filteredTodos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'incomplete' ? 'active' : ''}`}
          onClick={() => handleFilterChange('incomplete')}
        >
          Incomplete
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </button>
        <button
          className="filter-btn"
          onClick={handleRefreshApi}
        >
          Refresh API Data
        </button>
      </div>
      
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="loading">
            {filter === 'all' && 'No todos found. Create your first todo!'}
            {filter === 'completed' && 'No completed todos found.'}
            {filter === 'incomplete' && 'No incomplete todos found.'}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
}
