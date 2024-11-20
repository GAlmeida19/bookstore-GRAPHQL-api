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

export enum employeeRoles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  INTERN = 'INTERN',
}

export enum userRole {
  MANAGER = 'MANAGER',
  BUYER = 'BUYER',
}

registerEnumType(categories, {
  name: 'Categories',
  description: 'Available categories for books', // Optional: You can provide a description
});

registerEnumType(employeeRoles, {
  name: 'employeeRoles', // This is the name that will be used in GraphQL
  description: 'Available roles for employees', // Optional: You can provide a description
});

registerEnumType(userRole, {
  name: 'userRole', // This is the name that will be used in GraphQL
  description: 'Available roles for users', // Optional: You can provide a description
});
