-- Initialize the userlist database
-- This file is automatically executed when the PostgreSQL container starts

-- Create database if it doesn't exist (this is handled by POSTGRES_DB env var)
-- But we can add any additional setup here

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The users table will be created by the application
-- This file is here for any additional database setup
