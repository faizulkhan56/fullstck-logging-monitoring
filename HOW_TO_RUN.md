# 🚀 How to Run the Application

## Understanding the Scripts vs Docker Compose

### 📁 What are the scripts?
- `start.sh` - **Host machine script** (not in containers)
- `stop.sh` - **Host machine script** (not in containers)  
- `test-api.sh` - **Host machine script** (not in containers)

### 🔧 How they work:

#### The Scripts (start.sh, stop.sh)
```bash
# These run ON YOUR COMPUTER (host machine)
./start.sh    # Runs: docker-compose up --build -d
./stop.sh     # Runs: docker-compose down
```

#### Docker Compose (docker-compose.yml)
```bash
# This runs the containers
docker-compose up --build -d
```

## 🎯 Three Ways to Run

### Option 1: Using Scripts (Easiest)
```bash
# Linux/Mac
chmod +x start.sh stop.sh
./start.sh

# Windows PowerShell
# Just run: docker-compose up --build -d
```

### Option 2: Direct Docker Compose
```bash
# Start
docker-compose up --build -d

# Stop  
docker-compose down
```

### Option 3: Windows
```powershell
# Start
docker-compose up --build -d

# Stop
docker-compose down
```

## 🔍 What Happens When You Run

### Using start.sh:
1. ✅ Checks if Docker is running
2. ✅ Creates .env file if missing
3. ✅ Creates logs directory
4. ✅ Runs `docker-compose up --build -d`
5. ✅ Shows you all access URLs
6. ✅ Provides helpful commands

### Using docker-compose directly:
1. ✅ Builds all Docker images
2. ✅ Starts all containers
3. ✅ Sets up networking between containers
4. ✅ Runs health checks

## 📦 What Gets Built

When you run either method, Docker creates these containers:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   PostgreSQL   │
│   (React)       │    │   (Node.js)     │    │   (Database)   │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │     Redis       │    │   RabbitMQ      │
                       │   (Caching)     │    │  (Messaging)    │
                       │   Port: 6379    │    │   Port: 5672    │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Prometheus    │    │    Grafana      │
                       │  (Monitoring)   │    │  (Dashboard)   │
                       │   Port: 9090    │    │   Port: 3002    │
                       └─────────────────┘    └─────────────────┘
```

## 🎯 Recommended Approach

### For Beginners:
```bash
# Use the script - it does everything for you
./start.sh
```

### For Advanced Users:
```bash
# Use docker-compose directly for more control
docker-compose up --build -d
```

## 🛑 How to Stop

### Using Script:
```bash
./stop.sh
```

### Using Docker Compose:
```bash
docker-compose down
```

### Clean Everything:
```bash
docker-compose down -v  # Removes all data
```

## 🔧 Troubleshooting

### Scripts not working?
```bash
# Make them executable
chmod +x start.sh stop.sh test-api.sh

# Or just use docker-compose directly
docker-compose up --build -d
```

### Windows users?
```powershell
# Just use docker-compose
docker-compose up --build -d
```

## 📊 After Starting

Once running, you can access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **Grafana**: http://localhost:3002
- **Jaeger**: http://localhost:16686
- **Prometheus**: http://localhost:9090

---

**Bottom Line**: The scripts are just convenience wrappers around docker-compose commands. You can use either approach!
