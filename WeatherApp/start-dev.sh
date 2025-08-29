#!/bin/bash

# Weather App Development Startup Script

echo "🌤️  Starting Weather App Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping servers..."
    pkill -f "json-server"
    pkill -f "expo start"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start JSON Server in background
echo "🚀 Starting JSON Server on port 3001..."
npx json-server --watch data/weatherData.json --port 3001 &
JSON_SERVER_PID=$!

# Wait a moment for JSON server to start
sleep 2

# Check if JSON server started successfully
if ! curl -s http://localhost:3001/ > /dev/null; then
    echo "❌ Failed to start JSON Server"
    cleanup
fi

echo "✅ JSON Server is running on http://localhost:3001"

# Start Expo development server
echo "🚀 Starting Expo development server..."
echo "📱 You can now run the app on your device or simulator"
echo "   - Press 'i' for iOS simulator"
echo "   - Press 'a' for Android emulator"
echo "   - Scan QR code with Expo Go app"
echo ""
echo "🛑 Press Ctrl+C to stop all servers"

npm start

# This line will only be reached if npm start exits
cleanup
