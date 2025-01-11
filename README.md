# GDSC Leaderboard

A real-time leaderboard application for tracking and displaying GitHub contributions from participants. Built with Node.js and React, this application provides live updates of member activities and contributions using WebSocket technology.

## Overview

The GDSC Leaderboard tracks GitHub activities in real-time, displaying member contributions and achievements. It features a modern, responsive interface with live updates and secure backend integration.

## Project Gallery

![image](https://github.com/user-attachments/assets/6117a5c5-78a0-42fa-b7a7-db23c0189009)
![image](https://github.com/user-attachments/assets/e1befd12-0ef3-42ec-97fd-33defd0306f5)

![image](https://github.com/user-attachments/assets/c6c367b5-986b-4a09-aa12-3af223f0f9da)
![image](https://github.com/user-attachments/assets/ee40640e-3a32-45d9-a8d2-181abfa544f6)


### Application Screenshots
1. Main Leaderboard Interface
2. Dark/Light Theme Variants
3. Mobile Responsive View
4. Achievement Badges Display

### Technical Diagrams
1. System Architecture Overview
2. Component Structure
3. Backend Architecture
4. Deployment Workflow
5. Performance Monitoring Dashboard

### Setup & Configuration
1. Ngrok Configuration
2. GitHub Webhook Setup
3. Testing Results

## Project Structure

```
├── Server/                 # Backend Node.js application
│   ├── config/            # Database and configuration settings
│   │   └── database.js    # MongoDB connection setup
│   ├── controllers/       # Request handlers and business logic
│   │   ├── githubController.js    # GitHub webhook handler
│   │   └── leaderboardController.js # Leaderboard data management
│   ├── services/          # Core business logic and services
│   │   └── websocketManager.js    # Real-time updates handler
│   ├── utils/            # Helper functions and utilities
│   └── server.js         # Main server configuration
│
├── gdsc-leaderboard/     # Frontend React application
│   ├── src/
│   │   ├── App.jsx       # Main application routing and layout
│   │   ├── LeaderBoard.jsx # Real-time leaderboard display
│   │   ├── Header.jsx    # Navigation and branding
│   │   ├── Theme.jsx     # Theme and styling configuration
│   │   └── assets/       # Images and static resources
│   ├── public/           # Static assets and index.html
│   └── vite.config.js    # Vite build configuration
```

## Features

### Real-time Updates
- WebSocket integration for instant updates
- Live contribution tracking
- Real-time score calculations
- Automatic leaderboard position updates

### User Interface
- Responsive design for all devices
- Dark/Light theme support
- Smooth animations and transitions
- Interactive user profiles
- Achievement badges and indicators

### Backend Architecture
- Secure API endpoints with Helmet protection
- MongoDB integration with change streams
- Efficient WebSocket broadcast system
- GitHub webhook integration
- Rate limiting and security measures

## Prerequisites

### Required Software
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher) or yarn
- ngrok for local webhook testing

### Development Tools
- VS Code (recommended)
- MongoDB Compass (optional)
- Postman (for API testing)

## Detailed Setup Instructions

### 1. Backend Setup
```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to server directory
cd Server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your MongoDB URI and other settings

# Start the server
npm start
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd gdsc-leaderboard

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your API URL

# Start development server
npm run dev
```

### 3. Ngrok Configuration
1. Sign up for ngrok account
2. Download and install ngrok
3. Configure your authtoken:
   ```bash
   ngrok config add-authtoken [your-token]
   ```
4. Start ngrok tunnel:
   ```bash
   ngrok http 5000
   ```

### 4. GitHub Webhook Setup
1. Go to your GitHub repository settings
2. Navigate to Webhooks section
3. Add webhook:
   - Payload URL: Your ngrok URL
   - Content type: application/json
   - Events: Pull requests, Push, Issues

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GITHUB_SECRET=your_webhook_secret
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

## Testing

### Load Testing
The project includes comprehensive load testing setups:

#### K6 Stress Testing
```bash
k6 run k6-stress.js
```
- Tests WebSocket connections
- Simulates multiple users
- Measures response times

#### Artillery Load Testing
```bash
artillery run artillery.yml
```
- HTTP endpoint testing
- Concurrent user simulation
- Performance metrics

## Deployment

### Vercel Deployment (Static Frontend Only)
The application is optimized for Vercel deployment:
- Frontend: Auto-deployment from main branch
- Backend: Serverless function configuration
- Environment variable configuration
- Custom domain setup

### AWS Deployment (Deprecated)
-Nginx server setup for backend deployment
-Domain DuckDNS


## Performance Monitoring

- WebSocket connection metrics
- Database query performance
- API response times
- Real-time user count

