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
  trail: boolean;
  mobile: number;
  name: string;
  email: string;
  order: [
    {
      category: {
        catId: mongoose.Types.ObjectId;
        categoryName: string;
      };
      dimension: {
        dimensionTypeName: string;
        dimensionName: string;
        note?: string;
      };
      styleProcess: {
        styleProcessName: string;
        styleName: string;
      };
      work: boolean;
      barcode: boolean;
      measurement: string;
      amount: number;
      status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    },
  ];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partially Paid';
  billBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IReceipt extends Document {
  receiptId: mongoose.Types.ObjectId;
  bill?: mongoose.Types.ObjectId;
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
      category: categorySchema,
      work: Boolean,
      barcode: Boolean,
      measurment: String,
      amount: Number,
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
      },
    },
  ],
  totalAmount: Number,
  paidAmount: Number,
  dueAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partially Paid'],
    default: 'Unpaid',
  },
  billBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  receiptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Receipt',
    required: true,
  },
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
  },
  amount: Number,
  paymentDate: Date,
  paymentMethod: String,
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

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>('Bill', billSchema);

const Receipt: Model<IReceipt> = mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', receiptSchema);

// Export the models
export { Bill, Category, Customer, Receipt };
export type { IBill, ICategory, ICustomer, IReceipt };
