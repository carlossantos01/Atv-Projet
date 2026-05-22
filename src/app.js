const express = require('express');
const cors = require('cors');
const agendamentosRoutes = require('./routes/agendamentos.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/agendamentos', agendamentosRoutes);

module.exports = app;