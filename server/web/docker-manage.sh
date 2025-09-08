#!/bin/bash

case "$1" in
  build)
    echo "Building Docker image..."
    docker build -t attendance-hunters-web .
    ;;
  start)
    echo "Starting container..."
    docker run -d -p 3000:80 --name attendance-hunters-web attendance-hunters-web
    echo "Web application is running at http://localhost:3000"
    ;;
  stop)
    echo "Stopping container..."
    docker stop attendance-hunters-web
    docker rm attendance-hunters-web
    ;;
  restart)
    echo "Restarting container..."
    docker stop attendance-hunters-web 2>/dev/null
    docker rm attendance-hunters-web 2>/dev/null
    docker run -d -p 3000:80 --name attendance-hunters-web attendance-hunters-web
    echo "Web application restarted at http://localhost:3000"
    ;;
  logs)
    echo "Showing container logs..."
    docker logs attendance-hunters-web
    ;;
  status)
    echo "Container status:"
    docker ps -f name=attendance-hunters-web
    ;;
  *)
    echo "Usage: $0 {build|start|stop|restart|logs|status}"
    echo "  build   - Build Docker image"
    echo "  start   - Start container"
    echo "  stop    - Stop and remove container"
    echo "  restart - Restart container"
    echo "  logs    - Show container logs"
    echo "  status  - Show container status"
    ;;
esac