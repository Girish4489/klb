#!/bin/bash

# Change the directory to the project folder
cd "$(dirname "$0")"
echo "Changed directory to $(pwd)"

# Check if port 3000 is in use
if lsof -i :3000 > /dev/null; then
    # Port 3000 is in use, kill the process
    echo "Port 3000 is in use. Killing the process..."
    kill -9 $(lsof -t -i :3000)
    echo "Process running on port 3000 killed."
else
    # Port 3000 is not in use
    echo "Port 3000 is available. Proceeding..."
fi

# Start the server
start_server() {
    if [ -d ".next" ]; then
        echo "Build folder found. Starting server..."
        npm run dev &
        echo "Server started."
    else
        echo "Build folder not found. Building project..."
        npm run build
        echo "Build complete. Starting server..."
        start_server
    fi
}

start_server

# Exit the script and close the terminal
echo "Exiting the script in 5 seconds..."
for i in {5..1}; do
    echo "$i"
    sleep 1
done
exit 0
