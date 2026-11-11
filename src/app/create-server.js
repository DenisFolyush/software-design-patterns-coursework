import { createServer } from 'node:http';

const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

export function createAppHandler(request, response) {
  if (request.method === 'GET' && request.url === '/api/v1/health') {
    response.writeHead(200, {
      'content-type': 'application/json; charset=utf-8'
    });
    response.end(HEALTH_RESPONSE);
    return;
  }

  response.writeHead(404, {
    'content-type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify({ error: 'Not found' }));
}

export function createAppServer() {
  return createServer(createAppHandler);
}
