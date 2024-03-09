import mongoose, { Document, Model, Schema } from 'mongoose';

// Interfaces
interface ICustomer extends Document {
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
  taxName: string;
  taxType: string;
  taxPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ICategory extends Document {
  categoryName?: string;
  description?: string;
  styleProcess?: [
    {
      styleProcessName: string;
      styles: {
        styleName: string;
      };
    },
  ];
  dimension?: [
    {
      dimensionTypeName: string;
      dimensionTypes: {
        dimensionName: string;
      };
      note?: string;
    },
  ];
}

interface IBill extends Document {
  billNumber: number;
  date?: Date;
  dueDate?: Date;
  urgent?: boolean;
  trail?: boolean;
  mobile?: number;
  name?: string;
  email?: string;
  order: {
    _id?: mongoose.Types.ObjectId;
    category?: {
      catId?: { tyepe: mongoose.Types.ObjectId; ref: 'Category' };
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
    amount?: number;
    status?: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  }[];
  totalAmount: number;
  discount: number;
  tax: {
    _id: { type: mongoose.Types.ObjectId; ref: 'Tax' };
    taxName: string;
    taxType: string;
    taxPercentage: number;
  }[];
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus?: 'Unpaid' | 'Partially Paid' | 'Paid';
  billBy?: { _id: mongoose.Types.ObjectId; name: string };
  createdAt: Date;
  updatedAt: Date;
}

interface IReceipt extends Document {
  receiptNumber: number;
  bill?: { _id: mongoose.Types.ObjectId; billNumber?: number; mobile?: number; name?: string };
  receiptBy?: { _id: mongoose.Types.ObjectId; name: string };
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Customer Data
const customerSchema: Schema<ICustomer> = new Schema<ICustomer>({
  name: {
    type: String,
    default: 'NA',
    required: [true, 'Name is required.'],
  },
  phone: {
    type: Number,
    required: [true, 'Phone number is required.'],
    unique: true,
  },
  email: String,
  city: String,
  state: String,
  country: String,
  pin: String,
  address: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for Tax Data
const taxSchema: Schema<ITax> = new Schema<ITax>({
  taxName: {
    type: String,
    required: [true, 'Tax name is required.'],
    unique: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for Category
const categorySchema: Schema<ICategory> = new Schema<ICategory>({
  categoryName: {
    type: String,
    required: [true, 'Category name is required.'],
    unique: true,
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
  dimension: [
    {
      dimensionTypeName: {
        type: String,
        required: [true, 'Dimension type name is required.'],
      },
      dimensionTypes: [
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
});

// Schema for Bill
const billSchema: Schema<IBill> = new Schema<IBill>({
  billNumber: {
    type: Number,
    required: [true, 'Bill number is required.'],
    unique: true,
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
      amount: Number,
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
      },
    },
  ],
  totalAmount: Number,
  discount: {
    type: Number,
    default: 0,
  },
  tax: [
    {
      taxName: String,
      taxType: String,
      taxPercentage: Number,
    },
  ],
  grandTotal: {
    type: Number,
    default: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  dueAmount: {
    type: Number,
    default: function () {
      return (isNaN(this.totalAmount) ? 0 : this.totalAmount) - (isNaN(this.paidAmount) ? 0 : this.paidAmount);
    },
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partially Paid'],
    default: 'Unpaid',
  },
  billBy: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for Receipts
const receiptSchema: Schema<IReceipt> = new Schema<IReceipt>({
  receiptNumber: {
    type: Number,
    required: [true, 'Receipt number is required.'],
    unique: true,
  },
  bill: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
    billNumber: Number,
    name: String,
    mobile: Number,
  },
  amount: { type: Number, required: [true, 'Amount is required.'] },
  paymentDate: Date,
  paymentMethod: { type: String, enum: ['Cash', 'Online', 'UPI', 'Card'], default: 'Cash' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models from the schemas
const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);

const Tax: Model<ITax> = mongoose.models.Tax || mongoose.model<ITax>('Tax', taxSchema);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>('Bill', billSchema);

const Receipt: Model<IReceipt> = mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', receiptSchema);

// Export the models
export { Bill, Category, Customer, Receipt, Tax };
export type { IBill, ICategory, ICustomer, IReceipt, ITax };
