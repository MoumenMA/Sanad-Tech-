# SANADTECH_TEST - Users App

A full-stack web application to display and search users efficiently.  
This project includes:

- **Frontend:** React + Tailwind CSS app with search bar and alphabet filter.
- **Backend:** Node.js + Express API serving user data.
- **Dockerized:** Both frontend and backend can be run in containers with Docker and Docker Compose.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Setup & Run (Local)](#setup--run-local)
- [Docker Usage](#docker-usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Display large user lists efficiently (optimized for millions of users)
- Search users by name (with debounced search)
- Alphabet filter (A-Z) with clear filter option
- Pagination with "Load More"
- Error handling and loading indicators
- Fully Dockerized for easy deployment

---

## Project Structure

```bash

SANADTECH_TEST/
├─ frontend/ # React frontend
│ ├─ Dockerfile
│ ├─ package.json
│ ├─ tsconfig.json
│ └─ src/...
├─ backend/ # Node.js backend
│ ├─ Dockerfile
│ ├─ package.json
│ └─ app.js
├─ docker-compose.yml
└─ README.md
```
---

## Requirements

- [Node.js](https://nodejs.org/) >= v22.16.0
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## Setup & Run (Local without Docker)

1. **Clone the repository**

```bash
git clone https://github.com/MoumenMA/SANADTECH_TEST.git
cd SANADTECH_TEST
```

2. **Clone the repository**Install dependencies

.Frontend:
```bash
cd frontend
npm install
```

.Backend:
```bash
cd backend
npm install
```

3.Run backend
```bash
cd backend
node app.js

# Backend will run on: http://localhost:8888
```

4.Run frontend
```bash
cd frontend
npm start

# Frontend runs on: http://localhost:3000
```
Docker Usage
Use Docker Compose to spin up the entire environment with isolated dependencies.

1.Build and run containers:

```bash
docker-compose up --build
```

2.Access the services:

Frontend: http://localhost:3000
Backend: http://localhost:8888

3.Stop containers:

```bash
docker-compose down
```



