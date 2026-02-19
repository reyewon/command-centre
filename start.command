#!/bin/bash
# Ryan's Command Centre - macOS Startup Script
# Double-click this file to start the dashboard

cd "$(dirname "$0")"

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║    Ryan's Command Centre             ║"
echo "  ║    Starting dashboard...              ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "  First run detected - installing dependencies..."
    npm install
    echo ""
fi

# Check if .next build exists
if [ ! -d ".next" ]; then
    echo "  Building the dashboard..."
    npx next build
    echo ""
fi

echo "  Dashboard starting at:"
echo "  → http://localhost:3000"
echo ""
echo "  To access from your phone on the same network:"
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}')
echo "  → http://${LOCAL_IP}:3000"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

# Open browser
open http://localhost:3000 2>/dev/null || true

# Start the server
npx next start -p 3000 -H 0.0.0.0
