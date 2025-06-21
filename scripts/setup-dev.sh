#!/bin/bash

set -e

echo "🔧 Setting up COREVQC development environment"

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Required tools are installed"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
  exit 1
fi

echo "✅ Node.js version is compatible"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example"
  cp .env.example .env
  echo "⚠️  Please edit .env file with your configuration"
fi

# Install dependencies
echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Start database and Redis
echo "🗄️ Starting database and Redis..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker-compose exec postgres pg_isready -U corevqc_user -d corevqc_dev; do
  sleep 2
done

# Run database migrations
echo "🔄 Running database migrations..."
cd backend && npm run db:migrate && npm run db:seed && cd ..

echo "🎉 Development environment setup completed!"
echo ""
echo "To start development servers:"
echo "  npm run dev"
echo ""
echo "To access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3001"
echo "  Database: postgresql://corevqc_user:password@localhost:5432/corevqc_dev"
echo ""
echo "Default login credentials:"
echo "  Email: admin@corevqc.com"
echo "  Password: admin123"
