const { pool } = require('../db');

exports.getAllRecords = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, c.name as company_name 
      FROM records r
      LEFT JOIN record_companies c ON r.company_id = c.company_id
      ORDER BY r.release_date DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getEnsembleWorksCount = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT get_ensemble_composition_count($1) AS count', [req.params.id]);
    res.json({ ensemble_id: req.params.id, works_count: rows[0].count });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getEnsembleRecords = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM get_ensemble_records($1)', [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getBestsellers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM get_top_sellers()');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.insertRecord = async (req, res) => {
  try {
    await pool.query('CALL add_new_record($1,$2,$3,$4,$5,$6,$7)', [
      req.body.label_number, req.body.title, req.body.company_id, req.body.release_date,
      req.body.wholesale_price, req.body.retail_price, req.body.stock_quantity || 0
    ]);
    res.json({ message: 'Пластинка добавлена' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateRecord = async (req, res) => {
  try {
    await pool.query('CALL update_record_data($1,$2,$3,$4)', [
      req.params.id,
      req.body.wholesale_price,
      req.body.retail_price,
      req.body.stock_quantity
    ]);
    res.json({ message: 'Данные пластинки обновлены' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteRecord = async (req, res) => {
  try {
    await pool.query('DELETE FROM records WHERE record_id = $1', [req.params.id]);
    res.json({ message: 'Пластинка удалена' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.insertEnsemble = async (req, res) => {
  try {
    await pool.query('CALL add_ensemble($1,$2,$3,$4)', [
      req.body.ensemble_name, req.body.type, req.body.founded_year || null, req.body.leader_id || null
    ]);
    res.json({ message: 'Ансамбль добавлен' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateEnsemble = async (req, res) => {
  try {
    await pool.query('CALL update_ensemble($1,$2,$3,$4,$5)', [
      req.params.id,
      req.body.name,
      req.body.type,
      req.body.founded_year,
      req.body.leader_id
    ]);
    res.json({ message: 'Ансамбль обновлён' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Отчёты
exports.getStockSummary = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM stock_summary');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getSalesComparison = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM sales_comparison');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getMarginAnalysis = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM margin_analysis');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Оформление заказа
exports.createOrder = async (req, res) => {
  const { userId, items } = req.body; // items = [{record_id, quantity}]
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Рассчитываем сумму
    let total = 0;
    for (let item of items) {
      const priceRes = await client.query('SELECT retail_price FROM records WHERE record_id = $1', [item.record_id]);
      total += priceRes.rows[0].retail_price * item.quantity;
    }
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING order_id',
      [userId, total]
    );
    const orderId = orderRes.rows[0].order_id;
    for (let item of items) {
      const priceRes = await client.query('SELECT retail_price FROM records WHERE record_id = $1', [item.record_id]);
      await client.query(
        'INSERT INTO order_items (order_id, record_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
        [orderId, item.record_id, item.quantity, priceRes.rows[0].retail_price]
      );
    }
    await client.query('COMMIT');
    res.json({ orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};