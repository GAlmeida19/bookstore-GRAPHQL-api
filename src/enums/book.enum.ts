import { registerEnumType } from 'type-graphql';

/**
 * Enum representing the categories of the book
 */
export enum categories {
  TERROR = 'TERROR',
  COMEDY = 'COMEDY',
  ROMANCE = 'ROMANCE',
  NON_FICTION = 'NONFICITON',
  FICTION = 'FICTION',
  CHILDREN = 'CHILDREN',
  ACTION = 'ACTION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Enum representing the roles of the employees
 */
export enum employeeRoles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  INTERN = 'INTERN',
}

/**
 * Enum representing the roles of the user
 */
export enum userRole {
  MANAGER = 'MANAGER',
  BUYER = 'BUYER',
}

/**
 * registered enumType categories
 */
registerEnumType(categories, {
  name: 'Categories',
  description: 'Available categories for books',
});

/**
 * Rgistered enumType employeeRoles
 */
registerEnumType(employeeRoles, {
  name: 'employeeRoles',
  description: 'Available roles for employees',
});

/**
 * Registered enumType userRole
 */
registerEnumType(userRole, {
  name: 'userRole',
  description: 'Available roles for users',
});
