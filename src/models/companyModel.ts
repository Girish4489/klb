import mongoose, { Document, Model, Schema, Types } from 'mongoose';

type ObjectId = Types.ObjectId;

interface ICompany extends Document {
  _id: ObjectId;
  name: string;
  gstNumber: string;
  contactDetails: {
    phones: string[];
    emails: string[];
    address: string;
  };
  logos: {
    small: string;
    medium: string;
    large: string;
  };
  users: {
    userId: ObjectId;
    companyId: ObjectId;
    role: 'owner' | 'admin' | 'hr' | 'manager' | 'stockManager' | 'cashier' | 'salesAssociate' | 'employee' | 'intern';
    email: string;
    mobile: string;
    access: {
      login: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const companySchema: Schema<ICompany> = new mongoose.Schema({
  name: { type: String, required: true },
  gstNumber: { type: String },
  contactDetails: {
    phones: [{ type: String, required: true }],
    emails: [{ type: String, required: true }],
    address: { type: String, required: true },
  },
  logos: {
    small: { type: String },
    medium: { type: String },
    large: { type: String },
  },
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
      role: {
        type: String,
        enum: ['owner', 'admin', 'hr', 'manager', 'stockManager', 'cashier', 'salesAssociate', 'employee', 'intern'],
        default: 'employee',
      },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      access: {
        login: { type: Boolean, default: true },
        canEdit: { type: Boolean, default: false },
        canDelete: { type: Boolean, default: false },
        canView: { type: Boolean, default: true },
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company;
export type { ICompany, ObjectId };
