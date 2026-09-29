import { useEffect, useState } from 'react';
import TodoItem from './TodoItem';

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  const [sortBy, setSortBy] = useState('createDate');
  const [ascending, setAscending] = useState(true);
  const [today, setToday] = useState(startOfToday);

  function handleSort(field) {
    if (field === sortBy) {
      setAscending((value) => !value);
    } else {
      setSortBy(field);
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = startOfToday();
      setToday((previous) => previous.getTime() === next.getTime() ? previous : next);
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  if (todos.length === 0) {
    return <p className="muted">No todos yet. Add one above.</p>;
  }

  const sortedTodos = [...todos].sort((a, b) => {
    const aDate = a[sortBy] ? Date.parse(a[sortBy]) : NaN;
    const bDate = b[sortBy] ? Date.parse(b[sortBy]) : NaN;

    // Keep items without a valid date at the end in either direction.
    if (Number.isNaN(aDate)) return Number.isNaN(bDate) ? 0 : 1;
    if (Number.isNaN(bDate)) return -1;
    return ascending ? aDate - bDate : bDate - aDate;
  });

  return (
    <>
      <div className="todo-sort" role="group" aria-label="Sort todos">
        <span className="muted">Sort by:</span>
        <button
          type="button"
          className={sortBy === 'createDate' ? 'primary' : ''}
          aria-pressed={sortBy === 'createDate'}
          aria-label={`Created date${sortBy === 'createDate' ? (ascending ? ', ascending' : ', descending') : ''}`}
          onClick={() => handleSort('createDate')}
        >
          Created date
          {sortBy === 'createDate' && <span aria-hidden="true">{ascending ? ' ↑' : ' ↓'}</span>}
        </button>
        <button
          type="button"
          className={sortBy === 'dueDate' ? 'primary' : ''}
          aria-pressed={sortBy === 'dueDate'}
          aria-label={`Due date${sortBy === 'dueDate' ? (ascending ? ', ascending' : ', descending') : ''}`}
          onClick={() => handleSort('dueDate')}
        >
          Due date
          {sortBy === 'dueDate' && <span aria-hidden="true">{ascending ? ' ↑' : ' ↓'}</span>}
        </button>
      </div>
      <ul className="todo-list">
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            today={today}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </>
  );
}
