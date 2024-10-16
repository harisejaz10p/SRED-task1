# SRED Task 2

This task focuses on integrating GitHub's API to fetch organizations, repositories, and detailed project data (commits, pull requests, and issues) and displaying it on the frontend using AG Grid. The primary goal is to retrieve and display repository information and stats for included repositories.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Working Demo
![TASK_2_WORKING](https://github.com/user-attachments/assets/05edcd37-400f-4e31-ab4c-fee673186d6f)

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
- **AG Grid** (Frontend Data Grid)

## Installation

### Backend Setup (Node.js + Express)

1. Clone the repository:

    ```bash
    git clone https://github.com/harisejaz10p/SRED-task1.git
    git checkout task-2
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

### Objective A:
1. **Fetch Organizations**: Fetch all GitHub organizations associated with the authenticated user.
   
2. **Fetch Repositories**: Retrieve all repositories for the fetched organizations.
   
3. **Display Repos in AG Grid**:
   - The AG Grid will display all repositories across organizations.
   - The table will have a column named **"Included"** (boolean checkbox), which indicates whether additional data for a specific repository (commits, pull requests, issues) should be fetched.

4. **Fetch Additional Data**: 
   - If the **Included** checkbox is checked for a repository, fetch the following data from GitHub:
     - **Commits**
     - **Pull Requests**
     - **Issues**
   - This data is fetched server-side and stored at user level further processing.

---

### Objective B: Display Data Stats in AG Grid
1. **Create AG Grid**:
   - The grid will display statistical information based on the fetched data.
   - Columns:
     - **User**: Displays the username of the GitHub account.
     - **Total Commits**: Total number of commits for the included repositories.
     - **Total Pull Requests**: Total number of pull requests for the included repositories.
     - **Total Issues**: Total number of issues for the included repositories.

2. **Data Aggregation**:
   - For each included repository, aggregate the **commits**, **pull requests**, and **issues** and display them at the user level.
   
   
## API Endpoints

### GitHub Integration

| Endpoint                              | Method | Description                                      |
|---------------------------------------|--------|--------------------------------------------------|
| `/api/github/auth`                    | GET    | Initiates GitHub OAuth 2.0 authentication         |
| `/api/github/remove`                  | DELETE | Removes the user's integration and revokes token  |
| `/api/github/identity`                | Get    | Returns user info from auth token                 |
| `/api/github/repos`                   | Get    | Returns user organization repos                   |
| `/api/github/repos-data`              | Get    | Returns user repos data                           |
| `/api/github/repos-change-include/:id`| Get    | Returns user repos data                           |
