const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recordController');

router.get('/records', ctrl.getAllRecords);
router.get('/records/bestsellers', ctrl.getBestsellers);
router.post('/records', ctrl.insertRecord);
router.put('/records/:id', ctrl.updateRecord);
router.delete('/records/:id', ctrl.deleteRecord);

router.get('/ensembles/:id/works-count', ctrl.getEnsembleWorksCount);
router.get('/ensembles/:id/records', ctrl.getEnsembleRecords);
router.post('/ensembles', ctrl.insertEnsemble);
router.get('/debug/records', ctrl.debugRecords);
module.exports = router;