const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recordRoutes = require('./routes/recordRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем роуты с префиксом /api
app.use('/api', recordRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});