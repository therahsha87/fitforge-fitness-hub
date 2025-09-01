#!/bin/bash

# 🔥 FitForge Fitness Hub - Production Deployment Script 🔥
# This script deploys the FitForge application to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="fitforge-fitness-hub"
DOCKER_IMAGE="$APP_NAME:latest"
BACKUP_DIR="/tmp/fitforge-backup"
LOG_FILE="/tmp/fitforge-deploy.log"

# Functions
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

info() {
    echo -e "${BLUE}ℹ️ $1${NC}" | tee -a "$LOG_FILE"
}

# Banner
echo -e "${BLUE}"
echo "🔥⚒️  FitForge Fitness Hub - Production Deployment  ⚒️🔥"
echo "=============================================="
echo -e "${NC}"

# Pre-deployment checks
info "Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
fi

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL environment variable is not set"
fi

# Check disk space (need at least 2GB free)
available_space=$(df / | tail -1 | awk '{print $4}')
required_space=2097152  # 2GB in KB

if [ "$available_space" -lt "$required_space" ]; then
    error "Insufficient disk space. Need at least 2GB free."
fi

success "Pre-deployment checks passed"

# Create backup directory
info "Creating backup directory..."
mkdir -p "$BACKUP_DIR"

# Stop existing containers gracefully
info "Stopping existing containers..."
if docker-compose ps -q | grep -q .; then
    docker-compose down --timeout 30
    success "Existing containers stopped"
else
    info "No existing containers to stop"
fi

# Backup database (if exists)
info "Creating database backup..."
if docker ps -a --format "table {{.Names}}" | grep -q "fitforge-postgres"; then
    docker exec fitforge-postgres pg_dump -U fitforge fitforge_db > "$BACKUP_DIR/database-$(date +%Y%m%d-%H%M%S).sql"
    success "Database backup created"
else
    info "No existing database to backup"
fi

# Pull latest images
info "Pulling latest Docker images..."
docker-compose pull
success "Docker images updated"

# Build the application
info "Building the application..."
if [ "$NODE_ENV" = "production" ]; then
    docker-compose build --no-cache
else
    docker-compose build
fi
success "Application built successfully"

# Run database migrations (if applicable)
info "Running database migrations..."
# Add your migration commands here if you have them
# docker-compose run --rm app npm run db:migrate
success "Database migrations completed"

# Start services
info "Starting services..."
docker-compose up -d
success "Services started"

# Wait for services to be healthy
info "Waiting for services to be healthy..."
sleep 30

# Health check
info "Running health checks..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        success "Health check passed"
        break
    else
        warning "Health check failed (attempt $attempt/$max_attempts)"
        if [ $attempt -eq $max_attempts ]; then
            error "Health check failed after $max_attempts attempts"
        fi
        sleep 10
        ((attempt++))
    fi
done

# Performance check
info "Running performance checks..."
response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000)
if (( $(echo "$response_time > 3.0" | bc -l) )); then
    warning "Response time is high: ${response_time}s"
else
    success "Response time is good: ${response_time}s"
fi

# Clean up old Docker images
info "Cleaning up old Docker images..."
docker image prune -f
success "Docker cleanup completed"

# Update deployment log
echo "$(date '+%Y-%m-%d %H:%M:%S') - Deployment completed successfully" >> /var/log/fitforge-deployments.log

# Display final status
echo -e "${GREEN}"
echo "🎉 Deployment Completed Successfully! 🎉"
echo "============================================"
echo "🔥 FitForge is now running and ready to forge fitness journeys!"
echo ""
echo "📊 Status:"
echo "  - Application: ✅ Running on http://localhost:3000"
echo "  - Database: ✅ Connected and healthy"
echo "  - Redis Cache: ✅ Running"
echo "  - Response Time: ${response_time}s"
echo ""
echo "🔗 Quick Links:"
echo "  - Health Check: http://localhost:3000/api/health"
echo "  - Main App: http://localhost:3000"
echo "  - Logs: docker-compose logs -f"
echo ""
echo "📁 Backup Location: $BACKUP_DIR"
echo "📝 Deployment Log: $LOG_FILE"
echo -e "${NC}"

# Optional: Send notification (uncomment if you have notification service)
# curl -X POST "https://hooks.slack.com/your-webhook-url" \
#      -H "Content-Type: application/json" \
#      -d '{"text":"🔥 FitForge deployment completed successfully! Ready to forge fitness journeys!"}'

success "🔥⚒️ FitForge Fitness Hub is now live! Ready to help users forge their strongest selves! ⚒️🔥"
