class Person {
  constructor(public firstName: string, public lastName: string) {
    this.firstName = firstName
    this.lastName = lastName
  }
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
  describe(): string {
    return `This is ${this.firstName} ${this.lastName}.`
  }
}

class Employee extends Person {
  constructor(firstName: string, lastName: string, private jobTitle: string) {
    // call the constructor of the Person class:
    super(firstName, lastName)
  }
  getJob(): string {
    return this.jobTitle
  }
  getSalary(): number {
    return 1000
  }
}

const per: Person = new Person('amin', 'abbasi')
per.getFullName()

const emp: Employee = new Employee('amin', 'abbasi', 'developer')
emp.getJob()
