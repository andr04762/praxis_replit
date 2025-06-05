import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Vercel' });
});

// Serve a simple course page to verify the environment
app.get('/course', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

export default app;
