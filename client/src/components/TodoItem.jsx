import { useState } from 'react';

export default function TodoItem({ todo, today, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [draftDueDate, setDraftDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  // Creation timestamps are stored in UTC, even when the API omits the zone.
  const createdTimestamp = todo.createDate
    ? (/(Z|[+-]\d{2}:\d{2})$/i.test(todo.createDate) ? todo.createDate : `${todo.createDate}Z`)
    : null;
  const createdDate = createdTimestamp ? new Date(createdTimestamp) : null;
  const hasCreatedDate = createdDate && !Number.isNaN(createdDate.getTime());
  // Due dates are calendar dates; do not shift them into another time zone.
  const datePart = todo.dueDate?.slice(0, 10);
  const dueDate = datePart && datePart !== '0001-01-01'
    ? new Date(`${datePart}T00:00:00`)
    : null;
  const hasDueDate = dueDate && !Number.isNaN(dueDate.getTime());
  const overdue = hasDueDate && !todo.isComplete && dueDate < today;

  function startEdit() {
    setDraft(todo.title);
    setDraftDueDate(hasDueDate ? datePart : '');
    setEditing(true);
  }

  async function saveEdit(event) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !draftDueDate || saving) return;
    if (trimmed === todo.title && draftDueDate === datePart) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      if (await onEdit(todo, trimmed, draftDueDate)) setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className={`todo-item${overdue ? ' overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        disabled={editing}
        onChange={() => onToggle(todo)}
        title="Mark complete / incomplete"
      />

      <div className="todo-content">
        {editing ? (
          <form
            className="edit-form"
            onSubmit={saveEdit}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !saving) {
                event.preventDefault();
                setEditing(false);
              }
            }}
          >
            <label className="title-field">
              Title
              <input
                type="text"
                required
                value={draft}
                autoFocus
                disabled={saving}
                onChange={(e) => setDraft(e.target.value)}
              />
            </label>
            <label className="due-date-field">
              Due date (required)
              <input
                type="date"
                required
                min="0001-01-02"
                max="9999-12-31"
                value={draftDueDate}
                disabled={saving}
                onChange={(e) => setDraftDueDate(e.target.value)}
              />
            </label>
            <div className="edit-actions">
              <button type="submit" className="primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" disabled={saving} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <span
            className={`title ${todo.isComplete ? 'complete' : ''}`}
            onDoubleClick={startEdit}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
        <div className="todo-created-date">
          {hasCreatedDate ? (
            <span>Created <time dateTime={createdDate.toISOString()}>{createdDate.toLocaleString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}</time></span>
          ) : <span>Creation time unavailable</span>}
        </div>
        <div className="todo-due-date">
          {hasDueDate ? (
            <span>Due <time dateTime={datePart}>{dueDate.toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
            })}</time></span>
          ) : <span>No due date</span>}
          {overdue && <span className="overdue-badge">Overdue</span>}
        </div>
      </div>

      {!editing && (
        <button onClick={startEdit}>Edit</button>
      )}
      <button disabled={saving} onClick={() => onDelete(todo)}>Delete</button>
    </li>
  );
}
