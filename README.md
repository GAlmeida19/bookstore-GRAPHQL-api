# Bookstore GraphQL API

## Overview

This project is a fully functional **Bookstore API** built with GraphQL, providing comprehensive CRUD functionality. It simulates a real-world bookstore, managing books, authors, buyers, and the relationships between them. Additionally, the API now includes advanced features such as login/logout, ratings, wishlists, and multiple addresses management.

### Main Entities

- **Book**
- **Author**
- **Buyer**
- **Employee**
- **Address**
- **User**
- **Rating**

> **Note**: This project is still under active development, with additional features and enhancements in progress.

---

## Getting Started

### Prerequisites

- **Node.js** installed on your system.
- **TypeScript** setup (using `ts-node` for development).
- **PostgreSQL** database created and configured.

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <project-folder>

   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**:

   - Create a PostgreSQL database.
   - Replace the database connection details with your own in the configuration file.

4. **Add environment variables**:
   - Create a `.env` file in the root of your project with the necessary environment variables (e.g., database connection string).

### Running the Project

To start the server, use the following command:

```bash
npm run start
```

The server will run locally at:

```
http://localhost:4000/graphql
```

### GraphQL Playground

Access the GraphQL Playground at `http://localhost:4000/graphql` to explore and run queries and mutations.

## Features

- **CRUD Operations**:
  - Full Create, Read, Update, and Delete functionalities for books, authors, buyers, users, addresses, and ratings.
- **Login/Logout**:
  - Users can now log in and log out of their accounts.
- **Permission-Based Access**:
  - Certain functions require specific permissions, ensuring secure and appropriate access.
- **Ratings and Reviews**:
  - Users can rate and add reviews to books.
- **Wishlists**:
  - Add books to a personal wishlist for future reference.
- **Address Management**:
  - Users can manage multiple addresses associated with their accounts and set a default address.
- **Relationship Management**:
  - Supports relationships between books, authors, and buyers, allowing for dynamic queries and mutations.

## Entities

### Book

Represents a book available in the bookstore, including fields for title, genre, price, stock, and associated author(s).

### Author

Represents an author who has written books in the bookstore. Includes details such as name, biography, and associated books.

### Buyer

Represents a buyer who can purchase books, create wishlists, manage addresses, and leave ratings and reviews.

### Employee

Represents an employee of the bookstore, with possible administrative privileges for managing the system.

### Address

Represents an address associated with a buyer. Buyers can have multiple addresses and designate a default one for purchases.

### User

Represents a general user of the system, handling login credentials and authentication. Can be a buyer or an employee.

### Rating

Represents a rating and optional review left by a buyer for a book. Includes fields for the rating value, review content, and the associated user and book.

## Future Enhancements

- **AI-Powered Recommendations**:
  - Personalized book recommendations for buyers, powered by AI.
- **Frontend Development**:
  - A simple and user-friendly frontend to interact with the API.
- **Enhanced Security**:
  - Improved security measures to safeguard user data and accounts.
- **Improved Search and Filtering**:
  - Advanced capabilities for searching and filtering books, authors, and reviews.

## Development Status

This project is a work in progress. Contributions and feedback are welcome!

---

### Contact

For any questions or suggestions, feel free to reach out to the project maintainers.

Happy coding!
