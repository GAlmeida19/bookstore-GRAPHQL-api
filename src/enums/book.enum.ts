import { registerEnumType } from "type-graphql";

/**
 * Enum representing the categories of the book
 */
export enum categories {
  TERROR = "TERROR",
  COMEDY = "COMEDY",
  ROMANCE = "ROMANCE",
  NON_FICTION = "NONFICITON",
  FICTION = "FICTION",
  CHILDREN = "CHILDREN",
  ACTION = "ACTION",
  UNKNOWN = "UNKNOWN",
}

registerEnumType(categories, {
  name: "Categories", // This is the name that will be used in GraphQL
  description: "Available categories for books", // Optional: You can provide a description
});
