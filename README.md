# Task Management System

A web application for managing tasks with user authentication using Node.js, Express.js, React, MongoDB, and JWT.

## Features

- User Authentication (Login/Register)
- Task Management (CRUD operations)
- Task Categories
- Priority Levels
- Task Filtering & Sorting
- Search Functionality

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>
cd QUIZ_4
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Required dependencies:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- nodemon

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Required dependencies:
- react
- react-router-dom
- axios

## Running the Application

1. Start the Backend Server:
```bash
cd backend
npm start
```
The server will run on http://localhost:5000

2. Start the Frontend Application:
```bash
cd frontend
npm start
```
The application will open in your browser at http://localhost:3000

## Usage

1. Register a new account or login with existing credentials
2. Create new tasks with title, description, due date, and priority
3. View all tasks in the dashboard
4. Filter tasks by priority, status, or search by keywords
5. Edit or delete existing tasks
6. Mark tasks as completed
7. Logout when finished

## API Endpoints

### Authentication
- POST /register - Register new user
- POST /login - User login

### Tasks
- GET /tasks - Get all tasks
- POST /tasks - Create new task
- PUT /tasks/:id - Update task
- DELETE /tasks/:id - Delete task
- PATCH /tasks/:id/complete - Mark task as completed
