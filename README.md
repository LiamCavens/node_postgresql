# Node - NoSql

Simple overview to learning node with mongodb

---

## Features

- List the key features of the application.
- Example:
  - Manage user accounts, carts, and orders.
  - View and update product details.
  - Use MongoDB as a NoSQL database.
  - Follow a layered architecture with TypeScript.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Tools**: Git, Nodemon, Jest (optional for testing)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LiamCavens/node-postgresql.git
   cd node-postgresql
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables:
    - Create a new file `.env` in the root directory.
    - Add these environment variables:
      ```env
      DB_HOST=localhost
      DB_PORT=5432
      DB_USER=postgres
      DB_PASSWORD=yourpassword
      DB_NAME=node_postgresql
      ```

4. Start Postgres server and create database

5. Run the project:
    ```bash
    npm run dev
    ```

6. Add Products (Or Seed (which is currently broken))
    ```bash
    POST http://localhost:8000/api/products

    {
        "title": "Product Name",
        "description": "Product Description",
        "price": 100
    }
    ```