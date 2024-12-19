import mongoose, { Document, Model, Schema, Types } from 'mongoose';

type ObjectId = Types.ObjectId;

// Interfaces
interface ICustomer extends Document {
  _id: ObjectId;
  name: string;
  phone: number;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  pin?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ITax extends Document {
  _id: ObjectId;
  taxName: string;
  taxType: string;
  taxPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ICategory extends Document {
  _id: ObjectId;
  categoryName?: string;
  description?: string;
  styleProcess?: IStyleProcess[];
  dimensionTypes?: IDimensionTypes[];
}

interface IStyleProcess {
  _id: ObjectId;
  styleProcessName: string;
  styles: IStyle[];
}

interface IStyle {
  _id: ObjectId;
  styleName: string;
}

interface IDimensionTypes {
  _id: ObjectId;
  dimensionTypeName: string;
  dimensions: IDimensions[];
  note?: string;
}

interface IDimensions {
  _id: ObjectId;
  dimensionName: string;
}

interface IColor {
  type: 'Custom' | 'Selected' | 'Basic';
  name: string;
  hex: string;
}

interface IBill extends Document {
  _id: ObjectId;
  billNumber: number;
  date?: Date;
  dueDate?: Date;
  urgent?: boolean;
  trail?: boolean;
  mobile?: number;
  name?: string;
  email?: string;
  order: {
    _id?: ObjectId;
    category?: {
      catId?: ObjectId;
      categoryName?: string;
    };
    dimension: {
      dimensionTypeName: string;
      dimensionName: string;
      note: string;
    }[];
    styleProcess: {
      styleProcessName: string;
      styleName: string;
    }[];
    work?: boolean;
    barcode?: boolean;
    measurement?: string;
    orderNotes?: string;
    amount?: number;
    color?: IColor;
    status?: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  }[];
  totalAmount: number; // total without discount & tax
  paymentStatus?: 'Unpaid' | 'Partially Paid' | 'Paid';
  billBy?: { _id: ObjectId; name: string };
  deliveryStatus?: 'Pending' | 'Delivered';
  createdAt: Date;
  updatedAt: Date;
}

interface IReceiptTax {
  _id: ObjectId;
  taxName: string;
  taxType: 'Percentage' | 'Fixed';
  taxPercentage: number;
}

interface IReceipt extends Document {
  _id: ObjectId;
  receiptNumber: number;
  bill?: { _id: ObjectId; billNumber?: number; mobile?: number; name?: string };
  receiptBy?: { _id: ObjectId; name: string };
  amount: number; // current amount paid/paying
  discount: number;
  tax: IReceiptTax[];
  taxAmount: number;
  paymentDate: Date;
  paymentMethod?: string;
  paymentType: 'advance' | 'fullyPaid'; // Updated field
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Customer Data model.
const customerSchema: Schema<ICustomer> = new Schema<ICustomer>(
  {
    name: {
      type: String,
      default: 'NA',
      required: [true, 'Name is required.'],
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, 'Phone number is required.'],
      unique: true,
      trim: true,
      index: true, // Define index here instead of using Schema.index()
    },
    email: String,
    city: String,
    state: String,
    country: String,
    pin: String,
    address: String,
    notes: String,
  },
  { timestamps: true },
);

// Schema for Tax Data model.
const taxSchema: Schema<ITax> = new Schema<ITax>(
  {
    taxName: {
      type: String,
      required: [true, 'Tax name is required.'],
      unique: true,
      index: true, // Define index here instead of using Schema.index()
    },
    taxType: {
      type: String,
      enum: ['Percentage', 'Fixed'],
      default: 'Percentage',
    },
    taxPercentage: {
      type: Number,
      required: [true, 'Tax percentage is required.'],
    },
  },
  { timestamps: true },
);

// Schema for Category model.
const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required.'],
      unique: true,
      index: true, // Define index here instead of using Schema.index()
    },
    description: String,
    styleProcess: [
      {
        styleProcessName: {
          type: String,
          required: [true, 'Style Process name is required.'],
        },
        styles: [
          {
            styleName: {
              type: String,
              required: [true, 'Style name is required.'],
            },
          },
        ],
      },
    ],
    dimensionTypes: [
      {
        dimensionTypeName: {
          type: String,
          required: [true, 'Dimension type name is required.'],
        },
        dimensions: [
          {
            dimensionName: {
              type: String,
              required: [true, 'Dimension name is required.'],
            },
            note: String,
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

// Schema for Bill model.
const billSchema: Schema<IBill> = new Schema<IBill>(
  {
    billNumber: {
      type: Number,
      required: [true, 'Bill number is required.'],
      unique: true,
      index: true, // Define index here instead of using Schema.index()
    },
    date: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    trail: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: Number,
    },
    name: String,
    email: String,
    order: [
      {
        category: {
          catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
          categoryName: { type: String, default: '' },
        },
        dimension: [
          {
            dimensionTypeName: { type: String, default: '' },
            dimensionName: { type: String, default: '' },
            note: { type: String, default: '' },
          },
        ],
        styleProcess: [
          {
            styleProcessName: { type: String, default: '' },
            styleName: { type: String, default: '' },
          },
        ],
        work: Boolean,
        barcode: Boolean,
        measurement: String,
        orderNotes: String,
        amount: { type: Number, required: [true, 'Amount is required.'] },
        color: {
          type: {
            type: String,
            enum: ['Custom', 'Selected', 'Basic'],
            default: 'Selected',
          },
          name: { type: String, required: true },
          hex: { type: String, required: true },
        },
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
          default: 'Pending',
        },
      },
    ],
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Partially Paid'],
      default: 'Unpaid',
    },
    billBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
    },
    deliveryStatus: {
      type: String,
      enum: ['Pending', 'Delivered'],
      default: 'Pending',
    },
  },
  { timestamps: true },
);

// Schema for Receipts model.
const receiptSchema: Schema<IReceipt> = new Schema<IReceipt>(
  {
    receiptNumber: {
      type: Number,
      required: [true, 'Receipt number is required.'],
      unique: true,
      index: true, // Define index here instead of using Schema.index()
    },
    bill: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
      billNumber: {
        type: Number,
        required: [true, 'Bill number is required.'],
        index: true, // Define index here
      },
      name: String,
      mobile: { type: Number, index: 'asc' },
    },
    receiptBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
    },
    amount: { type: Number, required: [true, 'Amount is required.'] },
    discount: {
      type: Number,
      default: 0,
    },
    tax: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax' },
        taxName: String,
        taxType: { type: String, enum: ['Percentage', 'Fixed'] },
        taxPercentage: Number,
      },
    ],
    taxAmount: {
      type: Number,
      default: 0,
    },
    paymentDate: Date,
    paymentMethod: { type: String, enum: ['Cash', 'Online', 'UPI', 'Card'], default: 'Cash' },
    paymentType: {
      type: String,
      enum: ['advance', 'fullyPaid'],
      default: 'advance',
    },
  },
  { timestamps: true },
);

// Create models from the schemas
const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);

const Tax: Model<ITax> = mongoose.models.Tax || mongoose.model<ITax>('Tax', taxSchema);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>('Bill', billSchema);

const Receipt: Model<IReceipt> = mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', receiptSchema);

// Export the models
export { Bill, Category, Customer, Receipt, Tax };
export type {
  IBill,
  ICategory,
  IColor,
  ICustomer,
  IDimensionTypes,
  IDimensions,
  IReceipt,
  IReceiptTax,
  IStyle,
  IStyleProcess,
  ITax,
  ObjectId,
};
