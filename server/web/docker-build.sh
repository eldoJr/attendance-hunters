#!/bin/bash

# Build Docker image
echo "Building Docker image..."
docker build -t attendance-hunters-web .

# Run container
echo "Starting container..."
docker run -d -p 3000:80 --name attendance-hunters-web attendance-hunters-web

echo "Attendance Hunters Web is running at http://localhost:3000"