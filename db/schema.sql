-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fishing Spots table
CREATE TABLE fishing_spots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  fish_species TEXT[],
  difficulty_level VARCHAR(50),
  best_season VARCHAR(100),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catches table
CREATE TABLE catches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  species VARCHAR(255) NOT NULL,
  weight DECIMAL(8, 2),
  length DECIMAL(8, 2),
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photo_url VARCHAR(500),
  notes TEXT,
  caught_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes table
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  catch_id INTEGER REFERENCES catches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, catch_id)
);

-- Comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  catch_id INTEGER REFERENCES catches(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Plans table
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  description TEXT,
  features TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id),
  status VARCHAR(50),
  started_at TIMESTAMP,
  expires_at TIMESTAMP,
  payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, description, features) VALUES
  ('Free', 0, 'Basic access', ARRAY['Log catches', 'View feed', 'Basic stats']),
  ('Premium', 29900, 'Full features', ARRAY['Advanced stats', 'AI predictions', 'No ads', 'Priority support']),
  ('Pro', 49900, 'Professional features', ARRAY['All Premium features', 'Weather alerts', 'Export data']);

-- Create index for better performance
CREATE INDEX idx_catches_user_id ON catches(user_id);
CREATE INDEX idx_catches_caught_at ON catches(caught_at);
CREATE INDEX idx_likes_catch_id ON likes(catch_id);
CREATE INDEX idx_comments_catch_id ON comments(catch_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
