import mongoose from 'mongoose';

export async function connect() {
  try {
    let mongoURI;

    console.log('process.env.DOCKER', process.env.DOCKER!);
    if (process.env.DOCKER! === 'true') {
      // Use the service name 'db' as the host
      mongoURI = 'mongodb://db:27017/';
    } else {
      mongoURI = process.env.MONGO_URI! || `${process.env.MONGO_URI!}${process.env.DOCKER_DATABASE!}`;
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
