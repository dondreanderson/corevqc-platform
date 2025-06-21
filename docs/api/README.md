# COREVQC API Documentation

## Overview

The COREVQC API is a RESTful API that provides access to all platform functionality. It's built with Node.js and Express, using PostgreSQL as the primary database.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Staging**: `https://staging.corevqc.com/api`
- **Production**: `https://api.corevqc.com/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid access token in the Authorization header.

```
Authorization: Bearer <access_token>
```

### Token Refresh

Access tokens expire after 24 hours. Use the refresh token to obtain a new access token:

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/profile` | Get current user profile |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users (admin/manager only) |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user (admin only) |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| GET | `/projects/:id` | Get project by ID |
| POST | `/projects` | Create new project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

### Quality Control

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quality/inspections` | Get all inspections |
| GET | `/quality/inspections/:id` | Get inspection by ID |
| POST | `/quality/inspections` | Create new inspection |
| PUT | `/quality/inspections/:id` | Update inspection |
| PATCH | `/quality/inspections/:id/complete` | Complete inspection |
| GET | `/quality/ncrs` | Get all NCRs |
| POST | `/quality/ncrs` | Create new NCR |
| PATCH | `/quality/ncrs/:id/status` | Update NCR status |

### File Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/uploads/single` | Upload single file |
| POST | `/uploads/multiple` | Upload multiple files |

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers

## Pagination

List endpoints support pagination:

```http
GET /api/projects?page=1&limit=20&sort=createdAt&order=desc
```

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Error Handling

The API provides detailed error messages for debugging:

### Validation Errors

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Database Errors

```json
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "details": "Project with ID 123 not found"
  }
}
```

## Examples

### User Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "inspector"
  }'
```

### Create Project

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "New Construction Project",
    "description": "Office building construction",
    "startDate": "2024-01-15",
    "endDate": "2024-12-31",
    "clientName": "ABC Construction",
    "budget": 1000000
  }'
```

### Create Inspection

```bash
curl -X POST http://localhost:3001/api/quality/inspections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "projectId": "project-uuid",
    "type": "quality",
    "title": "Foundation Inspection",
    "description": "Concrete foundation quality check",
    "location": "Building A - Foundation",
    "dueDate": "2024-02-01T10:00:00Z",
    "checklist": [
      {
        "item": "Concrete strength test",
        "status": "pass",
        "required": true
      },
      {
        "item": "Reinforcement placement",
        "status": "pass",
        "required": true
      }
    ]
  }'
```

## SDKs and Libraries

- **JavaScript/TypeScript**: Use Axios or Fetch API
- **cURL**: Command-line testing
- **Postman**: Collection available for import

## Changelog

- **v1.0.0**: Initial API release
- **v1.1.0**: Added NCR management endpoints
- **v1.2.0**: Enhanced file upload capabilities

For more detailed API specifications, see the [OpenAPI documentation](./openapi.yaml).
