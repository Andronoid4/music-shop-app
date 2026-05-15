import { useState } from 'react';

const API = 'http://localhost:3001/api';

export default function RecordForm({ onAdded }) {
  const [form, setForm] = useState({
    label_number: '', title: '', company_id: '', release_date: '',
    wholesale_price: '', retail_price: '', unsold_stock: '',
    copies_sold_last_year: 0, copies_sold_current_year: 0
  });
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch(`${API}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('✅ Пластинка добавлена!');
      setForm({ ...form, label_number: '', title: '' }); // сброс полей
      onAdded?.();
    } catch (err) {
      setMsg(`❌ Ошибка: ${err.message}`);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white shadow space-y-3">
      <h3 className="text-lg font-bold">📀 Добавить пластинку</h3>
      {msg && <p className={msg.includes('✅') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
      
      <div className="grid grid-cols-2 gap-3">
        <input name="label_number" placeholder="№ наклейки*" value={form.label_number} onChange={handleChange} required className="border p-2 rounded" />
        <input name="title" placeholder="Название*" value={form.title} onChange={handleChange} required className="border p-2 rounded" />
        <input name="company_id" type="number" placeholder="ID компании*" value={form.company_id} onChange={handleChange} required className="border p-2 rounded" />
        <input name="release_date" type="date" value={form.release_date} onChange={handleChange} className="border p-2 rounded" />
        <input name="wholesale_price" type="number" step="0.01" placeholder="Оптовая цена" value={form.wholesale_price} onChange={handleChange} className="border p-2 rounded" />
        <input name="retail_price" type="number" step="0.01" placeholder="Розничная цена*" value={form.retail_price} onChange={handleChange} required className="border p-2 rounded" />
        <input name="unsold_stock" type="number" placeholder="Остаток на складе" value={form.unsold_stock} onChange={handleChange} className="border p-2 rounded" />
        <input name="copies_sold_current_year" type="number" placeholder="Продано в этом году" value={form.copies_sold_current_year} onChange={handleChange} className="border p-2 rounded" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Добавить</button>
    </form>
  );
}