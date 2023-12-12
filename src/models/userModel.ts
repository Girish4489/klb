import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
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
  theme: {
    type: String,
    default: 'dark',
  },
  profileImage: {
    __filename: String, // Store image filename
    data: Buffer, // Store image data as Buffer
    contentType: { type: String, default: 'multipart/form-data' }, // Store image content type (e.g., "image/jpeg")
    uploadAt: Date, // Store image upload time
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
