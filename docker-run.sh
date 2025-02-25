#!/bin/bash

# Check if image exists
if ! docker images | grep -q crawlerx; then
    echo "Error: crawlerx image not found. Please run the build script first."
    exit 1
fi

# Stop and remove any existing container with the same name
docker stop crawlerx 2>/dev/null
docker rm crawlerx 2>/dev/null

# Run the container
echo "Starting container..."
docker run -d \
    --name crawlerx \
    -p 3000:3000 \
    crawlerx

echo "Container started successfully! Access at http://localhost:3000"
echo "To view logs, run: docker logs crawlerx"
echo "To stop container, run: docker stop crawlerx" 