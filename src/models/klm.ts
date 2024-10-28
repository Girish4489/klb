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
  type: 'Custom' | 'Selected';
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
  totalAmount: number;
  discount: number;
  tax: {
    _id: ObjectId;
    taxName: string;
    taxType: string;
    taxPercentage: number;
  }[];
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus?: 'Unpaid' | 'Partially Paid' | 'Paid';
  billBy?: { _id: ObjectId; name: string };
  createdAt: Date;
  updatedAt: Date;
}

interface IReceipt extends Document {
  _id: ObjectId;
  receiptNumber: number;
  bill?: { _id: ObjectId; billNumber?: number; mobile?: number; name?: string };
  receiptBy?: { _id: ObjectId; name: string };
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Customer Data
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

// Schema for Tax Data
const taxSchema: Schema<ITax> = new Schema<ITax>(
  {
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
  },
  { timestamps: true },
);

// Schema for Category
const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
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

// Schema for Bill
/**
 * Schema definition for the Bill model.
 *
 * @typedef {Object} IBill
 * @property {number} billNumber - Unique identifier for the bill. Required.
 * @property {Date} date - Date when the bill was created. Defaults to current date.
 * @property {Date} dueDate - Due date for the bill. Defaults to current date.
 * @property {boolean} urgent - Indicates if the bill is urgent. Defaults to false.
 * @property {boolean} trail - Indicates if the bill is a trail. Defaults to false.
 * @property {number} mobile - Mobile number associated with the bill.
 * @property {string} name - Name associated with the bill.
 * @property {string} email - Email associated with the bill.
 * @property {Array<Object>} order - List of order items.
 * @property {Object} order.category - Category details of the order item.
 * @property {ObjectId} order.category.catId - Reference to the Category model.
 * @property {string} order.category.categoryName - Name of the category. Defaults to empty string.
 * @property {Array<Object>} order.dimension - List of dimensions for the order item.
 * @property {string} order.dimension.dimensionTypeName - Type name of the dimension. Defaults to empty string.
 * @property {string} order.dimension.dimensionName - Name of the dimension. Defaults to empty string.
 * @property {string} order.dimension.note - Note for the dimension. Defaults to empty string.
 * @property {Array<Object>} order.styleProcess - List of style processes for the order item.
 * @property {string} order.styleProcess.styleProcessName - Name of the style process. Defaults to empty string.
 * @property {string} order.styleProcess.styleName - Name of the style. Defaults to empty string.
 * @property {boolean} order.work - Indicates if work is required for the order item.
 * @property {boolean} order.barcode - Indicates if barcode is required for the order item.
 * @property {string} order.measurement - Measurement details for the order item.
 * @property {string} order.orderNotes - Notes for the order item.
 * @property {number} order.amount - Amount for the order item.
 * @property {Object} order.color - Color details for the order item.
 * @property {string} order.color.type - Type of color. Can be 'Custom' or 'Selected'. Defaults to 'Selected'.
 * @property {string} order.color.name - Name of the color. Required.
 * @property {string} order.color.hex - Hex code of the color. Required.
 * @property {string} order.status - Status of the order item. Can be 'Pending', 'In Progress', 'Completed', or 'Cancelled'. Defaults to 'Pending'.
 * @property {number} totalAmount - Total amount for the bill.
 * @property {number} discount - Discount applied to the bill. Defaults to 0.
 * @property {Array<Object>} tax - List of taxes applied to the bill.
 * @property {ObjectId} tax._id - Reference to the Tax model.
 * @property {string} tax.taxName - Name of the tax.
 * @property {string} tax.taxType - Type of the tax.
 * @property {number} tax.taxPercentage - Percentage of the tax.
 * @property {number} grandTotal - Grand total amount for the bill. Defaults to 0.
 * @property {number} paidAmount - Amount paid for the bill. Defaults to 0.
 * @property {number} dueAmount - Amount due for the bill. Calculated as totalAmount - paidAmount.
 * @property {string} paymentStatus - Payment status of the bill. Can be 'Paid', 'Unpaid', or 'Partially Paid'. Defaults to 'Unpaid'.
 * @property {Object} billBy - Details of the user who created the bill.
 * @property {ObjectId} billBy._id - Reference to the User model.
 * @property {string} billBy.name - Name of the user who created the bill.
 *
 * @typedef {Object} Schema
 * @property {Object} timestamps - Timestamps for the schema.
 */
const billSchema: Schema<IBill> = new Schema<IBill>(
  {
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
        orderNotes: String,
        amount: { type: Number, required: [true, 'Amount is required.'] },
        color: {
          type: {
            type: String,
            enum: ['Custom', 'Selected'],
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
    discount: {
      type: Number,
      default: 0,
    },
    tax: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax' },
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
  },
  { timestamps: true },
);

// Schema for Receipts
const receiptSchema: Schema<IReceipt> = new Schema<IReceipt>(
  {
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
    receiptBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
    },
    amount: { type: Number, required: [true, 'Amount is required.'] },
    paymentDate: Date,
    paymentMethod: { type: String, enum: ['Cash', 'Online', 'UPI', 'Card'], default: 'Cash' },
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
  IStyle,
  IStyleProcess,
  ITax,
  ObjectId,
};
