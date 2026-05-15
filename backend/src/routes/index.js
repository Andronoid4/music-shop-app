const express = require('express');
const router = express.Router();

// Тестовый эндпоинт для проверки связи
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Дальше здесь будем добавлять роуты для ансамблей, пластинок и т.д.

module.exports = router;