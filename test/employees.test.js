import assert from 'node:assert/strict';
import test from 'node:test';
import { createAppHandler } from '../src/app/create-server.js';

function createJsonRequest(body) {
  return {
    method: 'POST',
    url: '/api/v1/employees',
    async *[Symbol.asyncIterator]() {
      yield JSON.stringify(body);
    }
  };
}

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

const validEmployee = {
  fullName: 'Olena Kovalenko',
  position: 'Software Engineer',
  email: 'olena.kovalenko@example.com',
  phone: '+380501234567',
  department: 'Engineering'
};

test('POST /api/v1/employees creates a validated employee', async () => {
  const response = await invokeHandler(createAppHandler(), createJsonRequest(validEmployee));
  const employee = JSON.parse(response.body);

  assert.equal(response.statusCode, 201);
  assert.match(employee.id, /^[0-9a-f-]{36}$/);
  assert.deepEqual({ ...employee, id: undefined }, { ...validEmployee, id: undefined });
});

test('POST /api/v1/employees rejects incomplete employee data', async () => {
  const response = await invokeHandler(
    createAppHandler(),
    createJsonRequest({ ...validEmployee, department: ' ' })
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(JSON.parse(response.body), { error: 'department is required' });
});

test('POST /api/v1/employees rejects an email already assigned to an employee', async () => {
  const handler = createAppHandler();
  await invokeHandler(handler, createJsonRequest(validEmployee));
  const response = await invokeHandler(
    handler,
    createJsonRequest({ ...validEmployee, fullName: 'Ihor Shevchenko' })
  );

  assert.equal(response.statusCode, 409);
  assert.deepEqual(JSON.parse(response.body), { error: 'email is already in use' });
});
