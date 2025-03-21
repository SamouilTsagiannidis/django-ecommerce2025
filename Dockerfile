# Use official Node.js image for Angular build
FROM node:18 AS build-stage

# Set working directory for Angular app
WORKDIR /app/frontend

# Copy package.json and package-lock.json separately for better caching
COPY frontend/package.json frontend/package-lock.json ./

# Install Angular dependencies
RUN npm install

# Install additional dependencies (avoid multiple installs)
RUN npm install primeng @primeng/themes ngx-owl-carousel-o

# Copy the rest of the Angular project files
COPY frontend/ ./

# Build Angular app
RUN npm run build

# Use official Python image for Django
FROM python:3.11

# Set working directory for Django project
WORKDIR /app

# Copy only requirements file first for better caching
COPY requirements.txt .

# Install dependencies for Django
RUN pip install --no-cache-dir -r requirements.txt && python -m pip freeze

# Copy the rest of the Django project files
COPY . .

# Copy the Angular build output from the build-stage
COPY --from=build-stage /app/frontend/dist /app/frontend/dist

# Expose the port Django will run on
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
