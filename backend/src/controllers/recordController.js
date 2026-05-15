const { pool } = require('../db');

// Каталог
exports.getAllRecords = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, c.company_name FROM records r
      LEFT JOIN companies c ON r.company_id = c.company_id
      ORDER BY r.release_date DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 1. Кол-во произведений ансамбля
exports.getEnsembleWorksCount = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT fn_get_ensemble_works_count($1)', [req.params.id]);
    res.json({ ensemble_id: req.params.id, works_count: rows[0].fn_get_ensemble_works_count });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Пластинки ансамбля
exports.getEnsembleRecords = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fn_get_ensemble_records($1)', [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Лидеры продаж
exports.getBestsellers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fn_get_bestsellers_current_year()');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 4. Вставка/Обновление пластинки
exports.insertRecord = async (req, res) => {
  try {
    await pool.query('CALL proc_insert_record($1,$2,$3,$4,$5,$6,$7,$8,$9)', [
      req.body.label_number, req.body.title, req.body.company_id, req.body.release_date,
      req.body.wholesale_price, req.body.retail_price, req.body.unsold_stock,
      req.body.copies_sold_last_year || 0, req.body.copies_sold_current_year || 0
    ]);
    res.json({ message: 'Пластинка добавлена' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateRecord = async (req, res) => {
  try {
    await pool.query('CALL proc_update_record($1,$2,$3,$4,$5,$6,$7,$8,$9)', [
      req.params.id, req.body.title, req.body.company_id, req.body.release_date,
      req.body.wholesale_price, req.body.retail_price, req.body.unsold_stock,
      req.body.copies_sold_last_year, req.body.copies_sold_current_year
    ]);
    res.json({ message: 'Данные пластинки обновлены' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteRecord = async (req, res) => {
  try {
    await pool.query('DELETE FROM records WHERE record_id = $1', [req.params.id]);
    res.json({ message: 'Пластинка удалена (триггер обработал связанные данные)' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 5. Ввод ансамбля
exports.insertEnsemble = async (req, res) => {
  try {
    await pool.query('CALL proc_insert_ensemble($1, $2)', [req.body.ensemble_name, req.body.type]);
    res.json({ message: 'Ансамбль добавлен' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.debugRecords = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT record_id, title, copies_sold_current_year FROM records LIMIT 10;');
    console.log('🔍 DEBUG QUERY RESULT:', rows); // <-- Выведется в терминал бэкенда
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    console.error('🔍 DB ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};