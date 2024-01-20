'use client';
import { ICustomer } from '@/models/klm';
import axios from 'axios';
import { Types } from 'mongoose';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewCustomerPage() {
  const [customer, setCustomer] = useState<ICustomer>();

  const handleCustomerSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customer) {
      return;
    }
    setCustomer((prevCustomer) => {
      if (!prevCustomer) {
        return prevCustomer;
      }
      return {
        ...prevCustomer,
        customerId: new Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ICustomer;
    });

    const saveCustomerToDB = async (customer: ICustomer) => {
      const res = await axios.post('/api/dashboard/work-manage/new-customer', customer);
      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      toast.promise(saveCustomerToDB(customer as ICustomer), {
        loading: 'Saving Customer...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error: any) {
      // toast.error(error.message);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-base-100">
      <form
        onSubmit={handleCustomerSave}
        className="w-full rounded-box border-2 border-base-300 bg-base-200 p-4 md:w-fit"
      >
        <h2 className="my-2 text-center text-2xl font-bold">New Customer</h2>
        <div className="mb-2 flex flex-col md:flex-row md:justify-between md:gap-1">
          {/* First Column */}
          <div className="mb-2 flex flex-col max-sm:w-full max-sm:gap-1">
            <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
              <label htmlFor="name" className="label label-text">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="input input-primary max-w-xs"
                placeholder="Name"
                value={customer?.name || ''}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value } as ICustomer)}
              />
            </div>
            <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
              <label htmlFor="email" className="label label-text">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                id="email"
                className="input input-primary max-w-xs"
                placeholder="Email"
                value={customer?.email || ''}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value } as ICustomer)}
              />
            </div>
            <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
              <label htmlFor="phone" className="label label-text">
                Phone
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                autoComplete="mobile"
                className="input input-primary max-w-xs"
                placeholder="Phone"
                value={customer?.phone || ''}
                onChange={(e) =>
                  setCustomer((prevEditCustomer) => {
                    if (!prevEditCustomer) {
                      return prevEditCustomer;
                    }
                    return {
                      ...prevEditCustomer,
                      phone: parseInt(e.target.value, 10) || 0,
                    } as ICustomer;
                  })
                }
              />
            </div>
          </div>
          <div className="md:divider md:divider-horizontal md:my-4"></div>
          {/* Second Column */}
          <div className="mb-2 flex flex-col max-sm:w-full max-sm:gap-1">
            <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
              <label htmlFor="country" className="label label-text">
                Country
              </label>
              <input
                type="text"
                name="country"
                autoComplete="country"
                id="country"
                className="input input-primary max-w-xs"
                placeholder="Country"
                value={customer?.country || ''}
                onChange={(e) => setCustomer({ ...customer, country: e.target.value } as ICustomer)}
              />
            </div>
            <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
              <label htmlFor="state" className="label label-text">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                className="input input-primary max-w-xs"
                placeholder="State"
                value={customer?.state || ''}
                onChange={(e) => setCustomer({ ...customer, state: e.target.value } as ICustomer)}
              />
            </div>
            <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
              <label htmlFor="city" className="label label-text">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                className="input input-primary max-w-xs"
                placeholder="City"
                value={customer?.city || ''}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value } as ICustomer)}
              />
            </div>
            <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
              <label htmlFor="pin" className="label label-text">
                Pin
              </label>
              <input
                type="text"
                name="pin"
                id="pin"
                className="input input-primary max-w-xs"
                placeholder="Pin Code"
                value={customer?.pin || ''}
                onChange={(e) => setCustomer({ ...customer, pin: e.target.value } as ICustomer)}
              />
            </div>
          </div>
        </div>
        <div className="md:divider md:my-0"></div>
        {/* Shared Columns */}
        <div className="mb-2 flex flex-col gap-1 max-sm:w-full max-sm:gap-1">
          <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
            <label htmlFor="address" className="label label-text">
              Address
            </label>
            <textarea
              name="address"
              autoComplete="street-address"
              id="address"
              className="textarea textarea-primary textarea-sm"
              placeholder="Address"
              value={customer?.address || ''}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value } as ICustomer)}
            />
          </div>
          <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
            <label htmlFor="notes" className="label label-text">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              className="textarea textarea-primary textarea-sm"
              placeholder="Notes"
              value={customer?.notes || ''}
              onChange={(e) => setCustomer({ ...customer, notes: e.target.value } as ICustomer)}
            />
          </div>
          <button className="btn btn-primary mt-2 max-sm:w-full">Submit</button>
        </div>
      </form>
    </div>
  );
}
