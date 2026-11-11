export class Employee {
  constructor({ id, fullName, position, email, phone, department }) {
    this.id = id;
    this.fullName = fullName;
    this.position = position;
    this.email = email;
    this.phone = phone;
    this.department = department;
    Object.freeze(this);
  }
}
