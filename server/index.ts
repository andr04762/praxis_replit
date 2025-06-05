import { createServer } from 'http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './app';

// Run a local HTTP server when not deployed on Vercel.
if (!process.env.VERCEL) {
  const server = createServer(app);
  const port = Number(process.env.PORT) || 5000;

  server.listen(port, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Server running on http://localhost:${port}`);
    }
  });
}

// Export a handler for Vercel serverless functions.
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
