import { connect } from '@/dbConfig/dbConfig';
import { Customer, ICustomer } from '@models/klm';
import handleError from '@utils/error/handleError';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Add interfaces for request bodies
interface DeleteCustomerRequest {
  type: 'deleteCustomer';
  customerId: string;
}

interface UpdateCustomerRequest {
  type: 'updateCustomer';
  customerId: string;
  customer: Omit<ICustomer, '_id'> & {
    _id?: Types.ObjectId;
    phone: number;
  };
}

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { type, page = 1, itemsPerPage = 10 } = reqBody;

    const skip = (page - 1) * itemsPerPage;

    let query = {};
    let customers;
    let total;

    switch (type) {
      case 'getCustomersByDate':
        const { fromDate, toDate } = reqBody;
        if (!fromDate || !toDate) {
          throw new Error('From date and To date are required');
        }
        query = {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        };
        break;

      case 'getCustomersByMobile':
        const { mobile } = reqBody;
        if (!mobile) {
          throw new Error('Mobile number is required');
        }
        // Search for numbers that start with the input pattern
        query = {
          phone: parseInt(mobile, 10)
            ? { $gte: parseInt(mobile + '0'), $lt: parseInt(mobile + '9') + 1 }
            : { $exists: true },
        };
        break;

      case 'getCustomers':
        // Default case - no specific query
        break;

      case 'deleteCustomer':
        return await handleDeleteCustomer(reqBody as DeleteCustomerRequest);

      case 'updateCustomer':
        return await handleUpdateCustomer(reqBody as UpdateCustomerRequest);

      default:
        throw new Error('Invalid request type');
    }

    // Execute query with pagination
    [customers, total] = await Promise.all([
      Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage).lean(),
      Customer.countDocuments(query),
    ]);

    return NextResponse.json({
      message: 'Customers fetched successfully',
      success: true,
      data: customers,
      total,
      page,
      totalPages: Math.ceil(total / itemsPerPage),
    });
  } catch (error) {
    return handleError.api(error);
  }
}

async function handleDeleteCustomer(reqBody: DeleteCustomerRequest) {
  const customer = await Customer.findByIdAndDelete(reqBody.customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return NextResponse.json({
    message: 'Customer deleted successfully',
    success: true,
  });
}

async function handleUpdateCustomer(reqBody: UpdateCustomerRequest) {
  const { customerId, customer: editedCustomer } = reqBody;

  // Ensure phone is number type
  const customerData = {
    ...editedCustomer,
    phone: parseInt(editedCustomer.phone.toString(), 10),
  };

  // Check for duplicate phone number
  const duplicatePhone = await Customer.findOne({
    phone: customerData.phone,
    _id: { $ne: customerId },
  });

  if (duplicatePhone) {
    throw new Error('Phone number already belongs to another customer');
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(customerId, customerData, { new: true });

  if (!updatedCustomer) {
    throw new Error('Customer not found');
  }

  return NextResponse.json({
    message: 'Customer updated successfully',
    success: true,
  });
}
