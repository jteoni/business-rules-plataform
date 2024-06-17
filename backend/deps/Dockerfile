# Use the official Python base image
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the application dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code and entrypoint script to the container
COPY . .

# Expose the port that the Django application will run on
EXPOSE 8000