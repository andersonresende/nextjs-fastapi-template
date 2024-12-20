[![CI](https://github.com/vintasoftware/nextjs-fastapi-template/actions/workflows/ci.yml/badge.svg)](https://github.com/vintasoftware/nextjs-fastapi-template/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/vintasoftware/nextjs-fastapi-template/badge.svg)](https://coveralls.io/github/vintasoftware/nextjs-fastapi-template)

# nextjs-fastapi-template

## Table of Contents
* [Overview](#overview)
* [Local Setup](#local-setup)
  * [Installing Required Tools](#installing-required-tools)
  * [Setting Up Environment Variables](#setting-up-environment-variables)
  * [Running the Project Locally](#running-the-project-locally-without-docker)
    * [Backend](#backend)
    * [Frontend](#frontend)
  * [Running the Project Using Docker](#running-the-project-using-docker)
* [Pre-Commit Setup](#pre-commit-setup)
* [Running the Application](#running-the-application)
* [Watchers](#watchers)
  * [Recommended Approach](#recommended-approach-run-both-watchers-and-servers-simultaneously)
  * [Manual Execution of Watcher Commands](#manual-execution-of-watcher-commands)
* [Makefile](#makefile)
* [Important Considerations](#important-considerations)

## Overview
This project consists of a backend (API built with FastAPI) and a frontend (web application built with Next.js). You can choose to run the project locally or using Docker. Using Docker is recommended to simplify setup, especially for database management.

## Local Setup

### Installing Required Tools

#### 1. Poetry
Poetry is used to manage Python dependencies in the backend. Install Poetry by following the [official installation guide](https://python-poetry.org/docs/#installation).

Once installed, navigate to the `fastapi_backend` directory and run:

```bash
poetry install
```

#### 2. Node.js and npm
Ensure Node.js and npm are installed for running the frontend. Follow the [Node.js installation guide](https://nodejs.org/en/download/).

Install the frontend dependencies by navigating to the `nextjs-frontend` directory and running:

```bash
npm install
```

#### 3. Docker
Docker is needed to run the project in a containerized environment. Follow the appropriate installation guide:

- [Install Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- [Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
- [Get Docker CE for Linux](https://docs.docker.com/install/linux/docker-ce/)

#### 4. Docker Compose
Ensure `docker-compose` is installed. Refer to the [Docker Compose installation guide](https://docs.docker.com/compose/install/).

### Setting Up Environment Variables
Create or update the `.env` files in the `fastapi_backend` and `nextjs-frontend` directories with the following variables:

**Backend (`fastapi_backend/.env`):**

For local setup:
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/mydatabase
```
For Docker setup, replace localhost with db:
```
DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/mydatabase
```
Other environment variables remain unchanged:

```env
ACCESS_SECRET_KEY=<your-secret-key>
RESET_PASSWORD_SECRET_KEY=<your-secret-key>
VERIFICATION_SECRET_KEY=<your-secret-key>
OPENAPI_OUTPUT_FILE=../nextjs-frontend/openapi.json

MAIL_USERNAME=<your-username>
MAIL_PASSWORD=<your-password>
MAIL_FROM=<your-from>
MAIL_SERVER=<your-server>
```

**Frontend (`nextjs-frontend/.env.local`):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
OPENAPI_OUTPUT_FILE=openapi.json
```

### Running the Project Locally Without Docker
To run the project locally, use the following commands:

#### Backend
1. Navigate to the `fastapi_backend` directory.
2. Use Docker to run the database to avoid local installation issues. Build and start the database container:
   ```bash
   docker compose build db
   docker compose up db
   ```
3. Run the following command to apply database migrations:
   ```bash
   make docker-migrate-db
   ```
4. Start the FastAPI server:
   ```bash
   make start-backend
   ```

#### Frontend
1. Navigate to the `nextjs-frontend` directory.
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   make start-frontend
   ```

### Running the Project Using Docker
1. Ensure Docker is running.
2. Run the following command to build and start the backend, frontend, and database containers:
   ```bash
   make docker-up-backend
   make docker-up-frontend
   ```
   This command will automatically set up the database and other necessary containers.

3. To create the database schema for the first time, run:
   ```bash
   make docker-migrate-db
   ```

## Pre-Commit Setup
To maintain code quality and consistency, the project includes two separate pre-commit configuration files:
- `.pre-commit-config.yaml` for running pre-commit checks locally.
- `.pre-commit-config.docker.yaml` for running pre-commit checks within Docker.

### Installing and Activating Pre-Commit Hooks
To activate pre-commit hooks, run the following commands for each configuration file:

- **For the local configuration file**:
  ```bash
  pre-commit install -c .pre-commit-config.yaml
  ```

- **For the Docker configuration file**:
  ```bash
  pre-commit install -c .pre-commit-config.docker.yaml
  ```

### Running Pre-Commit Checks
To manually run the pre-commit checks on all files, use:

```bash
pre-commit run --all-files -c .pre-commit-config.yaml
```

or

```bash
pre-commit run --all-files -c .pre-commit-config.docker.yaml
```

### Updating Pre-Commit Hooks
To update the hooks to their latest versions, run:

```bash
pre-commit autoupdate
```

## Running the Application
- **Backend**: Access the API at `http://localhost:8000`.
- **Frontend**: Access the web application at `http://localhost:3000`.

## Watchers
The project includes two watchers, one for the backend and one for the frontend, which automatically restart when they detect changes.

- The **backend watcher** monitors changes to the API code.
- The **frontend watcher** monitors changes to the `openapi.json` schema generated by the backend.

### Recommended Approach: Run Both Watchers and Servers Simultaneously
To streamline development, it is recommended to run both the backend and frontend watchers at the same time. This approach will start both servers and their respective watchers, ensuring they are restarted automatically whenever changes are detected.

- Use the following commands:
    ```bash
    make watch-backend
    make watch-frontend
    ```
This will run both the backend and frontend servers, as well as the watchers, ensuring that the application is always up-to-date without needing manual restarts.  

### Manual Execution of Watcher Commands
You can manually execute the same commands that the watchers call when they detect a change:

1. To export the `openapi.json` schema:
   ```bash
   cd fastapi_backend && poetry run python -m app.commands.generate_openapi_schema
   ```
   or using Docker:
   ```bash
   docker compose run --rm --no-deps -T backend poetry run python -m app.commands.generate_openapi_schema
   ```

2. To generate the frontend client:
   ```bash
   cd nextjs-frontend && npm run generate-client
   ```
   or using Docker:
   ```bash
   docker compose run --rm --no-deps -T frontend npm run generate-client
   ```

## Makefile

This project includes a `Makefile` that provides a set of commands to simplify common tasks such as starting the backend and frontend servers, running tests, building Docker containers, and more.

### Available Commands

You can see all available commands and their descriptions by running the following command in your terminal:

```bash
make help
```

## Important Considerations
- **Environment Variables**: Ensure your `.env` files are up-to-date.
- **Database Setup**: It is recommended to use Docker for running the database, even when running the backend and frontend locally, to simplify configuration and avoid potential conflicts.
- **Consistency**: It is **not recommended** to switch between running the project locally and using Docker, as this may cause permission issues or unexpected problems. Choose one method and stick with it.