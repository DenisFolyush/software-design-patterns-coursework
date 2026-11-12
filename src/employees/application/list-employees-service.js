export class ListEmployeesService {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute() {
    return this.employeeRepository.findAll();
  }
}
