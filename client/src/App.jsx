import { useEffect, useState } from 'react';
import { getList, createTodo, updateTodo, deleteTodo } from './api';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import ListsPage from './components/ListsPage';

export default function App() {
  const [selectedList, setSelectedList] = useState(null);

  return (
    <main className="app">
      <h1>Priority1 ToDo</h1>
      {selectedList === null ? (
        <ListsPage onOpen={setSelectedList} />
      ) : (
        <ListPage key={selectedList} listId={selectedList} onBack={() => setSelectedList(null)} />
      )}
    </main>
  );
}

function ListPage({ listId, onBack }) {
  const [list, setList] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getList(listId)
      .then((value) => {
        if (active) {
          setList(value);
          setTodos(value.todos);
        }
      })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [listId, attempt]);

  async function handleAdd(title, dueDate) {
    try {
      const created = await createTodo({ title, dueDate, todosListId: listId });
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
      setError(null);
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
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <button className="back-button" onClick={onBack}>← All lists</button>
      {list && <h2>{list.title}</h2>}
      {error && <div className="error" role="alert">{error}</div>}

      {loading ? (
        <p className="muted" role="status">Loading…</p>
      ) : !list ? (
        <button onClick={() => setAttempt((value) => value + 1)}>Retry</button>
      ) : <>
        <AddTodoForm onAdd={handleAdd} />
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </>}
    </>
  );
}
