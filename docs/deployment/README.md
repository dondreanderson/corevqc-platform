# COREVQC Deployment Guide

This guide covers deploying COREVQC in various environments from development to production.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 14+
- Redis 6+
- Nginx (for production)

## Environment Setup

### Development Environment

1. **Clone the Repository**
```bash
git clone <repository-url>
cd corevqc
```

2. **Run Setup Script**
```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

3. **Start Development Servers**
```bash
npm run dev
```

### Staging Environment

1. **Environment Variables**
Create `.env.staging` file:
```env
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db:5432/corevqc_staging
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=staging-jwt-secret
FRONTEND_URL=https://staging.corevqc.com
```

2. **Deploy with Docker Compose**
```bash
docker-compose -f docker-compose.staging.yml up -d
```

3. **Run Migrations**
```bash
docker-compose exec backend npm run db:migrate
```

### Production Environment

## Docker Deployment

### Using Docker Compose

1. **Production Environment File**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/corevqc_prod
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=https://corevqc.com
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=corevqc-files
SENDGRID_API_KEY=your-sendgrid-key
```

2. **Deploy**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **SSL Setup with Let's Encrypt**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d corevqc.com -d www.corevqc.com
```

## AWS Deployment

### Using Terraform

1. **Initialize Terraform**
```bash
cd infrastructure/terraform
terraform init
```

2. **Plan Deployment**
```bash
terraform plan -var="environment=production"
```

3. **Apply Infrastructure**
```bash
terraform apply -var="environment=production"
```

### ECS Deployment

1. **Build and Push Images**
```bash
# Backend
docker build -t corevqc-backend:latest ./backend
docker tag corevqc-backend:latest your-registry/corevqc-backend:latest
docker push your-registry/corevqc-backend:latest

# Frontend
docker build -t corevqc-frontend:latest ./frontend
docker tag corevqc-frontend:latest your-registry/corevqc-frontend:latest
docker push your-registry/corevqc-frontend:latest
```

2. **Update ECS Service**
```bash
aws ecs update-service --cluster corevqc-cluster --service corevqc-backend --force-new-deployment
aws ecs update-service --cluster corevqc-cluster --service corevqc-frontend --force-new-deployment
```

## Database Management

### Migrations

```bash
# Run migrations
npm run db:migrate

# Rollback migration
npm run db:rollback

# Reset database (development only)
npm run db:reset
```

### Backups

```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_file.sql
```

## Monitoring and Logging

### Application Logs

Logs are stored in the `logs/` directory:
- `error.log`: Error messages
- `combined.log`: All log messages

### Health Checks

- **Backend**: `GET /health`
- **Database**: Connection pooling with health checks
- **Redis**: Built-in health monitoring

### Performance Monitoring

1. **Application Metrics**
```bash
# CPU and Memory usage
docker stats

# Container logs
docker logs corevqc-backend
docker logs corevqc-frontend
```

2. **Database Performance**
```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## Security Considerations

### SSL/TLS

- Use HTTPS in production
- Implement HSTS headers
- Use secure cookies

### Environment Variables

- Never commit secrets to repository
- Use environment-specific `.env` files
- Rotate secrets regularly

### Database Security

- Use strong passwords
- Enable SSL connections
- Regular security updates
- Backup encryption

### Application Security

- Rate limiting enabled
- Input validation
- SQL injection protection
- XSS protection headers

## Scaling

### Horizontal Scaling

1. **Load Balancer Configuration**
```nginx
upstream backend {
    server backend-1:3001;
    server backend-2:3001;
    server backend-3:3001;
}
```

2. **Database Connection Pooling**
```javascript
// Pool configuration for high traffic
pool: {
  min: 5,
  max: 50,
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 100
}
```

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database performance
- Redis memory allocation

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
```bash
# Check database status
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

2. **Memory Issues**
```bash
# Monitor memory usage
docker stats --no-stream

# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

3. **SSL Certificate Issues**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect corevqc.com:443
```

### Log Analysis

```bash
# Search for errors
grep -i error logs/combined.log

# Monitor real-time logs
tail -f logs/combined.log

# Analyze access patterns
awk '{print $1}' access.log | sort | uniq -c | sort -nr
```

## Backup and Recovery

### Automated Backups

1. **Database Backup Script**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL | gzip > /backups/db_$DATE.sql.gz
find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

2. **File Backup**
```bash
# Backup uploaded files
aws s3 sync s3://corevqc-files s3://corevqc-backups/files/$(date +%Y%m%d)/
```

### Disaster Recovery

1. **Recovery Plan**
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 1 hour
- Backup verification: Daily

2. **Recovery Steps**
```bash
# 1. Restore database
psql $DATABASE_URL < latest_backup.sql

# 2. Restore files
aws s3 sync s3://corevqc-backups/files/latest/ s3://corevqc-files/

# 3. Restart services
docker-compose restart
```

## Maintenance

### Regular Tasks

- **Daily**: Monitor logs and performance
- **Weekly**: Review security updates
- **Monthly**: Database maintenance and optimization
- **Quarterly**: Security audit and penetration testing

### Updates

1. **Application Updates**
```bash
# Pull latest code
git pull origin main

# Build and deploy
docker-compose build
docker-compose up -d
```

2. **Dependency Updates**
```bash
# Update Node.js dependencies
npm audit fix
npm update

# Update Docker images
docker-compose pull
```

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Contact the development team
4. Create an issue in the repository

---

**Note**: Always test deployments in staging environment before production deployment.
