import { useEffect, useState } from 'react';
import { getLists, createList, updateList, deleteList } from '../api';

export default function ListsPage({ onOpen }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getLists()
      .then((value) => { if (active) setLists(value); })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  async function add(title) {
    try {
      const created = await createList(title);
      setLists((previous) => [...previous, created]);
      setError(null);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function edit(list, title) {
    try {
      const updated = await updateList(list.id, title);
      setLists((previous) => previous.map((item) => item.id === list.id ? updated : item));
      setError(null);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function remove(list) {
    try {
      await deleteList(list.id);
      setLists((previous) => previous.filter((item) => item.id !== list.id));
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h2>Your lists</h2>
      {error && <div className="error" role="alert">{error} <button onClick={() => setAttempt((value) => value + 1)}>Reload lists</button></div>}
      {loading ? <p className="muted" role="status">Loading…</p> : <>
        <ListForm onSave={add} />
        {lists.length === 0 ? <p className="muted">No lists yet. Add one above.</p> : (
          <ul className="todo-list">
            {lists.map((list) => <ListRow key={list.id} list={list} onOpen={onOpen} onEdit={edit} onDelete={remove} />)}
          </ul>
        )}
      </>}
    </>
  );
}

function ListForm({ initialTitle = '', onSave, onCancel }) {
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      if (await onSave(title.trim())) setTitle('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={onCancel ? 'edit-form' : 'add-form'} onSubmit={submit} onKeyDown={(event) => {
      if (event.key === 'Escape' && onCancel && !saving) onCancel();
    }}>
      <label className="title-field">
        List title
        <input required maxLength={200} value={title} disabled={saving} autoFocus={!!onCancel}
          placeholder="Name your list" onChange={(event) => setTitle(event.target.value)} />
      </label>
      <div className="edit-actions">
        <button className="primary" disabled={saving || !title.trim()} type="submit">
          {saving ? 'Saving…' : onCancel ? 'Save' : 'Add list'}
        </button>
        {onCancel && <button type="button" disabled={saving} onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

function ListRow({ list, onOpen, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (deleting) return;
    setDeleting(true);
    try { await onDelete(list); } finally { setDeleting(false); }
  }

  return (
    <li className="todo-item list-item">
      {editing ? <div className="todo-content">
        <ListForm initialTitle={list.title} onCancel={() => setEditing(false)} onSave={async (title) => {
          const saved = await onEdit(list, title);
          if (saved) setEditing(false);
          return saved;
        }} />
      </div> : confirming ? <div className="todo-content">
        <p className="delete-message">Delete “{list.title}” and all its todos? This cannot be undone.</p>
        <div className="edit-actions">
          <button disabled={deleting} onClick={remove}>{deleting ? 'Deleting…' : 'Delete list and todos'}</button>
          <button disabled={deleting} onClick={() => setConfirming(false)}>Cancel</button>
        </div>
      </div> : <>
        <button className="list-link" onClick={() => onOpen(list.id)}>{list.title}</button>
        <div className="edit-actions">
          <button aria-label={`Edit ${list.title}`} onClick={() => setEditing(true)}>Edit</button>
          <button aria-label={`Delete ${list.title}`} onClick={() => setConfirming(true)}>Delete</button>
        </div>
      </>}
    </li>
  );
}
