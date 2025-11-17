# Building Management System

A NestJS-based REST API for managing publishers and their associated websites. This application provides CRUD operations for publishers and websites with Redis caching, MySQL database, and comprehensive validation.

## Features

- **Publisher Management**: Create, read, update, and delete publishers
- **Website Management**: Manage websites associated with publishers
- **Relationship Management**: One-to-many relationship between publishers and websites
- **Redis Caching**: Built-in caching with Redis for improved performance
- **Data Validation**: Request validation using class-validator and class-transformer
- **TypeORM Integration**: Database operations with TypeORM and MySQL
- **Docker Support**: Easy setup with Docker Compose for MySQL and Redis

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (v11)
- **Language**: TypeScript
- **Database**: MySQL 8
- **ORM**: TypeORM
- **Cache**: Redis 7 with cache-manager
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for database and Redis)
- MySQL 8 (if not using Docker)
- Redis 7 (if not using Docker)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd building-management
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the provided variables based on .env.example:

4. Start MySQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Mode

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## API Endpoints

### Publishers

- `GET /publisher` - Get all publishers
  - Query parameter: `includeWebsites` (boolean) - Include associated websites
- `GET /publisher/:id` - Get a specific publisher by ID
- `POST /publisher` - Create or update a publisher (upsert)
- `DELETE /publisher/:id` - Delete a publisher

### Websites

- `GET /website` - Get all websites
- `GET /website/:id` - Get a specific website by ID
- `GET /website/:publisherId/publisher` - Get all websites for a specific publisher
- `POST /website` - Create or update a website (upsert)
- `DELETE /website/:id` - Delete a website

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── cache/                  # Cache interceptors
│   ├── publisher.cache.interceptor.ts
│   └── website.cache.interceptor.ts
├── constants/              # Application constants
│   └── cache.consts.ts
├── modules/
│   ├── publisher/          # Publisher module
│   │   ├── dto/
│   │   │   └── create-publisher.dto.ts
│   │   ├── publisher.controller.ts
│   │   ├── publisher.entity.ts
│   │   ├── publisher.module.ts
│   │   └── publisher.service.ts
│   └── website/            # Website module
│       ├── dto/
│       │   └── create-website.dto.ts
│       ├── website.controller.ts
│       ├── website.entity.ts
│       ├── website.module.ts
│       └── website.service.ts
└── types/                  # Type definitions
    ├── publisher/
    └── website/
```

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

### Watch Mode

```bash
npm run test:watch
```

## Docker Setup

The project includes a `docker-compose.yml` file that sets up:

- **MySQL 8**: Database server on port 3306
- **Redis 7**: Cache server on port 6379

To start the services:

```bash
docker-compose up -d
```

To stop the services:

```bash
docker-compose down
```

## Database Schema

### Publisher Entity

- `id` (Primary Key, Auto-generated)
- `name` (Unique, Required)
- `email` (Required)
- `contact_name` (Required)
- `created_at` (Auto-generated)
- `updated_at` (Auto-generated)
- `websites` (One-to-Many relationship with Website)

### Website Entity

- `id` (Primary Key, Auto-generated)
- `publisher_id` (Foreign Key, Required)
- `name` (Required)
- `created_at` (Auto-generated)
- `updated_at` (Auto-generated)
- `publisher` (Many-to-One relationship with Publisher)

## Caching

The application uses Redis for caching with custom interceptors:

- **PublisherCacheInterceptor**: Caches publisher-related queries
- **WebsiteCacheInterceptor**: Caches website-related queries

Cache TTL is set to 30 seconds (30,000ms) by default.

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Development

### Building

```bash
npm run build
```

The compiled JavaScript files will be in the `dist/` directory.

## Environment Variables

| Variable     | Description         | Default     |
| ------------ | ------------------- | ----------- |
| `DB_HOST`    | MySQL host          | `localhost` |
| `DB_PORT`    | MySQL port          | `3306`      |
| `DB_USER`    | MySQL username      | -           |
| `DB_PASS`    | MySQL password      | -           |
| `DB_NAME`    | MySQL database name | -           |
| `REDIS_HOST` | Redis host          | `localhost` |
| `REDIS_PORT` | Redis port          | `6379`      |
| `PORT`       | Application port    | `3000`      |

## License

This project is [UNLICENSED](LICENSE).

## Support

For questions and support, please open an issue in the repository.
