import { IBill } from '@/models/klm';

import formatDate from '@/app/util/format/dateUtils';

const BillTable = ({ caption, bills }: { caption: string; bills: any[] }) => {
  return (
    <div
      className={`table-row overflow-auto rounded-box border-2 border-base-300 bg-base-100 ${bills.length === 0 && 'min-h-24'}`}
    >
      <table className="table table-zebra table-pin-rows h-fit">
        <caption className="px-1 py-2 font-bold">{caption}</caption>
        {bills.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={5} className="text-warning">
                No bills for {caption}
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            <thead>
              <tr className="text-center">
                <th>Slno</th>
                <th>BillNumber</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>U/T</th>
                <th>Total</th>
                <th>Discount</th>
                <th>Grand</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th>Bill by</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill: IBill, index) => (
                <tr key={index} className="text-center">
                  <td>{index + 1}</td>
                  <td>{bill.billNumber}</td>
                  <td>{bill.mobile}</td>
                  <td>{bill?.date ? formatDate(bill?.date) : ''}</td>
                  <td>{bill?.dueDate ? formatDate(bill?.dueDate) : ''}</td>
                  <td className="font-bold">
                    {bill?.urgent && <span className={'text-error'}>U</span>}
                    {bill?.urgent && bill.trail && <span> | </span>}
                    {bill?.trail && <span className={'text-success'}>T</span>}
                  </td>
                  <td>{bill?.totalAmount}</td>
                  <td>{bill?.discount}</td>
                  <td>{bill?.grandTotal}</td>
                  <td>{bill?.paidAmount}</td>
                  <td>{bill?.dueAmount}</td>
                  <td>{bill?.paymentStatus}</td>
                  <td>{bill?.billBy?.name}</td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
};

export { BillTable };
