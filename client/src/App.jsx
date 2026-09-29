import { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all todos once on mount.
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(title, dueDate) {
    try {
      const created = await createTodo({ title, dueDate });
      setTodos((prev) => [...prev, created]);
      setError(null);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        isComplete: !todo.isComplete,
        dueDate: todo.dueDate,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleEdit(todo, title, dueDate) {
    try {
      const updated = await updateTodo(todo.id, {
        title,
        isComplete: todo.isComplete,
        dueDate: `${dueDate}T00:00:00`,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setError(null);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function handleDelete(todo) {
    try {
      await deleteTodo(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="app">
      <h1>Priority1 ToDo</h1>

      {error && <div className="error">{error}</div>}

      <AddTodoForm onAdd={handleAdd} />

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
