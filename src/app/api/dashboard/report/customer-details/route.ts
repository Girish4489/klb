/* eslint-disable @typescript-eslint/no-explicit-any */
import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { Customer } from '@/models/klm';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const handleGetCustomers = async (reqBody: any): Promise<any> => {
      const customers = await Customer.find()
        .skip((reqBody.page - 1) * reqBody.itemsPerPage)
        .limit(reqBody.itemsPerPage)
        .exec();

      const totalCustomers = await Customer.countDocuments();
      const isLastCustomerLoaded = reqBody.page * reqBody.itemsPerPage >= totalCustomers;

      return NextResponse.json({
        message: 'Customers loaded successfully',
        success: true,
        data: customers,
        isLastCustomerLoaded,
      });
    };

    const handleDeleteCustomer = async (reqBody: any): Promise<any> => {
      const customer = await Customer.findById(reqBody.customerId).exec();

      if (!customer) {
        throw new Error('Customer not found');
      }

      await Customer.findByIdAndDelete(reqBody.customerId).exec();

      return NextResponse.json({
        message: 'Customer deleted successfully',
        success: true,
      });
    };

    const handleUpdateCustomer = async (reqBody: any): Promise<any> => {
      const { customerId, customer: editedCustomer } = reqBody;
      const existingCustomer = await Customer.findById(customerId).exec();

      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      if (existingCustomer.phone !== editedCustomer.phone) {
        const duplicateCustomer = await Customer.findOne({ phone: editedCustomer.phone }).exec();

        if (duplicateCustomer && duplicateCustomer._id.toString() !== customerId) {
          throw new Error('Phone number already belongs to another customer');
        }
      } else {
        const otherCustomerWithSamePhone = await Customer.findOne({
          phone: editedCustomer.phone,
          _id: { $ne: customerId },
        }).exec();

        if (otherCustomerWithSamePhone) {
          throw new Error('Phone number already belongs to another customer');
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await Customer.findByIdAndUpdate(customerId, editedCustomer, { new: true }).exec();

      return NextResponse.json({
        message: 'Customer updated successfully',
        success: true,
      });
    };

    const handleRequest = async (reqBody: any): Promise<any> => {
      switch (reqBody.type) {
        case 'getCustomers':
          return await handleGetCustomers(reqBody);
        case 'deleteCustomer':
          return await handleDeleteCustomer(reqBody);
        case 'updateCustomer':
          return await handleUpdateCustomer(reqBody);
        default:
          throw new Error('Invalid request type');
      }
    };

    const reqBody = await request.json();

    const result = await handleRequest(reqBody);
    return result;
  } catch (error) {
    return handleError.api(error);
  }
}
