const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'user-list-backend'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const userOperations = new client.Counter({
  name: 'user_operations_total',
  help: 'Total number of user operations',
  labelNames: ['operation']
});

const databaseConnections = new client.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

const redisConnections = new client.Gauge({
  name: 'redis_connections_active',
  help: 'Number of active Redis connections'
});

const rabbitmqMessages = new client.Counter({
  name: 'rabbitmq_messages_total',
  help: 'Total number of RabbitMQ messages',
  labelNames: ['queue', 'type']
});

// Register the metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(userOperations);
register.registerMetric(databaseConnections);
register.registerMetric(redisConnections);
register.registerMetric(rabbitmqMessages);

// Middleware to collect HTTP metrics
const collectHttpMetrics = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

// Function to register Prometheus metrics
function registerPrometheusMetrics() {
  // This function is called during server startup
  console.log('Prometheus metrics registered');
}

// Function to get metrics
async function getMetrics() {
  return register.metrics();
}

module.exports = {
  register,
  httpRequestDuration,
  httpRequestTotal,
  activeConnections,
  userOperations,
  databaseConnections,
  redisConnections,
  rabbitmqMessages,
  collectHttpMetrics,
  registerPrometheusMetrics,
  getMetrics
};
