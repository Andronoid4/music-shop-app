const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recordController');
const auth = require('../controllers/authController');

// Публичные маршруты
router.get('/records', ctrl.getAllRecords);
router.get('/records/bestsellers', ctrl.getBestsellers);

// Маршруты для админов и владельцев (требуют авторизации)
router.post('/records', auth.authenticateToken, auth.authorizeAdmin, ctrl.insertRecord);
router.put('/records/:id', auth.authenticateToken, auth.authorizeAdmin, ctrl.updateRecord);
router.delete('/records/:id', auth.authenticateToken, auth.authorizeAdmin, ctrl.deleteRecord);
router.post('/ensembles', auth.authenticateToken, auth.authorizeAdmin, ctrl.insertEnsemble);
router.put('/ensembles/:id', auth.authenticateToken, auth.authorizeAdmin, ctrl.updateEnsemble);

// Отчёты (только для авторизованных с ролью admin/owner)
router.get('/reports/stock', auth.authenticateToken, auth.authorizeAdmin, ctrl.getStockSummary);
router.get('/reports/sales-compare', auth.authenticateToken, auth.authorizeAdmin, ctrl.getSalesComparison);
router.get('/reports/margin', auth.authenticateToken, auth.authorizeAdmin, ctrl.getMarginAnalysis);

// Заказ (требует авторизованного пользователя, не обязательно admin)
router.post('/orders', auth.authenticateToken, ctrl.createOrder);

// старые эндпоинты для ансамблей (можно оставить с проверкой)
router.get('/ensembles/:id/works-count', ctrl.getEnsembleWorksCount);
router.get('/ensembles/:id/records', ctrl.getEnsembleRecords);

module.exports = router;