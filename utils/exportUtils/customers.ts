import { ICustomer } from '@models/klm';
import { formatD } from '@utils/format/dateUtils';
import { JSX } from 'react';
import type { ExportData, TableRow } from './common';

interface CustomerTableRow extends TableRow {
  slNo: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  createdAt: string;
  updatedAt: string;
  actions?: JSX.Element;
}

export const prepareCustomerExportData = (customers: ICustomer[]): ExportData => {
  const columns = [
    { header: 'Sl No', field: 'slNo', selected: true },
    { header: 'Name', field: 'name', selected: true },
    { header: 'Phone', field: 'phone', selected: true },
    { header: 'Email', field: 'email', selected: true },
    { header: 'City', field: 'city', selected: true },
    { header: 'State', field: 'state', selected: true },
    { header: 'Country', field: 'country', selected: true },
    { header: 'Pin', field: 'pin', selected: true },
    { header: 'Created At', field: 'createdAt', selected: true },
    { header: 'Updated At', field: 'updatedAt', selected: true },
  ];

  const data: CustomerTableRow[] = customers.map((customer, index) => ({
    slNo: index + 1,
    name: (customer.name || '-').replace(/,/g, ':'),
    phone: (customer.phone?.toString() || '-').replace(/,/g, ':'),
    email: (customer.email || '-').replace(/,/g, ':'),
    city: (customer.city || '-').replace(/,/g, ':'),
    state: (customer.state || '-').replace(/,/g, ':'),
    country: (customer.country || '-').replace(/,/g, ':'),
    pin: (customer.pin || '-').replace(/,/g, ':'),
    createdAt: `${formatD(customer.createdAt)}`.replace(/,/g, ':'),
    updatedAt: `${formatD(customer.updatedAt)}`.replace(/,/g, ':'),
  }));

  return {
    columns,
    data,
    title: 'Customer Details Report',
  };
};
