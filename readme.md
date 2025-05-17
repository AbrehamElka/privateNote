# Private Note Application

## Description

This is a simple private note application built with Node.js, Express, and PostgreSQL. It allows users to register, log in, create, read, update, and delete notes. The application uses JSON Web Tokens (JWT) for authentication and bcryptjs for password hashing.

## Technologies Used

-   Node.js
-   Express
-   PostgreSQL
-   bcryptjs
-   jsonwebtoken
-   express-validator

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd privateNote
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env` file in the root directory and add the following environment variables:

    ```
    PORT=8000
    PGHOST=localhost
    PGUSER=postgres
    PGPORT=5432
    PGPASSWORD=your_db_password
    PGDATABASE=privateNote
    PGCONNECT_TIMEOUT=2000
    JWT_SECRET=simplePrivateNoteApp
    JWT_REFERESH_SECRET=simpleReferesh
    ```

    Make sure to replace `your_db_password` with your actual PostgreSQL password.

5.  Set up the PostgreSQL database. You can use the provided [db.sql](db.sql) file to create the necessary tables and functions:

    ```bash
    psql -U postgres -f db.sql -d privateNote
    ```

    Make sure that you have created the `privateNote` database.

## Usage

1.  Start the application:

    ```bash
    npm start
    ```

    This will start the server on `http://localhost:8000`.

## API Endpoints

### User Authentication

-   `POST /api/register`: Registers a new user.
    -   Request body:

        ```json
        {
            "firstname": "John",
            "lastname": "Doe",
            "email": "john.doe@example.com",
            "userPassword": "password123"
        }
        ```

    -   Response:

        ```json
        {
            "user": {
                "id": 1,
                "firstname": "John",
                "lastname": "Doe",
                "email": "john.doe@example.com"
            }
        }
        ```

-   `POST /api/login`: Logs in an existing user.
    -   Request body:

        ```json
        {
            "email": "john.doe@example.com",
            "userPassword": "password123"
        }
        ```

    -   Response:

        ```json
        {
            "token": "your_jwt_token"
        }
        ```

### Notes

-   `GET /api/notes/all`: Retrieves all notes for the authenticated user. Requires a valid JWT token in the `Authorization` header.
    -   Response:

        ```json
        {
            "notes": [
                {
                    "id": 1,
                    "title": "My first note",
                    "notecontent": "This is the content of my first note.",
                    "active": true,
                    "created_at": "2024-05-16T12:00:00.000Z",
                    "last_updated": "2024-05-16T12:00:00.000Z"
                }
            ]
        }
        ```

-   `POST /api/notes`: Creates a new note for the authenticated user. Requires a valid JWT token in the `Authorization` header.
    -   Request body:

        ```json
        {
            "title": "My new note",
            "notecontent": "This is the content of my new note."
        }
        ```

    -   Response:

        ```json
        {
            "message": "New Note Created Succusfully",
            "note": {
                "id": 2,
                "title": "My new note"
            }
        }
        ```

-   `GET /api/notes/:id`: Retrieves a specific note by ID for the authenticated user. Requires a valid JWT token in the `Authorization` header.
-   `PUT /api/notes/:id`: Updates a specific note by ID for the authenticated user. Requires a valid JWT token in the `Authorization` header.
-   `DELETE /api/notes/:id`: Deletes a specific note by ID for the authenticated user. Requires a valid JWT token in the `Authorization` header.

## Validation

The application uses `express-validator` for request body validation.  See [validation/userSchema.js](validation/userSchema.js) and [validation/noteSchema.js](validation/noteSchema.js) for validation schemas.

## Authentication

The application uses JWT for authentication. The [`authenticate`](controllers/noteControllers.js) middleware in [controllers/noteControllers.js](controllers/noteControllers.js) verifies the token and adds the user information to the request object.

## Database

The application uses PostgreSQL as the database. The database connection is managed by the [`pool`](db/pool.js) module in [db/pool.js](db/pool.js). The database schema is defined in [db.sql](db.sql).