- Locket Clone Database Schema
-- This script creates the database and all required tables for the Locket Clone application

-- Create database
CREATE DATABASE IF NOT EXISTS locket_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE locket_clone;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  avatar_url VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_new_photo BOOLEAN DEFAULT TRUE,
  notification_friend_request BOOLEAN DEFAULT TRUE,
  notification_friend_accepted BOOLEAN DEFAULT TRUE,
  privacy_show_online_status BOOLEAN DEFAULT TRUE,
  privacy_allow_friend_requests BOOLEAN DEFAULT TRUE,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'blocked') NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_friendship (user_id, friend_id)
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  caption TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create photo_recipients table
CREATE TABLE IF NOT EXISTS photo_recipients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  photo_id INT NOT NULL,
  recipient_id INT NOT NULL,
  viewed BOOLEAN DEFAULT FALSE,
  viewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_photo_recipient (photo_id, recipient_id)
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  device_token VARCHAR(255) NOT NULL,
  device_type ENUM('ios', 'android', 'web') NOT NULL,
  device_name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_device_token (device_token)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('friend_request', 'photo', 'system') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data for testing

-- Insert sample users
INSERT INTO users (username, email, password, full_name, avatar_url, is_verified) VALUES
('johndoe', 'john@example.com', '$2b$10$6Bnxp.LE9o1QLX9Wj0K6wOLO.QZRRw7jAU9U9oYRxCJUxCJUxCJUx', 'John Doe', 'https://randomuser.me/api/portraits/men/1.jpg', TRUE),
('janedoe', 'jane@example.com', '$2b$10$6Bnxp.LE9o1QLX9Wj0K6wOLO.QZRRw7jAU9U9oYRxCJUxCJUxCJUx', 'Jane Doe', 'https://randomuser.me/api/portraits/women/1.jpg', TRUE),
('bobsmith', 'bob@example.com', '$2b$10$6Bnxp.LE9o1QLX9Wj0K6wOLO.QZRRw7jAU9U9oYRxCJUxCJUxCJUx', 'Bob Smith', 'https://randomuser.me/api/portraits/men/2.jpg', TRUE),
('alicejones', 'alice@example.com', '$2b$10$6Bnxp.LE9o1QLX9Wj0K6wOLO.QZRRw7jAU9U9oYRxCJUxCJUxCJUx', 'Alice Jones', 'https://randomuser.me/api/portraits/women/2.jpg', TRUE),
('mikebrown', 'mike@example.com', '$2b$10$6Bnxp.LE9o1QLX9Wj0K6wOLO.QZRRw7jAU9U9oYRxCJUxCJUxCJUx', 'Mike Brown', 'https://randomuser.me/api/portraits/men/3.jpg', TRUE);

-- Insert user settings
INSERT INTO user_settings (user_id) VALUES (1), (2), (3), (4), (5);

-- Insert friendships
INSERT INTO friends (user_id, friend_id, status) VALUES
(1, 2, 'accepted'), -- John and Jane are friends
(2, 1, 'accepted'),
(1, 3, 'accepted'), -- John and Bob are friends
(3, 1, 'accepted'),
(2, 3, 'accepted'), -- Jane and Bob are friends
(3, 2, 'accepted'),
(4, 1, 'pending'), -- Alice sent a request to John
(5, 1, 'pending'); -- Mike sent a request to John

-- Insert sample photos
INSERT INTO photos (sender_id, image_url, caption) VALUES
(1, 'https://picsum.photos/id/1/500/500', 'Beautiful day!'),
(2, 'https://picsum.photos/id/2/500/500', 'Enjoying the weekend'),
(3, 'https://picsum.photos/id/3/500/500', 'Check out this view!');

-- Insert photo recipients
INSERT INTO photo_recipients (photo_id, recipient_id, viewed) VALUES
(1, 2, TRUE),  -- John's photo sent to Jane (viewed)
(1, 3, FALSE), -- John's photo sent to Bob (not viewed)
(2, 1, TRUE),  -- Jane's photo sent to John (viewed)
(2, 3, TRUE),  -- Jane's photo sent to Bob (viewed)
(3, 1, FALSE), -- Bob's photo sent to John (not viewed)
(3, 2, FALSE); -- Bob's photo sent to Jane (not viewed)

-- Insert devices
INSERT INTO devices (user_id, device_token, device_type, device_name) VALUES
(1, 'device_token_john_ios', 'ios', 'John''s iPhone'),
(1, 'device_token_john_web', 'web', 'John''s Chrome Browser'),
(2, 'device_token_jane_android', 'android', 'Jane''s Android Phone'),
(3, 'device_token_bob_ios', 'ios', 'Bob''s iPad'),
(4, 'device_token_alice_android', 'android', 'Alice''s Android Phone'),
(5, 'device_token_mike_ios', 'ios', 'Mike''s iPhone');

-- Insert notifications
INSERT INTO notifications (user_id, title, message, type, is_read, data) VALUES
(1, 'New Friend Request', 'Alice Jones sent you a friend request', 'friend_request', FALSE, '{"friend_request_id": 7}'),
(1, 'New Friend Request', 'Mike Brown sent you a friend request', 'friend_request', FALSE, '{"friend_request_id": 8}'),
(1, 'New Photo', 'Bob Smith sent you a photo', 'photo', FALSE, '{"photo_id": 3}'),
(2, 'New Photo', 'Bob Smith sent you a photo', 'photo', FALSE, '{"photo_id": 3}'),
(3, 'New Photo', 'John Doe sent you a photo', 'photo', FALSE, '{"photo_id": 1}');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_friend_id ON friends(friend_id);
CREATE INDEX idx_photos_sender_id ON photos(sender_id);
CREATE INDEX idx_photo_recipients_photo_id ON photo_recipients(photo_id);
CREATE INDEX idx_photo_recipients_recipient_id ON photo_recipients(recipient_id);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Grant privileges to the application user
-- Note: Replace 'app_user' and 'app_password' with your actual application user and password
-- CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'app_password';
-- GRANT ALL PRIVILEGES ON locket_clone.* TO 'app_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Completed database setup
SELECT 'Locket Clone database setup completed successfully!' AS 'Setup Status';