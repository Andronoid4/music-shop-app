import { useState } from 'react';

const API = 'http://localhost:3001/api';

export default function EnsembleForm({ onAdded }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/ensembles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ensemble_name: name, type })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('✅ Ансамбль добавлен!');
      setName(''); setType('');
      onAdded?.();
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white shadow space-y-3">
      <h3 className="text-lg font-bold">🎻 Добавить ансамбль</h3>
      {msg && <p className={msg.includes('✅') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
      <input placeholder="Название ансамбля*" value={name} onChange={e => setName(e.target.value)} required className="border p-2 rounded w-full" />
      <input placeholder="Тип (оркестр, квартет...)" value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded w-full" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Создать</button>
    </form>
  );
}