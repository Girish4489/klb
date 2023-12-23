import mongoose from 'mongoose';

export async function connect() {
  try {
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
    const connection = mongoose.connection;

    connection.on('connected', () => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected successfully');
    });

    connection.on('error', err => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
      process.exit();
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Something goes wrong!');
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
