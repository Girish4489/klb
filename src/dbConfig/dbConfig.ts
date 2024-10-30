import { loadEnvConfig } from '@next/env/dist';
import mongoose from 'mongoose';

// Load environment variables using Next.js
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export async function connect() {
  try {
    // Check if required environment variables are present
    const requiredVariables = ['DBTYPE', 'DBNAME', 'MONGO_URI', 'MONGO_ONLINE_URI', 'DOMAIN'];
    const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

    if (missingVariables.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
    }

    let mongoURI: string;

    switch (process.env.DBTYPE) {
      case 'offline':
        mongoURI = `${process.env.MONGO_URI!}${process.env.DBNAME!}`;
        break;
      case 'online':
        mongoURI = `${process.env.MONGO_ONLINE_URI!}${process.env.DBNAME!}`;
        break;
      default:
        throw new Error('Invalid DB type');
    }

    await mongoose.connect(mongoURI);
    const connection = mongoose.connection as mongoose.Connection;

    connection.on('connected', () => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
      process.exit();
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Something goes wrong!' + error);
    throw error;
  }
}
