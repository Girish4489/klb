import { loadEnvConfig } from '@next/env';
import handleError from '@utils/error/handleError';
import mongoose from 'mongoose';

// Load environment variables using Next.js
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config = {
  dbType: process.env.DBTYPE,
  dbName: process.env.DBNAME,
  mongoUri: process.env.MONGO_URI,
  mongoOnlineUri: process.env.MONGO_ONLINE_URI,
  domain: process.env.DOMAIN,
};

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

async function connectWithRetry(mongoURI: string, retries: number = MAX_RETRIES): Promise<void> {
  try {
    await mongoose.connect(mongoURI);
    const connection = mongoose.connection as mongoose.Connection;

    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {
      console.error('MongoDB connection error. Please make sure MongoDB is running. ' + err);
      process.exit();
    });
  } catch (error) {
    if (retries > 0) {
      console.error(
        `MongoDB connection failed. Retrying in ${RETRY_DELAY / 1000} seconds... (${retries} retries left)`,
      );
      setTimeout(() => connectWithRetry(mongoURI, retries - 1), RETRY_DELAY);
    } else {
      handleError.log(error);
      throw new Error('Could not connect to MongoDB after multiple attempts.');
    }
  }
}

export async function connect(): Promise<void> {
  try {
    // Check if required environment variables are present
    const requiredVariables = ['dbType', 'dbName', 'mongoUri', 'mongoOnlineUri', 'domain'];
    const missingVariables = requiredVariables.filter((variable) => !config[variable as keyof typeof config]);

    if (missingVariables.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
    }

    let mongoURI: string;

    switch (config.dbType) {
      case 'offline':
        mongoURI = `${config.mongoUri}${config.dbName}`;
        break;
      case 'online':
        mongoURI = `${config.mongoOnlineUri}${config.dbName}`;
        break;
      default:
        throw new Error('Invalid DB type');
    }

    await connectWithRetry(mongoURI);
  } catch (error) {
    handleError.log(error);
    throw error;
  }
}
