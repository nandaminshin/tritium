# Tritium - Online Learning Platform

This document provides instructions on how to set up and run the Tritium project locally for development and testing purposes. The project is a full-stack application with a React frontend and a Node.js (Express) backend.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

## Project Structure

The project is divided into two main folders:

- `frontend/`: Contains the React.js client-side application.
- `backend/`: Contains the Node.js, Express, and MongoDB server-side application.

## Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Backend Setup

First, let's set up the server.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a new file named `.env` in the `backend` directory and add the following environment variables.

    ```env
    # MongoDB Connection URL
    MONGO_URL='mongodb+srv://Nandaminshin:Abc70707@tritium.ye2txed.mongodb.net/'

    # URL of the frontend application for CORS
    FRONTEND_URL='http://localhost:5173'

    # Secret key for signing JWT tokens
    JWT_SECRET_KEY = 'mysecret'
    ```

4.  **Run the backend server:**
    ```bash
    npm run dev
    ```

    The backend server should now be running on `http://localhost:3000`.

### 2. Frontend Setup

Now, let's set up the client application.

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a new file named `.env` in the `frontend` directory and add the following variable:

    ```env
    # URL of the backend server
    VITE_BACKEND_URL='http://localhost:3000'
    ```

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```

    The frontend application should now be running on `http://localhost:5173`.

## How to Use the Application

Once both the frontend and backend are running, you can open your browser and navigate to `http://localhost:5173`.

### User Roles and Registration

The application supports three user roles: `user`, `admin`, and `superAdmin`.

-   **User:** You can register a new user account directly from the registration page on the website.
-   **Admin & SuperAdmin:** These roles are not self-registered. You will need to manually change a user's role in the MongoDB database to either `admin` or `superAdmin` to access the respective dashboards.

Test User credentials 
Email - user1@gmail.com (Student - User)
Password - 12345

Email - jj@gmail.com (Instructor - Admin)
Password - 1234

Email - sana@gmail.com (Super Admin)
Password - 1234

After setting up, you can explore the features of the online learning platform.
