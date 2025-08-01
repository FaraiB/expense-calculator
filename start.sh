#!/bin/bash

# Start the backend server in the background
echo "Starting backend server..."
cd backend
node server.js &

# Wait a moment for the backend to initialize
sleep 2

# Start the frontend development server
echo "Starting frontend development server..."
cd ../frontend
npm run dev

# When the frontend server is stopped (Ctrl+C), kill the backend server
kill $! 