# Contributing to COREVQC

Thank you for your interest in contributing to COREVQC! This document provides guidelines and information for contributors.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/corevqc.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Set up the development environment (see README.md)

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Write clear comments for complex logic
- Maintain consistent formatting using Prettier

### Testing
- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Aim for high test coverage (>80%)

### Commit Messages
Use conventional commit format:
```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
test: add unit tests for user service
```

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all checks pass
4. Request review from maintainers
5. Address feedback promptly

## Project Structure

- `backend/` - Node.js/Express API
- `frontend/` - React web application
- `mobile/` - React Native mobile app
- `infrastructure/` - DevOps and deployment configs
- `docs/` - Project documentation

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## Questions?

Feel free to open an issue for questions or join our Discord community.
