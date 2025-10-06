#!/bin/bash

# User List Management System Startup Script

echo "🚀 Starting User List Management System..."
echo "=========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p backend/logs

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. You may want to update the passwords for production use."
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are starting up successfully!"
    echo ""
    echo "🌐 Access Points:"
    echo "   Frontend:     http://localhost:3000"
    echo "   Backend API:  http://localhost:3001"
    echo "   Grafana:      http://localhost:3001 (admin/admin)"
    echo "   Jaeger:       http://localhost:16686"
    echo "   Prometheus:   http://localhost:9090"
    echo "   RabbitMQ:     http://localhost:15672 (guest/guest)"
    echo ""
    echo "📊 To view logs: docker-compose logs -f"
    echo "🛑 To stop:     docker-compose down"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
