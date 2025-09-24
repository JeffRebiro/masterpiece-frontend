import { useEffect, useState } from 'react';
import { getItems, createItem, updateItem, deleteItem } from './api';

export default function CRUDTable({ token }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    getItems(token).then(res => setItems(res.data));
  }, [token]);

  const handleCreate = async () => {
    const res = await createItem({ name: newItem }, token);
    setItems([...items, res.data]);
    setNewItem('');
  };

  const handleUpdate = async (id, name) => {
    const res = await updateItem(id, { name }, token);
    setItems(items.map(item => item.id === id ? res.data : item));
  };

  const handleDelete = async (id) => {
    await deleteItem(id, token);
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
      <h2>Admin Table</h2>
      <input value={newItem} onChange={e => setNewItem(e.target.value)} />
      <button onClick={handleCreate}>Add</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <input defaultValue={item.name} onBlur={e => handleUpdate(item.id, e.target.value)} />
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
