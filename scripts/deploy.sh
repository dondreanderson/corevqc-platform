#!/bin/bash

set -e

# Configuration
ENVIRONMENT=${1:-staging}
DOCKER_REGISTRY="ghcr.io"
IMAGE_TAG=${2:-latest}

echo "🚀 Deploying COREVQC to $ENVIRONMENT environment"

# Load environment-specific configuration
case $ENVIRONMENT in
  "staging")
    SERVER_HOST="staging.corevqc.com"
    COMPOSE_FILE="docker-compose.staging.yml"
    ;;
  "production")
    SERVER_HOST="corevqc.com"
    COMPOSE_FILE="docker-compose.prod.yml"
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "📦 Pulling latest Docker images..."
docker-compose -f $COMPOSE_FILE pull

echo "🔄 Running database migrations..."
docker-compose -f $COMPOSE_FILE run --rm backend npm run db:migrate

echo "🔄 Starting services..."
docker-compose -f $COMPOSE_FILE up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🧪 Running health checks..."
if curl -f http://localhost:3001/health; then
  echo "✅ Backend health check passed"
else
  echo "❌ Backend health check failed"
  exit 1
fi

if curl -f http://localhost:3000; then
  echo "✅ Frontend health check passed"
else
  echo "❌ Frontend health check failed"
  exit 1
fi

echo "🎉 Deployment completed successfully!"
