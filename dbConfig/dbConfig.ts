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

let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

// Add cleanup handler at module level
process.on('SIGINT', async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Only close if connected
      await mongoose.connection.close();
      // eslint-disable-next-line no-console
      console.log('MongoDB connection closed through app termination');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB cleanup:', err);
    process.exit(1);
  }
});

async function connectWithRetry(mongoURI: string, retries: number = MAX_RETRIES): Promise<void | null> {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  if (isConnecting) {
    return connectionPromise; // Return existing connection promise if connecting
  }

  try {
    isConnecting = true;
    // Set higher max listeners limit
    mongoose.connection.setMaxListeners(15);

    // Remove existing listeners before adding new ones
    mongoose.connection.removeAllListeners();

    connectionPromise = mongoose.connect(mongoURI).then(() => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected successfully');
    });

    await connectionPromise;
  } catch (error) {
    if (retries > 0) {
      console.error(
        `MongoDB connection failed. Retrying in ${RETRY_DELAY / 1000} seconds... (${retries} retries left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(mongoURI, retries - 1);
    } else {
      handleError.log(error);
      throw new Error('Could not connect to MongoDB after multiple attempts.');
    }
  } finally {
    isConnecting = false;
    connectionPromise = null;
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
