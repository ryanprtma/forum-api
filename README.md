# Forum API

The Forum API is a RESTful API designed to build discussion forums. This API provides features such as user authentication, thread creation, commenting, and user management.

## Features

- **User Authentication**: Registration, login, and session management.
- **Thread Management**: Create, read, update, and delete discussion threads.
- **Comment Management**: Add, read, update, and delete comments within a thread.
- **User Management**: User profiles and account updates.

## Technologies Used

- **Migration**: node-pg-migrate (Run with `migrate up`)
- **Framework**: Hapi.js (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Token)

## Creating the Database

1. **Ensure PostgreSQL is installed and running.**
2. **Create a new database:**
   ```sh
   createdb forumapi
   ```
   or using `psql`:
   ```sh
   psql -U your_username -c "CREATE DATABASE forumapi;"
   ```
3. **Create a test database:**
   ```sh
   createdb forumapi_test
   ```
   or using `psql`:
   ```sh
   psql -U your_username -c "CREATE DATABASE forumapi_test;"
   ```
4. **Ensure PostgreSQL is installed and running.**


## Installation

1. **Clone this repository**
   ```sh
   git clone https://github.com/ryanprtma/forum-api.git
   cd forum-api
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Create a configuration file** based on `.env.example`
   ```sh
   cp .env.example .env
   ```
4. **Run database migration**
   ```sh
   npm run migrate up
   ```
5. **Run test database migration**
   ```sh
   npm run migrate:test up
   ```
6. **Start the application**
   ```sh
   npm start
   ```
7. **Start the application in development mode**
   ```sh
   npm run start:dev
   ```

## Testing the Application

1. **Run unit and integration tests**
   ```sh
   npm test
   ```
2. **Run tests in watch mode** (for development)
   ```sh
   npm run test:watch
   ```

## Contribution

1. Fork this repository.
2. Create a new branch for the feature or fix you want to add.
3. Commit your changes.
4. Submit a pull request.

