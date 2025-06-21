import knex from 'knex';
import { logger } from '../utils/logger';

const environment = process.env.NODE_ENV || 'development';

export const config = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'corevqc_dev',
      user: process.env.DB_USER || 'corevqc_user',
      password: process.env.DB_PASSWORD || 'password',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

export const db = knex(config[environment as keyof typeof config]);

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info('✅ Database connected successfully');
  })
  .catch((err) => {
    logger.error('❌ Database connection failed:', err);
    process.exit(1);
  });
