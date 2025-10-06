#!/bin/bash

# User List Management System Stop Script

echo "🛑 Stopping User List Management System..."
echo "========================================="

# Stop all services
docker-compose down

echo "✅ All services stopped successfully!"
echo ""
echo "💡 To remove all data (volumes): docker-compose down -v"
echo "💡 To view logs: docker-compose logs"
