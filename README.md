# User List Management System

A comprehensive fullstack application with React frontend, Node.js backend, PostgreSQL database, Redis caching, RabbitMQ messaging, OpenTelemetry tracing, and Prometheus/Grafana monitoring - all containerized with Docker.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Node.js API   │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
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
                       │   Port: 9090    │    │   Port: 3001    │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Jaeger      │
                       │   (Tracing)     │
                       │   Port: 16686   │
                       └─────────────────┘
```

## 🚀 Features

### Core Functionality
- **User Management**: Add, view, and delete users with name and mobile number
- **Real-time Updates**: Live user list updates
- **Responsive Design**: Modern, mobile-friendly UI

### Backend Services
- **RESTful API**: Express.js with proper error handling
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for improved performance
- **Messaging**: RabbitMQ for asynchronous processing
- **Security**: Helmet, CORS, rate limiting

### Monitoring & Observability
- **Tracing**: OpenTelemetry with Jaeger integration
- **Metrics**: Prometheus metrics collection
- **Logging**: Structured logging with Winston
- **Dashboards**: Grafana for visualization
- **Health Checks**: All services have health endpoints

## 📋 Prerequisites

- Docker and Docker Compose
- Git
- At least 4GB RAM available for containers

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fullstck-logging-monitoring
```

### 2. Environment Configuration

Copy the example environment file and modify as needed:

```bash
cp env.example .env
```

Edit `.env` file with your preferred settings:

```env
# Database Configuration
DB_PASSWORD=your_secure_password
DB_USER=your_db_user

# Redis Configuration
REDIS_PASSWORD=your_redis_password

# RabbitMQ Configuration
RABBITMQ_PASSWORD=your_rabbitmq_password

# Monitoring
GRAFANA_PASSWORD=your_grafana_password
```

### 3. Build and Start Services

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

### 4. Verify Services

Check that all services are running:

```bash
docker-compose ps
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React User Interface |
| **Backend API** | http://localhost:3001 | REST API Endpoints |
| **Grafana** | http://localhost:3001 | Monitoring Dashboard |
| **Jaeger** | http://localhost:16686 | Distributed Tracing |
| **Prometheus** | http://localhost:9090 | Metrics Collection |
| **RabbitMQ Management** | http://localhost:15672 | Message Queue UI |

### Default Credentials

- **Grafana**: admin / admin (or your GRAFANA_PASSWORD)
- **RabbitMQ Management**: guest / guest (or your RABBITMQ_PASSWORD)

## 📊 Monitoring & Observability

### 1. Grafana Dashboards

Access Grafana at http://localhost:3001 and explore the pre-configured dashboards:

- **User List Application Dashboard**: Application metrics and performance
- **Infrastructure Metrics**: System resource usage
- **Custom Metrics**: User operations, database connections, cache hits

### 2. Jaeger Tracing

Visit http://localhost:16686 to view distributed traces:

- **Service Map**: Visual representation of service interactions
- **Trace Search**: Find traces by service, operation, or time range
- **Span Details**: Detailed view of individual operations

### 3. Prometheus Metrics

Access http://localhost:9090 to view collected metrics:

- **Application Metrics**: HTTP requests, response times, user operations
- **Infrastructure Metrics**: Database connections, Redis operations
- **Custom Metrics**: Business logic metrics

## 🔧 API Endpoints

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health status |

### Example API Usage

```bash
# Get all users
curl http://localhost:3001/api/users

# Create a new user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "mobile": "1234567890"}'

# Delete a user
curl -X DELETE http://localhost:3001/api/users/1
```

## 🐳 Docker Services

### Core Application
- **frontend**: React application (Node.js 18)
- **backend**: Node.js API server
- **postgres**: PostgreSQL 15 database

### Supporting Services
- **redis**: Redis 7 cache
- **rabbitmq**: RabbitMQ 3 with management UI

### Monitoring Stack
- **prometheus**: Metrics collection
- **grafana**: Visualization dashboards
- **jaeger**: Distributed tracing

## 📁 Project Structure

```
fullstck-logging-monitoring/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styles
│   │   └── index.js         # Entry point
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── backend/                  # Node.js backend
│   ├── config/              # Configuration files
│   │   ├── database.js      # PostgreSQL config
│   │   ├── redis.js         # Redis config
│   │   └── rabbitmq.js      # RabbitMQ config
│   ├── routes/              # API routes
│   │   └── users.js         # User endpoints
│   ├── utils/               # Utility functions
│   │   ├── logger.js        # Winston logging
│   │   └── metrics.js       # Prometheus metrics
│   ├── server.js            # Main server file
│   ├── tracing.js           # OpenTelemetry setup
│   ├── package.json
│   └── Dockerfile
├── monitoring/              # Monitoring configuration
│   ├── prometheus.yml       # Prometheus config
│   └── grafana/             # Grafana dashboards
├── docker-compose.yml       # Docker orchestration
├── env.example             # Environment template
└── README.md               # This file
```

## 🔍 Development

### Running in Development Mode

```bash
# Start only the database and supporting services
docker-compose up postgres redis rabbitmq jaeger prometheus grafana -d

# Run backend locally
cd backend
npm install
npm run dev

# Run frontend locally
cd frontend
npm install
npm start
```

### Adding New Features

1. **Backend**: Add routes in `backend/routes/`
2. **Frontend**: Update components in `frontend/src/`
3. **Monitoring**: Add metrics in `backend/utils/metrics.js`
4. **Tracing**: OpenTelemetry will automatically instrument new code

## 🧪 Testing

### Manual Testing

1. **Frontend**: Visit http://localhost:3000
2. **API**: Use curl or Postman to test endpoints
3. **Monitoring**: Check Grafana dashboards
4. **Tracing**: View traces in Jaeger UI

### Health Checks

```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs backend
docker-compose logs frontend

# Test API health
curl http://localhost:3001/health
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 3001, 5432, 6379, 5672, 9090, 16686 are available
2. **Memory Issues**: Increase Docker memory allocation
3. **Permission Issues**: Check file permissions for logs directory

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f backend
```

### Reset Everything

```bash
# Stop and remove all containers
docker-compose down

# Remove all volumes (WARNING: This deletes all data)
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build
```

## 📈 Performance Optimization

### Production Considerations

1. **Environment Variables**: Use secure passwords in production
2. **Resource Limits**: Set appropriate memory and CPU limits
3. **SSL/TLS**: Configure HTTPS for production
4. **Backup Strategy**: Regular database backups
5. **Monitoring**: Set up alerting rules in Prometheus

### Scaling

```bash
# Scale backend instances
docker-compose up --scale backend=3

# Use external databases for production
# Update environment variables accordingly
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review Docker logs
3. Check service health endpoints
4. Open an issue in the repository

---

**Happy Coding! 🚀**
