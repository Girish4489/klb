// /src/app/dashboard/report/customer-details/page.tsx
'use client';
import { userConfirmaion } from '@/app/util/confirmation/confirmationUtil';
import { formatD } from '@/app/util/format/dateUtils';
import { ICustomer } from '@/models/klm';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface IPagination {
  type: string;
  page: number;
  itemsPerPage: number;
  hasMore: boolean;
}

export default function CustomerDetails() {
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    type: 'getCustomers',
    page: 1,
    itemsPerPage: 10,
    hasMore: true,
  });

  const initialRender = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!initialRender.current && pagination.hasMore) {
        const fetch = async () => {
          const res = await axios.post('/api/dashboard/report/customer-details', pagination);
          if (res.data.isLastCustomerLoaded === true) {
            setPagination((prevPagination) => ({
              ...prevPagination,
              hasMore: false,
            }));
          }
          if (res.data.success === true) {
            setCustomer((prevCustomers) => [...prevCustomers, ...res.data.data]);
            return res.data.message;
          } else {
            throw new Error(res.data.message);
          }
        };
        try {
          toast.promise(fetch(), {
            loading: 'Loading...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
        } catch (error: any) {
          // Handle error
          // toast.error(error.message);
        }
      }
    };

    fetchData();
  }, [pagination]);

  const loadMoreCustomers = async () => {
    setPagination((prevPagination) => {
      if (prevPagination.hasMore) {
        return {
          ...prevPagination,
          page: prevPagination.page + 1,
        };
      }
      return prevPagination;
    });
  };

  useEffect(() => {
    initialRender.current = false;
  }, []);

  const [editCustomer, setEditCustomer] = useState<ICustomer>();

  const handleEditModal = async (customerId: string) => {
    // Implement your edit logic here
    setEditCustomer(customer.find((customer) => customer._id === customerId));
    const element = document.getElementById('CustomerEditModal') as HTMLDialogElement | null;
    if (element) {
      element.showModal();
    }
  };

  const handleEditCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updateCustomer = async () => {
      if (!editCustomer) throw new Error('Customer not found');
      const updatedCustomer = { ...editCustomer, updatedAt: new Date() } as ICustomer;
      const res = await axios.post('/api/dashboard/report/customer-details', {
        type: 'updateCustomer',
        customerId: editCustomer?._id,
        customer: updatedCustomer,
      });
      if (res.data.success === true) {
        setCustomer(
          (prevCustomers) =>
            prevCustomers
              .map((customer) => {
                if (customer._id === updatedCustomer?._id) return updatedCustomer as ICustomer;
                return customer;
              })
              .filter(Boolean) as ICustomer[],
        );
        const element = document.getElementById('CustomerEditModal') as HTMLDialogElement | null;
        if (element) {
          element.close();
        }
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      toast.promise(updateCustomer(), {
        loading: 'Updating...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error: any) {
      // Handle error
      // toast.error(error.message);
    }
    return;
  };

  const handleDelete = async (customerId: string) => {
    const confirmation = await userConfirmaion({
      header: 'Delete Confirmation',
      message: 'Are you sure you want to delete this customer?',
    });
    if (!confirmation) return;
    if (confirmation) {
      const deleteCustomer = async () => {
        const res = await axios.post(`/api/dashboard/report/customer-details`, {
          type: 'deleteCustomer',
          customerId: customerId,
        });
        if (res.data.success === true) {
          setCustomer((prevCustomers) => prevCustomers.filter((customer) => customer._id !== customerId));
          return res.data.message;
        } else {
          throw new Error(res.data.message);
        }
      };
      try {
        toast.promise(deleteCustomer(), {
          loading: 'Deleting...',
          success: (message) => <b>{message}</b>,
          error: (error) => <b>{error.message}</b>,
        });
      } catch (error: any) {
        // Handle error
        // toast.error(error.message);
      }
    }
    return;
  };

  return (
    <div className="flex h-full flex-col rounded-box border border-base-300 p-4 max-sm:mx-0 max-sm:px-0">
      <span>
        <dialog id="CustomerEditModal" className="modal">
          <div className="modal-box min-w-fit p-0">
            {editCustomer && (
              <form onSubmit={handleEditCustomer} className="w-full rounded-box border border-base-300 p-4">
                <h2 className="my-2 text-center text-2xl font-bold">Update Customer</h2>
                <div className="mb-2 flex flex-col md:flex-row md:justify-between md:gap-1">
                  {/* First Column */}
                  <div className="mb-2 flex flex-col max-sm:w-full max-sm:gap-1">
                    <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
                      <label htmlFor="customerName" className="label label-text">
                        Name
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        id="customerName"
                        className="input input-primary max-w-xs"
                        placeholder="Name"
                        value={editCustomer?.name || ''}
                        onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value } as ICustomer)}
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
                        value={editCustomer?.email || ''}
                        onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value } as ICustomer)}
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
                        value={editCustomer?.phone || ''}
                        onChange={(e) =>
                          setEditCustomer((prevEditCustomer) => {
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
                        value={editCustomer?.country || ''}
                        onChange={(e) => setEditCustomer({ ...editCustomer, country: e.target.value } as ICustomer)}
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
                        value={editCustomer?.state || ''}
                        onChange={(e) => setEditCustomer({ ...editCustomer, state: e.target.value } as ICustomer)}
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
                        value={editCustomer?.city || ''}
                        onChange={(e) => setEditCustomer({ ...editCustomer, city: e.target.value } as ICustomer)}
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
                        value={editCustomer?.pin || ''}
                        onChange={(e) =>
                          setEditCustomer((prevEditCustomer) => {
                            if (!prevEditCustomer) {
                              return prevEditCustomer;
                            }
                            return {
                              ...prevEditCustomer,
                              pin: e.target.value,
                            } as ICustomer;
                          })
                        }
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
                      value={editCustomer?.address || ''}
                      onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value } as ICustomer)}
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
                      value={editCustomer?.notes || ''}
                      onChange={(e) => setEditCustomer({ ...editCustomer, notes: e.target.value } as ICustomer)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-2 max-sm:w-full">
                    Update
                  </button>
                </div>
              </form>
            )}
            <div className="modal-action mb-2 mr-4">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
              </form>
            </div>
          </div>
        </dialog>
      </span>
      <h2 className="my-2 text-center text-2xl font-bold">Customer Details</h2>{' '}
      <span className="customerScroll w-full grow overflow-auto rounded-box border-2 border-base-300 bg-base-300 shadow-2xl">
        <div className="contents h-full max-h-96 max-w-96 rounded-box bg-base-300 max-sm:flex">
          <table className="table table-zebra table-pin-rows table-pin-cols rounded-box bg-base-100">
            <thead>
              <tr>
                <th>Sn</th>
                <td className="text-center">Actions</td>
                <td>Name</td>
                <td>Phone</td>
                <td>Email</td>
                <td>Country</td>
                <td>State</td>
                <td>City</td>
                <td>Pin</td>
                <td>Address</td>
                <td>Notes</td>
                <td>Created At</td>
                <td>Updated At</td>
              </tr>
            </thead>
            <tbody>
              {customer.length > 0 ? (
                customer.map((customerItem, index) => (
                  <tr key={customerItem._id}>
                    <th>{index + 1}</th>
                    <td className="text-center">
                      <span className="flex h-full w-full flex-col items-center justify-center gap-1 max-sm:flex-row">
                        <button
                          className="btn btn-secondary btn-sm md:w-full"
                          onClick={() => handleEditModal(customerItem._id)}
                        >
                          Edit
                        </button>
                        <button className="btn btn-warning btn-sm" onClick={() => handleDelete(customerItem._id)}>
                          Delete
                        </button>
                      </span>
                    </td>
                    <td>{customerItem.name}</td>
                    <td>{customerItem.phone}</td>
                    <td>{customerItem.email}</td>
                    <td>{customerItem.country}</td>
                    <td>{customerItem.state}</td>
                    <td>{customerItem.city}</td>
                    <td>{customerItem.pin}</td>
                    <td>{customerItem.address}</td>
                    <td>{customerItem.notes}</td>
                    <td>{formatD(customerItem.createdAt)}</td>
                    <td>{formatD(customerItem.updatedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={13}>No customers found.</td>
                </tr>
              )}
              {pagination.hasMore && (
                <tr>
                  <td colSpan={13} className="md:text-center">
                    <button className="btn btn-primary" onClick={loadMoreCustomers}>
                      Load More
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th>Sn</th>
                <td className="text-center">Actions</td>
                <td>Name</td>
                <td>Phone</td>
                <td>Email</td>
                <td>Country</td>
                <td>State</td>
                <td>City</td>
                <td>Pin</td>
                <td>Address</td>
                <td>Notes</td>
                <td>Created At</td>
                <td>Updated At</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </span>
    </div>
  );
}
