import { createServer } from 'node:http';
import { CreateEmployeeService } from '../employees/application/create-employee-service.js';
import { GetEmployeeService } from '../employees/application/get-employee-service.js';
import { ListEmployeesService } from '../employees/application/list-employees-service.js';
import {
  DuplicateEmployeeEmailError,
  EmployeeNotFoundError,
  EmployeeValidationError
} from '../employees/domain/employee-errors.js';
import { InMemoryEmployeeRepository } from '../employees/infrastructure/in-memory-employee-repository.js';

const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  let body = '';

  for await (const chunk of request) {
    body += chunk;
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new EmployeeValidationError('request body must be valid JSON');
  }
}

function createDependencies() {
  const employeeRepository = new InMemoryEmployeeRepository();

  return {
    createEmployeeService: new CreateEmployeeService(employeeRepository),
    getEmployeeService: new GetEmployeeService(employeeRepository),
    listEmployeesService: new ListEmployeesService(employeeRepository)
  };
}

export function createAppHandler(dependencies = createDependencies()) {
  return async (request, response) => {
    if (request.method === 'GET' && request.url === '/api/v1/health') {
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      response.end(HEALTH_RESPONSE);
      return;
    }

    if (request.method === 'POST' && request.url === '/api/v1/employees') {
      try {
        const employee = await dependencies.createEmployeeService.execute(await readJsonBody(request));
        sendJson(response, 201, employee);
      } catch (error) {
        if (error instanceof EmployeeValidationError) {
          sendJson(response, 400, { error: error.message });
          return;
        }

        if (error instanceof DuplicateEmployeeEmailError) {
          sendJson(response, 409, { error: error.message });
          return;
        }

        throw error;
      }

      return;
    }

    if (request.method === 'GET' && request.url === '/api/v1/employees') {
      sendJson(response, 200, await dependencies.listEmployeesService.execute());
      return;
    }

    const employeeId = request.url?.match(/^\/api\/v1\/employees\/([^/]+)$/)?.[1];

    if (request.method === 'GET' && employeeId) {
      try {
        sendJson(response, 200, await dependencies.getEmployeeService.execute(employeeId));
      } catch (error) {
        if (error instanceof EmployeeNotFoundError) {
          sendJson(response, 404, { error: error.message });
          return;
        }

        throw error;
      }

      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  };
}

export function createAppServer() {
  return createServer(createAppHandler);
}
