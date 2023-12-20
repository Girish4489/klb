import mongoose from 'mongoose';

export async function connect() {
  try {
    let mongoURI;

    console.log('process.env.DOCKER', process.env.DOCKER!);
    if (process.env.DOCKER! === 'true' && process.env.DBTYPE === 'offline') {
      // Use the service name 'db' as the host
      mongoURI = `${process.env.MONGO_URI!}${process.env.DBNAME!}`;
    } else {
      mongoURI = `${process.env.MONGO_URI!}${process.env.DBNAME!}`;
    }

    await mongoose.connect(mongoURI);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    connection.on('error', err => {
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
      process.exit();
    });
  } catch (error) {
    console.log('Something goes wrong!');
    console.log(error);
  }
}
