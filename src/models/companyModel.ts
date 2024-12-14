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
    email: string;
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
      email: { type: String, required: true, index: 'text' },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company;
export type { ICompany, ObjectId };
