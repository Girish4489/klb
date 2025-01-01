'use client';
import { Column, ReportTable } from '@components/table/ReportTable';
import { CloudArrowUpIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { ICustomer } from '@models/klm';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import { TableRow, exportToCSV, exportToPDF } from '@utils/exportUtils/common';
import { prepareCustomerExportData } from '@utils/exportUtils/customers';
import { fetchAllData } from '@utils/fetchAllData/fetchAllData';
import { formatD } from '@utils/format/dateUtils';
import { toast } from '@utils/toast/toast';
import axios from 'axios';
import React, { JSX, useState } from 'react';

const formatDateTime = (date: Date | string | undefined): string => {
  if (!date) return '-';
  return formatD(new Date(date));
};

interface ICustomerTableRow extends TableRow {
  actions?: JSX.Element;
}

interface CustomerApiResponse {
  success: boolean;
  message: string;
  data?: ICustomer;
}

export default function CustomerDetails(): JSX.Element {
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'date' | 'mobile'>('date');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState<Column[]>([
    { header: 'Sl No', field: 'slNo', selected: true },
    { header: 'Name', field: 'name', selected: true },
    { header: 'Phone', field: 'phone', selected: true },
    { header: 'Email', field: 'email', selected: true },
    { header: 'City', field: 'city', selected: true },
    { header: 'State', field: 'state', selected: true },
    { header: 'Country', field: 'country', selected: true },
    { header: 'Created At', field: 'createdAt', selected: true },
    { header: 'Actions', field: 'actions', selected: false, isAction: true },
  ]);

  const handleFilter = async (): Promise<void> => {
    setLoading(true);
    try {
      if (searchType === 'date' && (!fromDate || !toDate)) {
        toast.error('Please provide both from date and to date');
        return;
      }
      if (searchType === 'mobile' && !mobileNumber) {
        toast.error('Please provide a mobile number');
        return;
      }

      const requestBody = {
        type: searchType === 'date' ? 'getCustomersByDate' : 'getCustomersByMobile',
        page: currentPage,
        itemsPerPage: 10,
        ...(searchType === 'date'
          ? {
              fromDate: new Date(fromDate!).toISOString(),
              toDate: new Date(toDate!).toISOString(),
            }
          : {
              mobile: mobileNumber,
            }),
      };

      const response = await axios.post('/api/dashboard/report/customer-details', requestBody);

      if (response.data.success) {
        setCustomer(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.page);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number): Promise<void> => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    setLoading(true);

    try {
      const requestBody = {
        type: searchType === 'date' ? 'getCustomersByDate' : 'getCustomersByMobile',
        page,
        itemsPerPage: 10,
        ...(searchType === 'date'
          ? {
              fromDate: new Date(fromDate!).toISOString(),
              toDate: new Date(toDate!).toISOString(),
            }
          : {
              mobile: mobileNumber,
            }),
      };

      const response = await axios.post('/api/dashboard/report/customer-details', requestBody);

      if (response.data.success) {
        setCustomer(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const [editCustomer, setEditCustomer] = useState<ICustomer>();

  const handleEditModal = async (customerId: string): Promise<void> => {
    // Implement your edit logic here
    setEditCustomer(customer.find((customer) => customer._id.toString() === customerId));
    const element = document.getElementById('CustomerEditModal') as HTMLDialogElement | null;
    if (element) {
      element.showModal();
    }
  };

  const handleEditCustomer = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const updateCustomer = async (): Promise<string> => {
      if (!editCustomer) throw new Error('Customer not found');
      const updatedCustomer = {
        ...editCustomer,
        updatedAt: new Date(),
        phone: parseInt(editCustomer.phone?.toString() || '0', 10),
      } as ICustomer;
      const res = await axios.post<CustomerApiResponse>('/api/dashboard/report/customer-details', {
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
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      // Handle error
      if (error instanceof Error) {
        console.error(error.message);
        // toast.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
    return;
  };

  const handleDelete = async (customerId: string): Promise<void> => {
    const confirmation = await userConfirmation({
      header: 'Delete Confirmation',
      message: 'Are you sure you want to delete this customer?',
    });
    if (!confirmation) return;
    if (confirmation) {
      const deleteCustomer = async (): Promise<string> => {
        const res = await axios.post<CustomerApiResponse>(`/api/dashboard/report/customer-details`, {
          type: 'deleteCustomer',
          customerId: customerId,
        });
        if (res.data.success === true) {
          setCustomer((prevCustomers) => prevCustomers.filter((customer) => customer._id.toString() !== customerId));
          return res.data.message;
        } else {
          throw new Error(res.data.message);
        }
      };
      try {
        toast.promise(deleteCustomer(), {
          loading: 'Deleting...',
          success: (message: string) => <b>{message}</b>,
          error: (error: Error) => <b>{error.message}</b>,
        });
      } catch (error) {
        // Handle error
        if (error instanceof Error) {
          console.error(error.message);
          // toast.error(error.message);
        } else {
          console.error('An unknown error occurred');
        }
      }
    }
    return;
  };

  const handleExport = async (format: 'csv' | 'pdf'): Promise<void> => {
    toast.promise(
      (async (): Promise<string> => {
        const allCustomers = await fetchAllData.customers();
        const exportData = prepareCustomerExportData(allCustomers);
        if (format === 'csv') {
          exportToCSV(exportData, 'customer-details.csv');
        } else if (format === 'pdf') {
          exportToPDF(exportData, 'customer-details.pdf');
        }
        return 'Export completed';
      })(),
      {
        loading: 'Preparing export...',
        success: 'Export completed successfully',
        error: 'Failed to export data',
      },
    );
  };

  // Transform customer data for the table
  const getTableData = (customers: ICustomer[]): ICustomerTableRow[] => {
    return customers.map((customer, index) => ({
      slNo: index + 1,
      name: customer.name || '-',
      phone: customer.phone?.toString() || '-',
      email: customer.email || '-',
      city: customer.city || '-',
      state: customer.state || '-',
      country: customer.country || '-',
      createdAt: formatDateTime(customer.createdAt),
      actions: (
        <div className="flex items-center justify-center space-x-2">
          <button className="btn btn-primary btn-xs" onClick={() => handleEditModal(customer._id.toString())}>
            Edit
          </button>
          <button className="btn btn-error btn-xs" onClick={() => handleDelete(customer._id.toString())}>
            Delete
          </button>
        </div>
      ),
    }));
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* Filter Section */}
      <div className="bg-base-200 flex flex-wrap items-center gap-4 rounded-lg p-4 shadow-sm">
        <div className="join">
          <input
            type="radio"
            className="btn join-item btn-sm"
            checked={searchType === 'date'}
            onChange={() => setSearchType('date')}
            aria-label="Date Range"
          />
          <input
            type="radio"
            className="btn join-item btn-sm"
            checked={searchType === 'mobile'}
            onChange={() => setSearchType('mobile')}
            aria-label="Mobile"
          />
        </div>

        {searchType === 'date' ? (
          <div className="flex flex-1 gap-2">
            <label className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2">
              From:
              <input
                type="date"
                className="grow"
                value={fromDate ? new Date(fromDate).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFromDate(new Date(e.target.value))}
              />
            </label>
            <label className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2">
              To:
              <input
                type="date"
                className="grow"
                value={toDate ? new Date(toDate).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToDate(new Date(e.target.value))}
              />
            </label>
          </div>
        ) : (
          <input
            type="text"
            placeholder="Mobile Number"
            className="input input-sm input-bordered flex-1"
            value={mobileNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // Only allow numbers
              const value = e.target.value.replace(/[^0-9]/g, '');
              setMobileNumber(value);
            }}
          />
        )}

        <div className="ml-auto flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={handleFilter} disabled={loading}>
            {loading ? <span className="loading loading-spinner" /> : <FunnelIcon className="h-5 w-5" />}
            Filter
          </button>

          {customer.length > 0 && (
            <>
              <button onClick={() => handleExport('csv')} className="btn btn-secondary btn-sm">
                Export CSV
              </button>
              <button onClick={() => handleExport('pdf')} className="btn btn-secondary btn-sm">
                Export PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table Section - Fills remaining height */}
      <div className="min-h-0 flex-1">
        <ReportTable
          data={getTableData(customer)}
          columns={columns}
          caption="Customer Details"
          loading={loading}
          onColumnSelectChange={setColumns}
        />
      </div>

      {/* Pagination Section */}
      {customer.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="join">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`btn join-item btn-sm ${currentPage === index + 1 ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal remains unchanged */}
      <span>
        <dialog id="CustomerEditModal" className="modal">
          <div className="modal-box min-w-fit p-0">
            {editCustomer && (
              <form onSubmit={handleEditCustomer} className="rounded-box border-base-300 w-full border p-4">
                <h2 className="my-2 text-center font-bold text-2xl">Update Customer</h2>
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
                        className="input input-sm input-primary max-w-xs"
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
                        className="input input-sm input-primary max-w-xs"
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
                        className="input input-sm input-primary max-w-xs"
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
                        className="input input-sm input-primary max-w-xs"
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
                        className="input input-sm input-primary max-w-xs"
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
                        className="input input-sm input-primary max-w-xs"
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
                        className="input input-sm input-primary max-w-xs"
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
                  <button type="submit" className="btn btn-primary btn-sm mt-2 max-sm:w-full">
                    <CloudArrowUpIcon className="h-5 w-5" />
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
    </div>
  );
}
