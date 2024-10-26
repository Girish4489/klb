import mongoose, { Document, Model, Schema, Types } from 'mongoose';

type ObjectId = Types.ObjectId;

interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  profileImage: {
    __filename: string;
    data: string;
    contentType: string;
    uploadAt: Date;
  };
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
  verifyToken: string;
  verifyTokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  preferences: {
    theme: string;
    fonts: {
      name: string;
      weight: number;
    };
  };
  notifications: {
    name: string;
    message: string;
    timeOfArrival: Date;
    timeOfRead: Date;
    isRead: boolean;
  }[];
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  profileImage: {
    __filename: { type: String, default: 'USER_PROFILE_404_ERROR' },
    data: String,
    contentType: { type: String, default: 'multipart/form-data' },
    uploadAt: Date,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  preferences: {
    fonts: {
      name: { type: String, required: true },
      weight: { type: Number, required: true },
    },
    theme: {
      type: String,
      default: 'dark',
    },
  },
  notifications: [
    {
      name: { type: String, required: true },
      message: { type: String, required: true },
      timeOfArrival: { type: Date, required: true },
      timeOfRead: Date,
      isRead: { type: Boolean, default: false },
    },
  ],
});

// model from the schema
const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>('users', userSchema);

export default User;
export type { IUser, ObjectId };
