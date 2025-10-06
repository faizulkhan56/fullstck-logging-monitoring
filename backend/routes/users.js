const express = require('express');
const { pool } = require('../config/database');
const { getRedisClient } = require('../config/redis');
const { publishMessage } = require('../config/rabbitmq');
const logger = require('../utils/logger');
const { userOperations } = require('../utils/metrics');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const span = req.trace?.span;
  try {
    span?.setAttributes({
      'operation': 'get_users',
      'user_count': 'all'
    });

    // Try to get from cache first
    const redisClient = getRedisClient();
    let users;
    
    try {
      const cachedUsers = await redisClient.get('users:all');
      if (cachedUsers) {
        users = JSON.parse(cachedUsers);
        logger.info('Users retrieved from cache');
        span?.setAttributes({ 'cache_hit': true });
      }
    } catch (cacheError) {
      logger.warn('Cache read failed, falling back to database:', cacheError);
    }

    if (!users) {
      // Get from database
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      users = result.rows;
      
      // Cache the result
      try {
        await redisClient.setEx('users:all', 300, JSON.stringify(users)); // 5 minutes cache
        logger.info('Users cached successfully');
      } catch (cacheError) {
        logger.warn('Cache write failed:', cacheError);
      }
      
      span?.setAttributes({ 'cache_hit': false });
    }

    userOperations.labels('get_all').inc();
    logger.info(`Retrieved ${users.length} users`);
    
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    span?.recordException(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const span = req.trace?.span;
  
  try {
    span?.setAttributes({
      'operation': 'get_user',
      'user_id': id
    });

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    userOperations.labels('get_by_id').inc();
    logger.info(`Retrieved user ${id}`);
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error(`Error fetching user ${id}:`, error);
    span?.recordException(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  const { name, mobile } = req.body;
  const span = req.trace?.span;
  
  try {
    span?.setAttributes({
      'operation': 'create_user',
      'user_name': name,
      'user_mobile': mobile
    });

    // Validate input
    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and mobile are required' });
    }

    // Check if mobile already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE mobile = $1', [mobile]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Mobile number already exists' });
    }

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, mobile) VALUES ($1, $2) RETURNING *',
      [name, mobile]
    );

    const newUser = result.rows[0];

    // Clear cache
    const redisClient = getRedisClient();
    try {
      await redisClient.del('users:all');
      logger.info('Cache cleared after user creation');
    } catch (cacheError) {
      logger.warn('Cache clear failed:', cacheError);
    }

    // Publish message to RabbitMQ
    try {
      await publishMessage('user.created', {
        userId: newUser.id,
        name: newUser.name,
        mobile: newUser.mobile,
        timestamp: new Date().toISOString()
      });
      logger.info('User creation message published');
    } catch (mqError) {
      logger.warn('Failed to publish user creation message:', mqError);
    }

    userOperations.labels('create').inc();
    logger.info(`Created user ${newUser.id}: ${name}`);
    
    res.status(201).json(newUser);
  } catch (error) {
    logger.error('Error creating user:', error);
    span?.recordException(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, mobile } = req.body;
  const span = req.trace?.span;
  
  try {
    span?.setAttributes({
      'operation': 'update_user',
      'user_id': id,
      'user_name': name,
      'user_mobile': mobile
    });

    // Validate input
    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and mobile are required' });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if mobile already exists for another user
    const duplicateMobile = await pool.query(
      'SELECT id FROM users WHERE mobile = $1 AND id != $2',
      [mobile, id]
    );
    if (duplicateMobile.rows.length > 0) {
      return res.status(409).json({ error: 'Mobile number already exists' });
    }

    // Update user
    const result = await pool.query(
      'UPDATE users SET name = $1, mobile = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, mobile, id]
    );

    const updatedUser = result.rows[0];

    // Clear cache
    const redisClient = getRedisClient();
    try {
      await redisClient.del('users:all');
      logger.info('Cache cleared after user update');
    } catch (cacheError) {
      logger.warn('Cache clear failed:', cacheError);
    }

    // Publish message to RabbitMQ
    try {
      await publishMessage('user.updated', {
        userId: updatedUser.id,
        name: updatedUser.name,
        mobile: updatedUser.mobile,
        timestamp: new Date().toISOString()
      });
      logger.info('User update message published');
    } catch (mqError) {
      logger.warn('Failed to publish user update message:', mqError);
    }

    userOperations.labels('update').inc();
    logger.info(`Updated user ${id}: ${name}`);
    
    res.json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user ${id}:`, error);
    span?.recordException(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const span = req.trace?.span;
  
  try {
    span?.setAttributes({
      'operation': 'delete_user',
      'user_id': id
    });

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    // Clear cache
    const redisClient = getRedisClient();
    try {
      await redisClient.del('users:all');
      logger.info('Cache cleared after user deletion');
    } catch (cacheError) {
      logger.warn('Cache clear failed:', cacheError);
    }

    // Publish message to RabbitMQ
    try {
      await publishMessage('user.deleted', {
        userId: parseInt(id),
        timestamp: new Date().toISOString()
      });
      logger.info('User deletion message published');
    } catch (mqError) {
      logger.warn('Failed to publish user deletion message:', mqError);
    }

    userOperations.labels('delete').inc();
    logger.info(`Deleted user ${id}`);
    
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting user ${id}:`, error);
    span?.recordException(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
