export class InMemoryEmployeeRepository {
  constructor() {
    this.employeesByEmail = new Map();
  }

  async findByEmail(email) {
    return this.employeesByEmail.get(email) ?? null;
  }

  async save(employee) {
    this.employeesByEmail.set(employee.email, employee);
  }
}
