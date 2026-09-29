import { useState } from 'react';

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !dueDate || submitting) return;
    setSubmitting(true);
    try {
      if (await onAdd(trimmed, dueDate)) {
        setTitle('');
        setDueDate('');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="title-field">
        Title
        <input
          type="text"
          required
          disabled={submitting}
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="due-date-field">
        Due date (required)
        <input
          type="date"
          required
          min="0001-01-02"
          max="9999-12-31"
          value={dueDate}
          disabled={submitting}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </label>
      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}
