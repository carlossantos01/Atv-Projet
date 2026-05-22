const express = require('express');
const router = express.Router();
const controller = require('../controllers/agendamentos.controller');

router.get('/', controller.listarTodos);
router.post('/', controller.criar);
router.delete('/:id', controller.deletar);

module.exports = router;