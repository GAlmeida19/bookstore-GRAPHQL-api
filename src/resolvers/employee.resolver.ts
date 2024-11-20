import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Employee } from '../entities/employee.entity';
import { employeeRoles } from '../enums/book.enum';
import { EmployeeService } from '../services/employee.service';

@Resolver(() => Employee)
export class EmployeeResolver {
  private employeeService = new EmployeeService();

  /**
   * Retrieves a list of all employees.
   *
   * @returns {Promise<Employee[]>} An array of employees.
   */
  @Query(() => [Employee])
  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  /**
   * Retrieves an employee by their ID.
   *
   * @param {number} id - The ID of the employee to be retrieved.
   * @returns {Promise<Employee | null>} The employee object if found, or null if not.
   */
  @Query(() => Employee, { nullable: true })
  async getEmployeeById(@Arg('id') id: number): Promise<Employee | null> {
    return this.employeeService.findById(id);
  }

  /**
   * Creates a new employee.
   *
   * @param {string} firstName - The first name of the employee.
   * @param {string} lastName - The last name of the employee.
   * @param {string} emailAddress - The email address of the employee.
   * @param {string} address - The address of the employee.
   * @param {string} birth - The birth date of the employee.
   * @param {number} wallet - The wallet balance of the employee.
   * @param {string} [phoneNumber] - The phone number of the employee (optional).
   * @returns {Promise<Employee>} The newly created employee object.
   */
  @Mutation(() => Employee)
  async createEmployee(
    @Arg('name') name: string,
    @Arg('emailAddress') emailAddress: string,
    @Arg('address') address: string,
    @Arg('birth') birth: string,
    @Arg('role') role: employeeRoles,
    @Arg('password') password: string,
    @Arg('phoneNumber') phoneNumber?: string,
  ): Promise<Employee> {
    return this.employeeService.create(
      name,
      emailAddress,
      address,
      password,
      birth,
      role,
      phoneNumber,
    );
  }

  /**
   * Updates an existing employee.
   *
   * @param {number} id - The ID of the employee to update.
   * @param {string} [firstName] - The updated first name of the employee (optional).
   * @param {string} [lastName] - The updated last name of the employee (optional).
   * @param {string} [emailAddress] - The updated email address of the employee (optional).
   * @param {string} [address] - The updated address of the employee (optional).
   * @param {string} [birth] - The updated birth date of the employee (optional).
   * @param {number} [wallet] - The updated wallet balance of the employee (optional).
   * @param {string} [phoneNumber] - The updated phone number of the employee (optional).
   * @returns {Promise<Employee | null>} The updated employee object if found, or null if not.
   */
  @Mutation(() => Employee, { nullable: true })
  async updateEmployee(
    @Arg('id') id: number,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('lastName', { nullable: true }) lastName?: string,
    @Arg('emailAddress', { nullable: true }) emailAddress?: string,
    @Arg('address', { nullable: true }) address?: string,
    @Arg('birth', { nullable: true }) birth?: string,
    @Arg('employeeRole', { nullable: true }) employeeRole?: employeeRoles,
    @Arg('phoneNumber', { nullable: true }) phoneNumber?: string,
  ): Promise<Employee | null> {
    return this.employeeService.updateEmployee(
      id,
      name,
      emailAddress,
      address,
      birth,
      employeeRole,
      phoneNumber,
    );
  }

  /**
   * Deletes an employee by their ID.
   *
   * @param {number} id - The ID of the employee to be deleted.
   * @returns {Promise<boolean>} True if the employee was deleted successfully, otherwise false.
   */
  @Mutation(() => Boolean)
  async deleteEmployee(@Arg('id') id: number): Promise<boolean> {
    return this.employeeService.delete(id);
  }
}
