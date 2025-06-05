import { createServer } from 'http';
import app from './app';

const server = createServer(app);
const port = Number(process.env.PORT) || 5000;

if (process.env.NODE_ENV !== 'production') {
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default server;
