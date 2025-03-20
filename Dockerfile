# Use official Node.js image for Angular build
FROM node:18 AS build-stage

# Set working directory for Angular app
WORKDIR /app/frontend
RUN npm install -g @angular/cli
COPY frontend/ /app/frontend/

# Copy Angular project files (adjust path to frontend directory)
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/angular.json ./
RUN npm install
RUN npm install primeng @primeng/themes
RUN npm install ngx-owl-carousel-o


# Build Angular app
RUN npm run build

# Use official Python image for Django
FROM python:3.11

# Set working directory for Django project
WORKDIR /app

# Install dependencies for Django
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files (without the frontend folder, as it's copied separately)
COPY . .

# Copy the Angular build output from the build-stage
COPY --from=build-stage /app/frontend/dist /app/frontend/dist

# Expose the port Django will run on
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
