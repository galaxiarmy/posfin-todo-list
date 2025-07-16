// app/page.tsx
'use client';

import TodoForm from './components/todo-form';
import TodoList from './components/todo-list';
import { TodoProvider } from './context/todo-context';

export default function Home() {
  return (
    <TodoProvider>
      <main className="container">
        <header className="header">
          <h1>Todo List Posfin</h1>
        </header>
        
        <TodoForm />
        <TodoList />
      </main>
    </TodoProvider>
  );
}
