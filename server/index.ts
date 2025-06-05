import { createServer } from 'http';
import app from './app';

const server = createServer(app);
const port = Number(process.env.PORT) || 5000;

server.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server running on http://localhost:${port}`);
  }
});

export default server;
