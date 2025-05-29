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

5. Start the development server with Expo Dev Client:
   ```
   npx expo start --dev-client
   ```

6. Follow the instructions in the terminal. You will need a development build of the app installed on your emulator or device to run the project. You can build one using `npx eas build -p android --profile development` or `npx eas build -p ios --profile development` (requires EAS CLI and an Expo account).
Alternatively, for web, you might be able to run `npx expo start --web` if web compatibility is maintained.

**Important API Note:**
The backend is currently in a **placeholder state**.
- The primary endpoint for creating new moments is `POST /api/v1/moments`. The frontend uploads the image to Firebase Storage and sends the `thumbnail_url` along with `recipients` and `overlays` in the request body (e.g., `{ data: { thumbnail_url, recipients, overlays } }`) to this endpoint. This endpoint currently only returns a placeholder success message.
- All other backend API endpoints (e.g., for authentication, user management, friend management, photo history) are also placeholders. They will return mock data and **require full implementation by the user** to function correctly with a database and other necessary services.

## Features

- User authentication (register, login, forgot password)
- Friend management (add, accept, reject, remove)
- Photo sharing with friends (Video functionality has been removed)
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

1.  Ensure your `app.json` (specifically the `expo` object) is correctly configured for production (bundle identifiers, versions, etc.).
2.  Build the production version using EAS Build:
    ```
    cd frontend
    npx eas build -p android --profile production
    npx eas build -p ios --profile production
    ```
    For web, if configured:
    ```
    npx expo export -p web
    ```
    This will create a `web-build` directory which can be deployed to a static host.

3.  Follow the Expo (EAS) documentation for submitting to app stores or deploying the web build.

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
