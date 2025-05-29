# Locket Clone

A full-stack application that clones the functionality of Locket, allowing users to share photos with friends directly to their home screens.

## Project Structure

This project is organized as a monorepo with two main directories:

- `backend/`: Node.js Express TypeScript backend
- `frontend/`: React Native Expo TypeScript frontend

## Backend Setup

### Prerequisites

- Node.js 16+
- MySQL 8.0+
- Firebase account (for storage and notifications)

### Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and Firebase configuration.

5. Run database migrations:
   ```
   npm run migrate
   ```

6. Start the development server:
   ```
   npm run dev
   ```

The server will be running at http://localhost:3000.

## Frontend Setup

### Prerequisites

- Node.js 16+
- Expo CLI
- iOS Simulator or Android Emulator (optional for mobile testing)

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your backend API URL and other configurations.

5. Start the development server:
   ```
   npm start
   ```

6. Follow the instructions in the terminal to open the app in a web browser, iOS simulator, or Android emulator.

## Features

- User authentication (register, login, forgot password)
- Friend management (add, accept, reject, remove)
- Photo sharing with friends
- Real-time notifications
- Offline support
- Device management
- User settings

## Production Deployment

### Backend

1. Build the production version:
   ```
   cd backend
   npm run build
   ```

2. Deploy the `dist` directory to your server.

3. Set up a process manager like PM2:
   ```
   pm2 start dist/server.js --name locket-backend
   ```

### Frontend

1. Build the production version:
   ```
   cd frontend
   expo build:android  # For Android
   expo build:ios      # For iOS
   expo build:web      # For web
   ```

2. Follow the Expo documentation for publishing to app stores.

## Testing

### Backend

Run tests with:
```
cd backend
npm test
```

### Frontend

Run tests with:
```
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
