import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { Employee } from '../entities/employee.entity';
import { User } from '../entities/user.entity';
import { employeeRoles, userRole } from '../enums/book.enum';

export class EmployeeService {
  private employeeRepository = AppDataSource.getRepository(Employee);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Retrieves a list of all employees from the repository, including their associated books.
   *
   * @returns {Promise<Employee[]>} An array of employees.
   */
  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: ['books'] });
  }

  /**
   * Retrieves an employee by their ID, including associated books.
   *
   * @param {number} id - The ID of the employee to be retrieved.
   * @returns {Promise<Employee | null>} The employee object if found, or null if not.
   */
  async findById(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id },
      relations: ['books'],
    });
  }

  /**
   * Creates a new employee with the specified details.
   * @param name The first name of the employee.
   * @param emailAddress The email address of the employee.
   * @param address The address of the employee.
   * @param birth The birth date of the employee.
   * @param phoneNumber (Optional) The phone number of the employee.
   * @returns {Promise<Employee>} The newly created employee.
   * @throws {Error} Throws error if the email or phone number is invalid.
   */
  async create(
    name: string,
    emailAddress: string,
    address: string,
    password: string,
    birth: string,
    role: employeeRoles,
    phoneNumber?: string,
  ): Promise<Employee> {
    const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(emailAddress)) {
      throw new Error('Invalid email address format');
    }

    if (phoneNumber) {
      const phoneRegex = /^\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error('Phone number must be exactly 9 digits');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.emailAddress = emailAddress;
    user.password = hashedPassword;
    user.userRole = userRole.MANAGER;

    await this.userRepository.save(user);

    const newEmployee = this.employeeRepository.create({
      name,
      emailAddress,
      address,
      phoneNumber,
      birth,
      role,
      user,
    });

    return this.employeeRepository.save(newEmployee);
  }

  /**
   * Updates the details of an existing employee by their ID.
   * @param id The ID of the employee to update.
   * @param firstName (Optional) The updated first name of the employee.
   * @param lastName (Optional) The updated last name of the employee.
   * @param emailAddress (Optional) The updated email address of the employee.
   * @param address (Optional) The updated address of the employee.
   * @param birth (Optional) The updated birth date of the employee.
   * @param wallet (Optional) The updated wallet balance of the employee.
   * @param phoneNumber (Optional) The updated phone number of the employee.
   * @returns {Promise<Employee | null>} The updated employee, or null if not found.
   * @throws {Error} Throws error if the employee is not found.
   */
  async updateEmployee(
    id: number,
    name?: string,
    emailAddress?: string,
    address?: string,
    birth?: string,
    role?: employeeRoles,
    phoneNumber?: string,
  ): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (name) employee.name = name;
    if (emailAddress) employee.emailAddress = emailAddress;
    if (address) employee.address = address;
    if (phoneNumber) employee.phoneNumber = phoneNumber;
    if (role) employee.role = role;
    if (birth) employee.birth = new Date(birth);

    return this.employeeRepository.save(employee);
  }

  /**
   * Deletes a employee and their associated user by their ID.
   * @param {number} id - The ID of the employee to delete.
   * @returns {Promise<boolean>} True if the employee and user were successfully deleted.
   * @throws {Error} Throws an error if the employee with the specified ID cannot be found.
   */
  async delete(id: number): Promise<boolean> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!employee) {
      throw new Error(`Buyer with ID ${id} not found.`);
    }

    const result = await this.employeeRepository.delete(id);

    if (employee.user) {
      await this.userRepository.delete(employee.user.id);
    }
    return result.affected !== 0;
  }
}
