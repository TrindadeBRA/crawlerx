#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Creating example..."
    cat > .env << EOF
OPENAI_API_KEY=your_openai_key
STABILITY_AI_API_KEY=your_stability_key
CRAWLERX_WP_API_KEY=your_wp_key
CRAWLERX_WP_API_URL=your_wp_url
DATABASE_URL=your_database_url
AUTH_SECRET=your_secret
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
AUTH_TRUST_HOST=your_trust_host
EOF
    echo "Please edit the .env file with your settings before continuing."
    exit 1
fi

# Load environment variables
source .env

# Build Docker image
echo "Starting Docker image build..."
docker build -t crawlerx . \
    --build-arg OPENAI_API_KEY=$OPENAI_API_KEY \
    --build-arg STABILITY_AI_API_KEY=$STABILITY_AI_API_KEY \
    --build-arg CRAWLERX_WP_API_KEY=$CRAWLERX_WP_API_KEY \
    --build-arg CRAWLERX_WP_API_URL=$CRAWLERX_WP_API_URL \
    --build-arg DATABASE_URL=$DATABASE_URL \
    --build-arg AUTH_SECRET=$AUTH_SECRET \
    --build-arg AUTH_USERNAME=$AUTH_USERNAME \
    --build-arg AUTH_PASSWORD=$AUTH_PASSWORD

echo "Build completed successfully!" 