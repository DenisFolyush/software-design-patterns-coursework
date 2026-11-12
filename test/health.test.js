import assert from 'node:assert/strict';
import test from 'node:test';
import { createAppHandler } from '../src/app/create-server.js';

async function invokeHandler(handler, request) {
  const response = {
    headers: {},
    statusCode: undefined,
    body: undefined,
    end(body) {
      this.body = body;
    },
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    }
  };

  await handler(request, response);
  return response;
}

test('GET /api/v1/health reports that the service is available', async () => {
  const response = await invokeHandler(createAppHandler(), { method: 'GET', url: '/api/v1/health' });

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(response.body), { status: 'ok' });
});

test('unknown routes return a JSON 404 response', async () => {
  const response = await invokeHandler(createAppHandler(), { method: 'GET', url: '/api/v1/missing' });

  assert.equal(response.statusCode, 404);
  assert.deepEqual(JSON.parse(response.body), { error: 'Not found' });
});
