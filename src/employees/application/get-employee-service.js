import { EmployeeNotFoundError } from '../domain/employee-errors.js';

export class GetEmployeeService {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute(id) {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundError('employee not found');
    }

    return employee;
  }
}
