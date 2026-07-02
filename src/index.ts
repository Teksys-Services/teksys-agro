import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Teksys Agro API is running', version: '2.0' });
});

try {
  const authRoutes = require('./routes/auth.routes').default;
  const farmerRoutes = require('./routes/farmer.routes').default;
  const agentRoutes = require('./routes/agent.routes').default;
  const adminRoutes = require('./routes/admin.routes').default;
  const billRoutes = require('./routes/bill.routes').default;
  const foodunitRoutes = require('./routes/foodunit.routes').default;

  app.use('/api/auth', authRoutes);
  app.use('/api/farmer', farmerRoutes);
  app.use('/api/agent', agentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/bill', billRoutes);
  app.use('/api/foodunit', foodunitRoutes);

  console.log('✅ All routes loaded');
} catch (err) {
  console.error('Route loading error:', err);
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Teksys Agro API v2.0 running on port ${PORT}`);
});
