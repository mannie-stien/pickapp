-- Create Locations table for better scalability
CREATE TABLE locations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL, -- Optional, for venue or park name
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL
);

-- Create Games table
CREATE TABLE games (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  location_id BIGINT REFERENCES locations(id) ON DELETE SET NULL,
  game_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  max_attendees INT NOT NULL,
  current_attendees INT DEFAULT 0,
  level TEXT,
  age_limit INT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create Attendees table to store users joining a game
CREATE TABLE attendees (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, game_id)
);

-- Create Recurring Games table for better recurrence handling
CREATE TABLE recurring_games (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
  recurrence_rule TEXT NOT NULL -- WEEKLY, DAILY, etc.
);

-- Create Comments table
CREATE TABLE comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for storing past games that are deleted after a certain period
CREATE TABLE past_games (
  game_id BIGINT PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User settings with JSONB for flexibility
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  receive_notifications BOOLEAN DEFAULT TRUE,
  timezone TEXT,
  language TEXT,
  preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add optimized indexes
CREATE INDEX idx_game_location_id ON games(location_id);
CREATE INDEX idx_game_time ON games(game_time);
CREATE INDEX idx_games_created_by ON games(created_by);
CREATE INDEX idx_attendees_user_id ON attendees(user_id);
CREATE INDEX idx_comments_game_id ON comments(game_id);
CREATE INDEX idx_location_city ON locations(city);
CREATE INDEX idx_location_state ON locations(state);
CREATE INDEX idx_location_country ON locations(country);



DELETE FROM auth.users WHERE id = '2476e688-2ec6-4424-82e7-0533241a8727';
