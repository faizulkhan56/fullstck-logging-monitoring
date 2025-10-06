# 🚀 Quick Start Guide

## Prerequisites
- Docker Desktop running
- At least 4GB RAM available
- Ports 3000, 3001, 3002, 5432, 6379, 5672, 9090, 15672, 16686 available

## Start Application

### Option 1: Using Script (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Using Docker Compose (All Platforms)
```bash
# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Option 3: Windows PowerShell
```powershell
docker-compose up --build -d
```

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| 🌐 **Frontend** | http://localhost:3000 | - |
| 🔌 **Backend API** | http://localhost:3001 | - |
| 📊 **Grafana** | http://localhost:3002 | admin / admin |
| 🔍 **Jaeger** | http://localhost:16686 | - |
| 📈 **Prometheus** | http://localhost:9090 | - |
| 🐰 **RabbitMQ** | http://localhost:15672 | guest / guest |

## Quick Tests

### Test Backend API
```bash
# Health check
curl http://localhost:3001/health

# Get users
curl http://localhost:3001/api/users

# Add user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","mobile":"1234567890"}'
```

### Run Test Script
```bash
chmod +x test-api.sh
./test-api.sh
```

## Stop Application

```bash
# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## Troubleshooting

### Services not starting?
```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend
docker-compose logs frontend
```

### Port conflicts?
```bash
# Check what's using the ports
# Windows PowerShell
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
netstat -ano | findstr ":3002"

# Linux/Mac
lsof -i :3000
lsof -i :3001
lsof -i :3002
```

### Rebuild from scratch
```bash
# Stop everything
docker-compose down -v

# Remove images
docker-compose rm -f

# Rebuild
docker-compose up --build -d
```

## Monitoring Quick Guide

### View Application Metrics
1. Open Grafana: http://localhost:3002
2. Login: admin / admin
3. Navigate to Dashboards → User List Application Dashboard

### View Distributed Traces
1. Open Jaeger: http://localhost:16686
2. Select Service: user-list-backend
3. Click "Find Traces"

### View Raw Metrics
1. Open Prometheus: http://localhost:9090
2. Try queries like:
   - `http_requests_total`
   - `user_operations_total`
   - `database_connections_active`

## Development Mode

### Run Backend Locally
```bash
cd backend
npm install
npm run dev
```

### Run Frontend Locally
```bash
cd frontend
npm install
npm start
```

**Note**: Update `.env` to point to local services if running outside Docker

## Common Commands

```bash
# View running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# View service logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend sh

# Scale a service
docker-compose up --scale backend=3

# Check resource usage
docker stats
```

## Next Steps

1. ✅ Start the application
2. ✅ Open frontend at http://localhost:3000
3. ✅ Add some users
4. ✅ Check Grafana dashboards
5. ✅ View traces in Jaeger
6. ✅ Monitor metrics in Prometheus

---

**Need Help?** Check README.md for detailed documentation
