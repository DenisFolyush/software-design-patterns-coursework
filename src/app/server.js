import { createAppServer } from './create-server.js';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const server = createAppServer();

server.listen(port, () => {
  console.log(`HRMS API listening on port ${port}`);
});
