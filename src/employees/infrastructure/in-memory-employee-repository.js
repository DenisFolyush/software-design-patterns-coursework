export class InMemoryEmployeeRepository {
  constructor() {
    this.employeesByEmail = new Map();
    this.employeesById = new Map();
  }

  async findByEmail(email) {
    return this.employeesByEmail.get(email) ?? null;
  }

  async findById(id) {
    return this.employeesById.get(id) ?? null;
  }

  async findAll() {
    return [...this.employeesById.values()];
  }

  async save(employee) {
    this.employeesByEmail.set(employee.email, employee);
    this.employeesById.set(employee.id, employee);
  }
}
