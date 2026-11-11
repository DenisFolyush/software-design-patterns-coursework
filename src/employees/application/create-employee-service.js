import { randomUUID } from 'node:crypto';
import { createEmployee } from '../domain/create-employee.js';
import { DuplicateEmployeeEmailError } from '../domain/employee-errors.js';

export class CreateEmployeeService {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute(input) {
    const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : input?.email;
    const existingEmployee = await this.employeeRepository.findByEmail(email);

    if (existingEmployee) {
      throw new DuplicateEmployeeEmailError('email is already in use');
    }

    const employee = createEmployee({ id: randomUUID(), ...input });
    await this.employeeRepository.save(employee);
    return employee;
  }
}
