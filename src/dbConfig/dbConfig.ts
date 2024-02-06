import { loadEnvConfig } from '@next/env/dist';
import mongoose from 'mongoose';

// Load environment variables using Next.js
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export async function connect() {
  try {
    // Check if required environment variables are present
    const requiredVariables = [
      'DBTYPE',
      'DBNAME',
      'MONGO_DOCKER_URI',
      'MONGO_URI',
      'MONGO_ONLINE_URI',
      'DOMAIN',
      'DOCKER',
    ];
    const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

    if (missingVariables.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
    }

    let mongoURI: string;

    switch (process.env.DBTYPE) {
      case 'offline':
        if (process.env.DOCKER === 'true') {
          mongoURI = `${process.env.MONGO_DOCKER_URI!}${process.env.DBNAME!}`;
        } else {
          mongoURI = `${process.env.MONGO_URI!}${process.env.DBNAME!}`;
        }
        // eslint-disable-next-line no-console
        console.log('mongoURI', mongoURI);
        break;
      case 'online':
        mongoURI = `${process.env.MONGO_ONLINE_URI!}${process.env.DBNAME!}`;
        // eslint-disable-next-line no-console
        console.log('mongoURI', 'online');
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
    console.log('Something goes wrong!');
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
}
