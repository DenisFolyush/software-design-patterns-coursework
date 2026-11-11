import { Employee } from './employee.js';
import { EmployeeValidationError } from './employee-errors.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredText(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new EmployeeValidationError(`${fieldName} is required`);
  }

  return value.trim();
}

export function createEmployee({ id, fullName, position, email, phone, department }) {
  const normalizedEmail = requiredText(email, 'email').toLowerCase();

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new EmployeeValidationError('email must be valid');
  }

  return new Employee({
    id,
    fullName: requiredText(fullName, 'fullName'),
    position: requiredText(position, 'position'),
    email: normalizedEmail,
    phone: requiredText(phone, 'phone'),
    department: requiredText(department, 'department')
  });
}
