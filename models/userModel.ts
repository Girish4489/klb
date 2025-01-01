import constants from '@constants/constants';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

type ObjectId = Types.ObjectId;

type RoleType =
  | 'owner'
  | 'admin'
  | 'hr'
  | 'manager'
  | 'stockManager'
  | 'cashier'
  | 'salesAssociate'
  | 'employee'
  | 'intern'
  | 'guest';

interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  mobile?: string[];
  isVerified: boolean;
  isAdmin: boolean;
  profileImage?: {
    __filename: string;
    data: string;
    contentType: string;
    size: number;
    uploadAt: Date;
  };
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
  verifyToken: string;
  verifyTokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  preferences?: {
    theme: string;
    fonts: {
      name: string;
      weight: number;
    };
    animations: {
      enabled: boolean;
      intensity: number; // 1-10 scale
    };
    toast: {
      position: {
        vertical: 'top' | 'bottom';
        horizontal: 'start' | 'center' | 'end';
      };
      duration: number;
    };
  };
  notifications: INotification[];
  isCompanyMember: boolean; // Changed from newUser
  companyAccess?: {
    companyId: ObjectId;
    role: RoleType;
    access: {
      login: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
    };
    accessLevels: RoleType[];
  };
  secondaryEmails: string[];
}

interface INotification {
  name: string;
  message: string;
  timeOfArrival: Date;
  timeOfRead?: Date;
  isRead: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
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
    mobile: {
      type: [String],
      default: [],
      // required: [true, 'Please provide a mobile number'],
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
      data: { type: String, default: '' },
      contentType: {
        type: String,
        enum: [...constants.ALLOWED_IMAGE_TYPES, ''], // Allow empty string
        default: '',
      },
      size: {
        type: Number,
        max: constants.MAX_COMPANY_LOGO_FILE_SIZE_MB * 1024 * 1024,
        default: 0,
      },
      uploadAt: { type: Date, default: Date.now },
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
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      fonts: {
        name: { type: String, required: true, default: 'Roboto' },
        weight: { type: Number, required: true, default: 400 },
      },
      theme: {
        type: String,
        default: 'dark',
      },
      animations: {
        enabled: { type: Boolean, default: true },
        intensity: { type: Number, default: 10, min: 1, max: 10 },
      },
      toast: {
        position: {
          vertical: { type: String, enum: ['top', 'bottom'], default: 'top' },
          horizontal: { type: String, enum: ['start', 'center', 'end'], default: 'center' },
        },
        duration: { type: Number, default: 4000, min: 1000, max: 10000 },
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
    isCompanyMember: {
      // Changed from newUser
      type: Boolean,
      default: false, // Default to false since new users don't belong to any company
    },
    companyAccess: {
      type: {
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        role: {
          type: String,
          enum: [
            'owner',
            'admin',
            'hr',
            'manager',
            'stockManager',
            'cashier',
            'salesAssociate',
            'employee',
            'intern',
            'guest',
          ],
          default: 'guest',
        },
        access: {
          login: { type: Boolean, default: true },
          canEdit: { type: Boolean, default: false },
          canDelete: { type: Boolean, default: false },
          canView: { type: Boolean, default: true },
        },
        accessLevels: { type: [String], default: ['guest'] },
      },
      required: false,
    },
    secondaryEmails: {
      type: [String],
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// model from the schema
const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>('users', userSchema);

export default User;
export type { INotification, IUser, ObjectId, RoleType };
