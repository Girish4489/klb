import mongoose, { Schema, Document, Model } from 'mongoose';

// Interfaces
interface ICustomer extends Document {
  customerId: mongoose.Types.ObjectId;
  name: string;
  mobile: number;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ICategory extends Document {
  categoryId?: mongoose.Types.ObjectId;
  categoryName?: string;
  description?: string;
  styleProcess: {
    styleProcessName: string;
    styles: {
      styleName: string;
    }[];
  }[];
}

interface IOrder extends Document {
  orderId: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  orderDate: Date;
  dueDate?: Date;
  deliverStatus?: string;
  urget?: boolean;
  trail?: string;
  billNumber: string;
  shippingAddress?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

interface IOrderDetails extends Document {
  orderId: mongoose.Types.ObjectId;
  orderPiece: number;
  category: string;
  parameter: Map<string, string>;
  measurements: Map<string, number>;
  itemsAmt: number;
  styles: string[];
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IBill extends Document {
  billId: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  billingDate: Date;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partially Paid';
  createdAt: Date;
  updatedAt: Date;
}

interface IReceipt extends Document {
  receiptId: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  bill?: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Customer Data
const customerSchema: Schema<ICustomer> = new Schema<ICustomer>({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, // Automatically generated
    ref: 'Customer',
    required: true,
  },
  name: {
    type: String,
    default: 'NA',
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: String,
  address: String,
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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId, // Automatically generated
    ref: 'Category',
  },
  categoryName: String,
  description: String,
  styleProcess: [
    {
      styleProcessName: String,
      styles: [
        {
          styleName: String,
        },
      ],
    },
  ],
});

// Schema for Order
const orderSchema: Schema<IOrder> = new Schema<IOrder>({
  orderId: {
    type: mongoose.Schema.Types.ObjectId, // Automatically generated
    ref: 'Order',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  dueDate: Date,
  deliverStatus: String,
  urget: Boolean,
  trail: String,
  billNumber: {
    type: String, // Add the bill number field
    required: true,
  },
  shippingAddress: String,
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
});

// Schema for Order Details
const orderDetailsSchema: Schema<IOrderDetails> = new Schema<IOrderDetails>({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  orderPiece: Number,
  category: String,
  parameter: {
    type: Map,
    of: String,
  },
  measurements: {
    type: Map,
    of: Number,
  },
  itemsAmt: Number,
  styles: [String],
  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for Bill
const billSchema: Schema<IBill> = new Schema<IBill>({
  billId: {
    type: mongoose.Schema.Types.ObjectId, // Automatically generated
    ref: 'Bill',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  totalAmount: Number,
  paidAmount: Number,
  dueAmount: Number,
  billingDate: Date,
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partially Paid'],
    default: 'Unpaid',
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
    type: mongoose.Schema.Types.ObjectId, // Automatically generated
    ref: 'Receipt',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
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

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

const OrderDetails: Model<IOrderDetails> =
  mongoose.models.OrderDetails || mongoose.model<IOrderDetails>('OrderDetails', orderDetailsSchema);

const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>('Bill', billSchema);

const Receipt: Model<IReceipt> = mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', receiptSchema);

// Export the models
export { Customer, Category, Order, OrderDetails, Bill, Receipt };
