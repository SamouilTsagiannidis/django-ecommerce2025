# Build the frontend
FROM node:18 AS build-stage

WORKDIR /app/frontend

# Copy package files first for caching
COPY frontend/package.json frontend/package-lock.json ./

RUN npm install

# Copy the rest of the frontend files
COPY frontend/ ./

# Build the production version of the frontend
RUN npm run build --prod


# Set up the backend with Python/Django
FROM python:3.11 AS backend

# Install dependencies
RUN apt-get update && apt-get install -y netcat-openbsd mariadb-client

WORKDIR /app

# Copy the requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install -r /app/requirements.txt

# Copy the backend application code
COPY . .

# Copy the static frontend build into the backend
COPY --from=build-stage /app/frontend/dist /app/static/

# Collect static files (Django)
RUN python manage.py collectstatic --noinput

# Expose port for the app
EXPOSE 8000

# Start the Django application with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "your_project.wsgi:application"]

