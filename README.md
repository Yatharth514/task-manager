# Task Manager

A full-stack task management application built with the FARM stack.

## Tech Stack

- **Backend:** FastAPI, Python
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Frontend:** React, Vite, Tailwind CSS

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Create, read, update, delete tasks
- Set task priority (low, medium, high)
- Set task status (pending, completed)
- Due date support
- User-specific data (users only see their own tasks)

## Project Structure
task-manager/
├── backend/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── utils/
│   ├── main.py
│   ├── database.py
│   └── config.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `backend/.env`:
MONGO_URI=your_atlas_uri
DB_NAME=task_manager_db
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/tasks/ | Get all tasks | Yes |
| POST | /api/tasks/ | Create task | Yes |
| PATCH | /api/tasks/{id} | Update task | Yes |
| DELETE | /api/tasks/{id} | Delete task | Yes |
