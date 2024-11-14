# Bookstore GraphQL API

## Overview

This project is a fully functional Bookstore API built with GraphQL, providing comprehensive CRUD functionality. It simulates a real-world bookstore, managing books, authors, buyers, and the relationships between them. Currently, the API includes three main entities:

- **Book**
- **Author**
- **Buyer**

Note: This project is still under active development, so additional features and enhancements are in progress.

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
npx ts-node src/index.ts
```

The server will run locally at:

```
http://localhost:4000/graphql
```

### GraphQL Playground

Access the GraphQL Playground at `http://localhost:4000` to explore and run queries and mutations.

## Features

- **CRUD Operations**:
  - Full Create, Read, Update, and Delete functionalities for books, authors, and buyers.
- **Relationship Management**:
  - Supports the relationships between books, authors, and buyers, allowing for more dynamic queries and mutations.

## Entities

1. **Book**
2. **Author**
3. **Buyer**

## Future Enhancements

- Additional features and entities.
- Improved search and filtering capabilities.
- Enhanced validation and security.

## Development Status

This project is a work in progress. Contributions and feedback are welcome!

---

### Contact

For any questions or suggestions, feel free to reach out to the project maintainers.

Happy coding!
