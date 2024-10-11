# SRED Task 1

This project is a full-stack application developed using **Node.js**, **ExpressJS**, **MongoDB**, and **Angular**. The objective is to connect to GitHub via OAuth 2.0 authentication, handle user data, and store integration details in MongoDB.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Working Demo
![TASK_!_WORKING](https://github.com/user-attachments/assets/838e05ce-9c27-4637-84f8-7839aed24993)

## Features
- GitHub OAuth 2.0 Authentication
- Store authenticated user data in MongoDB
- Display integration status in Angular frontend
- Remove GitHub integration
- Responsive Angular Material UI

## Technology Stack
- **Node.js** (v18.x)
- **ExpressJS** (Backend Framework)
- **MongoDB** (Database)
- **Angular** (v15.2 - Frontend)
- **Angular Material** (UI Framework)

## Installation

### Backend Setup (Node.js + Express)

1. Clone the repository:

    ```bash
    git clone https://github.com/harisejaz10p/SRED-task1.git
    cd SRED-task1
    ```
2. Navigate to the `backend` folder:

    ```bash
    cd backend
    ```
3. Install backend dependencies:

    ```bash
    npm install
    ```

3. Ensure MongoDB is running locally or provide a MongoDB URI.

### Frontend Setup (Angular)

1. Navigate to the `frontend` folder:

    ```bash
    cd frontend
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

## Configuration

### Backend Configuration

1. Create a `.env` file in the root directory for environment variables:

    ```bash
    touch .env
    ```

2. Add the following environment variables in the `.env` file:

    ```bash
    GITHUB_CLIENT_ID=YOUR_CLIENT_ID
    GITHUB_CLIENT_SECRET=YOUR_CLIENT_SECRET
    GITHUB_CALLBACK_URL=http://localhost:3000
    MONGODB_URI=mongodb://localhost:27017/github_integration
    PORT=3000
    FRONTEND_REDIRECT_URL=http://localhost:4200/oauth/callback
    ```

### Frontend Configuration

1. Update the backend API URL in the Angular service file to match the backend server's URL (usually `http://localhost:3000/api/github`).

## Usage

### Running the Backend

1. Start the Node.js server:

    ```bash
    npm run dev
    ```

    The backend will be running on `http://localhost:3000`.

### Running the Frontend

1. Navigate to the `frontend` directory and start the Angular application:

    ```bash
    cd frontend
    ng serve
    ```

    The frontend will be running on `http://localhost:4200`.

## API Endpoints

### GitHub Integration

| Endpoint               | Method | Description                                       |
|------------------------|--------|---------------------------------------------------|
| `/api/github/auth`      | GET    | Initiates GitHub OAuth 2.0 authentication         |
| `/api/github/remove`    | DELETE | Removes the user's integration and revokes token  |
| `/api/github/identity`    | Get   | Returns user info from auth token                |

