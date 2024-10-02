# User Authentication with OTP

This project implements a user authentication system using Node.js, Express, and MongoDB, with OTP (One-Time Password) functionality for enhanced security. Users can register, log in, and receive an OTP to verify their identity.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [License](#license)

## Technologies Used
- **Node.js**: JavaScript runtime for server-side programming.
- **Express**: Web framework for building the server.
- **MongoDB**: NoSQL database for storing user information.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **Nodemailer**: Module for sending emails (for OTP functionality).
- **Body-parser**: Middleware for parsing incoming request bodies.

## Installation

### 1. Install Node.js
Node.js is required to run your server. Install it from the official website:
- **Download Node.js**: [Node.js Download](https://nodejs.org/)
- Verify installation:
    ```bash
    node -v
    npm -v
    ```

### 2. Install MongoDB
MongoDB is required for database operations.
- **Download MongoDB**: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **MongoDB Compass** (Optional, GUI for MongoDB): [MongoDB Compass Download](https://www.mongodb.com/try/download/compass)
- Verify MongoDB installation:
    ```bash
    mongod --version
    ```

### 3. Create a Project Folder and Files
Create a new project folder:
```bash
mkdir my-project
cd my-project
```


### 4. Run MongoDb Server
Open new terminal:
```bash
mongod
```

### 4.Start the Node.js server:
Open new terminal:
```bash
node server.js
```
