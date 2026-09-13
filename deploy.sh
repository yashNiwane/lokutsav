#!/bin/bash
# ==========================================================
# Lokutsav (लोकोत्सव) Single-Command VPS Deployment Script
# ==========================================================
set -e

echo "🚩 Starting Lokutsav Deployment on VPS..."

# 1. Check if Docker and Docker Compose are installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  sudo usermod -aG docker $USER
fi

# 2. Setup .env if missing
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠️ Please review .env with your Razorpay and Database credentials if needed."
fi

# 3. Build and launch Docker containers
echo "🚀 Building and starting containers..."
docker compose down || true
docker compose up -d --build

# 4. Wait for database healthcheck
echo "⏳ Waiting for PostgreSQL to initialize..."
docker compose exec -T postgres pg_isready -U lokutsav_user -d lokutsav_db || sleep 5

# 5. Run Prisma database migrations and seeding
echo "🌱 Running Prisma Migrations..."
docker compose exec -T web npx prisma db push --skip-generate || true
docker compose exec -T web node prisma/seed.js || true

echo "✅ Lokutsav is live on http://$(curl -s ifconfig.me):3000"
echo "👑 Jury Room: http://$(curl -s ifconfig.me):3000/judging"
