import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Vercel' });
});

export default app;
