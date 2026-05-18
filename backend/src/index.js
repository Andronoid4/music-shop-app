const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recordRoutes = require('./routes/recordRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем роуты с префиксом /api
app.use('/api', recordRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});