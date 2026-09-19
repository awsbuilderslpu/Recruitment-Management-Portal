import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import applicationRoutes from './routes/applications';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => {
  res.json({ message: 'AWSLPU-RMP Backend API is running' });
});

// Routes
app.use('/api/applications', applicationRoutes);

export default app;