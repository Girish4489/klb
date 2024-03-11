'use client';
import { formatDS, formatDSNT } from '@/app/util/format/dateUtils';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { IBill, IReceipt } from '@/models/klm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import klm from '/public/klm.png';

export default function PrintPreview() {
  const [billNumber, setBillNumber] = useState<number>(0);
  const [type, setType] = useState<string>('');
  const [bill, setBill] = useState<IBill>();
  const [receipt, setReceipt] = useState<IReceipt>();
  const [printOptions, setPrintOptions] = useState<string>('');
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const router = useRouter();

  const [cal, setCal] = useState<{
    totalAmount: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    dueAmount: number;
  }>({
    totalAmount: 0,
    discount: 0,
    grandTotal: 0,
    paidAmount: 0,
    dueAmount: 0,
  });

  const thermalPrintOptions = `
    size: Custom;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    width: 80mm;
    height: auto;
  `;

  const a4PrintOptions = `
    size: A4 portrait;
    margin: 1cm;
  `;

  useEffect(() => {
    async function getBillData(type: string, billNumber: number) {
      if (type === 'Customer Bill' || type === 'Worker Bill') {
        setPrintOptions(a4PrintOptions);
        // Fetch the bill data from the server
        const response = await ApiGet.printDocument.PrintBill(type, billNumber);
        if (response.success === true) {
          setBill(response.bill);
          return response.message;
        } else if (response.success === false) {
          toast.error(response.message);
          return;
        }
        return;
      }
    }

    async function getReceiptData(type: string, receiptNumber: number) {
      if (type === 'Receipt') {
        if (!receiptNumber) {
          toast.error('Receipt number is required');
          return;
        }
        setPrintOptions(thermalPrintOptions);
        // Fetch the receipt data from the server
        const response = await ApiGet.printDocument.PrintReceipt(type, receiptNumber);
        if (response.success === true) {
          setReceipt(response.receipt);
          if (response.bill) {
            setCal({
              totalAmount: response.bill.totalAmount || 0,
              discount: response.bill.discount || 0,
              grandTotal: response.bill.grandTotal || 0,
              paidAmount: response.bill.paidAmount || 0,
              dueAmount: response.bill.dueAmount || 0,
            });
          }
          return response.message;
        } else if (response.success === false) {
          toast.error(response.message);
          return;
        }
        return;
      }
    }

    // Get billnumber and type by search url
    const urlSearchParams = new URLSearchParams(window.location.search);
    const billNumberParam = parseInt(urlSearchParams.get('billNumber') || '0', 10);
    const typeParam = urlSearchParams.get('type') || '';
    setBillNumber(billNumberParam);
    setType(typeParam);

    async function fetchData() {
      let data: any;
      if ((type === 'Customer Bill' || type === 'Worker Bill') && billNumber) {
        try {
          await toast.promise(getBillData(type, billNumber), {
            loading: 'Loading...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          setIsDataLoaded(true);
        } catch (error) {
          // toast.error(error.message);
        }
      } else if (type === 'Receipt' && billNumber) {
        try {
          await toast.promise(getReceiptData(type, billNumber), {
            loading: 'Loading...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          setIsDataLoaded(true);
        } catch (error) {
          // toast.error(error.message);
        }
      }
    }

    fetchData();
  }, [a4PrintOptions, billNumber, thermalPrintOptions, type]);

  async function handlePrint() {
    // Print the window
    window.print();
  }

  // Create the print window
  return (
    <span className="preview">
      <span className="print-button space-x-2 bg-white p-1">
        <button className="btn btn-primary btn-sm m-2 text-center" onClick={() => router.back()}>
          Back
        </button>
        <button className="btn btn-primary btn-sm m-2 text-center" onClick={handlePrint}>
          Print
        </button>
      </span>
      <style jsx>{`
        /* Define styles for the print button */
        .print-button {
          display: block; /* Show the button by default */
        }

        .preview div {
          background-color: #fff;
        }

        /* Define styles for the print button when printing */
        @media print {
          .print-button {
            display: none; /* Hide the button when printing */
          }
        }
      `}</style>
      <style jsx>
        {`
          body {
            margin: 0;
            padding: 0;
            background-color: #fff;
          }

          body {
            font:
              12px Georgia,
              'Times New Roman',
              Times,
              serif;
            color: #333;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font:
              bold 100% Georgia,
              'Times New Roman',
              Times,
              serif;
            color: #333;
          }

          hr {
            margin: 10px, 10px;
          }

          .flex {
            display: flex;
          }

          .flex-row {
            flex-direction: row;
          }

          .flex-col {
            flex-direction: column;
          }

          .items-center {
            align-items: center;
          }

          .justify-center {
            justify-content: center;
          }

          .justify-between {
            justify-content: space-between;
          }

          .justify-around {
            justify-content: space-around;
          }

          .justify-evenly {
            justify-content: space-evenly;
          }

          .justify-start {
            justify-content: flex-start;
          }

          .grow-1 {
            flex-grow: 1;
          }

          :root {
            --gap-2: 2px;
            --gap-4: 4px;
            --gap-8: 8px;
          }

          .gap-2 {
            gap: var(--gap-2);
          }

          .gap-4 {
            gap: var(--gap-4);
          }

          .gap-8 {
            gap: var(--gap-8);
          }

          :root {
            --padding-2: 2px;
            --padding-4: 4px;
            --padding-8: 8px;
          }

          .padding-2 {
            padding: var(--padding-2);
          }

          .padding-4 {
            padding: var(--padding-4);
          }

          .padding-8 {
            padding: var(--padding-8);
          }

          :root {
            --margin-2: 2px;
            --margin-4: 4px;
            --margin-8: 8px;
          }

          .m-2 {
            margin: var(--margin-2);
          }

          .m-4 {
            margin: var(--margin-4);
          }

          .m-8 {
            margin: var(--margin-8);
          }

          .text-center {
            text-align: center;
          }

          .billType {
            font:
              bold 100% Georgia,
              'Times New Roman',
              Times,
              serif;
            color: #333;
            padding: 0%;
            margin: 0%;
            text-align: center;
          }

          .field {
            display: flex;
            flex-direction: row;
            gap: 2px;
            align-items: center;
            justify-content: space-between;
          }

          .address {
            grid-column: 1 / span 2;
          }

          .field h2 {
            margin: 0;
            padding: 1px;
            text-align: center;
            font-size: small;
            font-weight: bold;
          }

          .field h3 {
            margin: 0;
            padding: 1px;
            flex-grow: 1;
            text-align: justify;
            font-size: small;
            font-weight: bold;
          }

          .customer-details {
            display: grid;
            width: 50%;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px;
          }

          .w-50per {
            width: 50%;
          }

          .header-box {
            text-align: center;
            display: table;
            width: 96%;
            margin: 0 auto;
            padding: 5px;
            border: #333 solid 1px;
            border-radius: 10px;
            gap: 2px;
          }

          .process-box {
            text-align: center;
            border: #333 solid 1px;
            border-radius: 10px;
            padding: var(--padding-2);
            gap: 2px;
          }

          .profile {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .profile img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            aspect-ratio: 1/1;
            place-items: center;
            border: 1px solid black;
            object-fit: fill;
          }

          .profile img:hover {
            transform: scale(1.05);
            opacity: 0.9;
          }

          .footer {
            text-align: center;
          }

          .w-full {
            width: 100%;
          }

          .w-fit {
            width: fit-content;
          }

          .mx-2 {
            margin-left: var(--margin-2);
            margin-right: var(--margin-2);
          }

          .mx-4 {
            margin-left: var(--margin-4);
            margin-right: var(--margin-4);
          }

          .mx-8 {
            margin-left: var(--margin-8);
            margin-right: var(--margin-8);
          }

          .my-2 {
            margin-top: var(--margin-2);
            margin-bottom: var(--margin-2);
          }

          .my-4 {
            margin-top: var(--margin-4);
            margin-bottom: var(--margin-4);
          }

          .my-8 {
            margin-top: var(--margin-8);
            margin-bottom: var(--margin-8);
          }

          .footer {
            page-break-inside: avoid;
          }

          @page {
            ${printOptions}
          }

          .order-details {
            break-before: avoid;
            page-break-inside: avoid;
            page-break-after: auto;
          }

          .receipt {
            width: 300px;
            margin: 50px auto;
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }

          .receipt th,
          td {
            border: 1px solid #ddd;
          }

          .receipt tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .receipt tr {
            text-align: left;
          }
        `}
      </style>
      {(type === 'Customer Bill' || type === 'Worker Bill') && (
        <div className="mx-2 flex flex-col justify-between gap-2 " style={{ height: '100%', marginBottom: 0 }}>
          <span className="grow-1 flex grow flex-col gap-2">
            <h4 className="billType">{type}</h4>
            <div className="header-box">
              <div className="flex flex-row items-center justify-between">
                <div className="item-center flex flex-row gap-4">
                  <span className="profile">
                    <Image src={klm.src} width={80} height={80} alt="Profile" />
                  </span>
                  <hr className="divider-horizontal w-0.5 rounded bg-black" />
                  {type === 'Customer Bill' ? (
                    <span className="flex flex-col items-center justify-center">
                      <h2 id="header">Kalamandir Ladies boutique</h2>
                      <address>1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208</address>
                    </span>
                  ) : (
                    <div className="header-col w-50per flex flex-col justify-start text-center">
                      <h2 id="text-center">Barcode</h2>
                    </div>
                  )}
                </div>
                {type === 'Customer Bill' ? (
                  <>
                    <hr className="divider-horizontal w-0.5 rounded bg-black" />
                    <div className="item-center flex flex-col justify-between">
                      <span className="field">
                        <h2>Phone:</h2>
                        <h3>9845371322</h3>
                      </span>
                      <span className="field">
                        <h2>Email:</h2>
                        <h3>kalamandir2106@gmail.com</h3>
                      </span>
                      <span className="field">
                        <h2>GST No:</h2>
                        <h3></h3>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <hr className="divider-horizontal w-0.5 rounded bg-black" />
                    <div className="item-center flex flex-col justify-between">
                      <span className="field">
                        <h2>Bill No:</h2>
                        <h3>{bill?.billNumber}</h3>
                      </span>
                      <span className="field">
                        <h2>Bill By:</h2>
                        <h3>{bill?.billBy?.name}</h3>
                      </span>
                      <span className="field">
                        <h2>Due Date:</h2>
                        <h3>{bill?.dueDate ? formatDS(bill?.dueDate) : ''}</h3>
                      </span>
                    </div>
                  </>
                )}
              </div>

              {type === 'Customer Bill' && (
                <>
                  <hr className="divider-vertical my-1 h-0.5 rounded bg-black" />
                  <div className="flex flex-row justify-between">
                    <div className="customer-details grow">
                      <span className="field">
                        <h2>Bill No:</h2>
                        <h3>{bill?.billNumber}</h3>
                      </span>
                      <span className="field">
                        <h2>Bill Date:</h2>
                        <h3>{bill?.date ? formatDS(bill?.date) : ''}</h3>
                      </span>
                      <span className="field">
                        <h2>Name:</h2>
                        <h3>{bill?.name}</h3>
                      </span>
                      <span className="field">
                        <h2>Due Date:</h2>
                        <h3>{bill?.dueDate ? formatDS(bill?.dueDate) : ''}</h3>
                      </span>
                      <span className="field">
                        <h2>Mobile:</h2>
                        <h3>{bill?.mobile}</h3>
                      </span>
                      <span className="field">
                        <h2>Email:</h2>
                        <h3>{bill?.email}</h3>
                      </span>
                      <span className="field address">
                        <h2>Address:</h2>
                        <h3></h3>
                      </span>
                    </div>
                    <hr className="divider-horizontal w-0.5 rounded bg-black" />
                    <div className="header-col w-50per flex flex-col justify-start text-center">
                      <h2 id="text-center">Barcode</h2>
                    </div>
                  </div>
                </>
              )}
            </div>
            {bill?.order.map((order, orderIndex) => (
              <div
                key={orderIndex}
                className="table m-auto flex w-[96%] break-inside-avoid flex-col gap-1 rounded border border-black p-1 text-center"
              >
                <span className="flex flex-row items-center justify-between gap-8">
                  <span className="flex flex-row items-center gap-8">
                    <h1>{orderIndex + 1}.</h1>
                    <span className="flex flex-row items-center gap-4">
                      <h1>Category:</h1>
                      <h2>{order.category?.categoryName}</h2>
                    </span>
                  </span>
                  <span className="flex flex-row items-center justify-center gap-8">
                    <h1>Work:</h1>
                    <h2>{order.work ? 'Yes' : 'No'}</h2>
                  </span>
                  <span className="flex flex-row items-center justify-center gap-8">
                    <h1>Qr Code:</h1>
                    <h2>{order.barcode ? 'Yes' : 'No'}</h2>
                  </span>
                  {type === 'Customer Bill' && (
                    <span className="flex flex-row items-center justify-center gap-8">
                      <h1>Amount:</h1>
                      <h2>{order.amount}</h2>
                    </span>
                  )}
                </span>
                <hr style={{ margin: 0, padding: 0 }} />
                <span className="flex flex-row items-center gap-8">
                  <h1>Styles:</h1>
                  {order.styleProcess.map((style, styleIndex) => (
                    <span key={styleIndex} className="item-center process-box grow-1 flex flex-col justify-start">
                      <span className="flex flex-row items-center justify-around gap-8">
                        <h1>
                          {styleIndex + 1}). {style.styleProcessName}
                        </h1>
                        <hr />
                        <h2>{style.styleName}</h2>
                      </span>
                    </span>
                  ))}
                </span>
                <hr style={{ margin: 0, padding: 0 }} />
                <span className="flex flex-row items-center gap-8">
                  <h1>Measurement:</h1>
                  <h2>{order.measurement}</h2>
                </span>
                <hr style={{ margin: 0, padding: 0 }} />
                <span className="flex flex-row items-center gap-8">
                  {order.dimension.map((dimension, dimensionIndex) => (
                    <span key={dimensionIndex} className="item-center process-box grow-1 flex flex-col justify-start">
                      <span className="flex flex-row items-center justify-around gap-8">
                        <h1>
                          {dimensionIndex + 1}). {dimension.dimensionTypeName}
                        </h1>
                        <hr />
                        <h2>{dimension.dimensionName}</h2>
                      </span>
                      <hr style={{ width: '100%', margin: 0, padding: 0 }} />
                      <span className="flex flex-row items-center justify-center gap-8">
                        <h1>{dimension.note}</h1>
                      </span>
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </span>
          <span className="footer m-auto flex flex-col gap-2">
            {type === 'Customer Bill' ? (
              <>
                <hr className="m-auto" style={{ width: '95%', border: '1px solid' }} />
                <span className="m-auto flex flex-row items-stretch justify-between gap-2" style={{ width: '95%' }}>
                  <span className="process-box">
                    <span className="field">
                      <h2>Total:</h2>
                      <h3>{bill?.totalAmount}</h3>
                    </span>
                    <span className="field">
                      <h2>Discount:</h2>
                      <h3>{bill?.discount}</h3>
                    </span>
                    <span className="field">
                      <h2>Tax:</h2>
                      <h3>000</h3>
                    </span>
                  </span>
                  <span className="process-box grow-1">
                    <div className="header-col flex flex-col justify-start text-center">
                      <h2 id="text-center">Barcode</h2>
                    </div>
                  </span>
                  <span className="process-box flex">
                    <span className="field">
                      <h2>Grand:</h2>
                      <h3>{bill?.grandTotal}</h3>
                    </span>
                  </span>
                </span>
                <span className="item-center m-auto flex w-[95%] flex-row justify-between">
                  <span className="flex flex-row items-center justify-between gap-4">
                    <h1>Bill By</h1>
                    <h2>{bill?.billBy?.name}</h2>
                  </span>
                  <h2>Signature</h2>
                </span>
              </>
            ) : (
              <span className="padding-4 border-1 rounded-20 m-auto flex w-[96%] flex-row items-center justify-between gap-4 border-solid">
                <span className="field">
                  <h2>Bill By:</h2>
                  <h3>{bill?.billBy?.name}</h3>
                </span>
                <span className="flex flex-col items-center justify-start">
                  <span className="flex flex-row items-center gap-4">
                    <h2 className="my-2">Date:</h2>
                    <h3 className="my-2">{bill?.date ? formatDSNT(bill?.date) : ''}</h3>
                  </span>
                  <span className="flex flex-row items-center gap-4">
                    <h2 className="my-2">Due Date:</h2>
                    <h3 className="my-2">{bill?.dueDate ? formatDSNT(bill?.dueDate) : ''}</h3>
                  </span>
                </span>
                <span className="field">
                  <h2>Customer Sign</h2>
                </span>
              </span>
            )}
          </span>
        </div>
      )}
      {type === 'Receipt' && (
        <>
          <div className="receipt m-1">
            <h2 className="m-px">{type}</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="card card-side shadow-sm">
                <figure>
                  <Image src={klm.src} width={180} height={180} alt="Profile" />
                </figure>
                <div className="card-body bg-transparent p-2 text-slate-500">
                  <h2 id="header">Kalamandir Ladies boutique</h2>
                  <address>1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208</address>
                </div>
              </div>

              <hr className="w-[90%] border" style={{ width: '90%', borderWidth: '1px' }} />
              <div className="item-center flex w-full flex-col justify-between">
                <span className="field">
                  <h2>Phone:</h2>
                  <h3>9845371322</h3>
                </span>
                <span className="field">
                  <h2>Email:</h2>
                  <h3>kalamandir2106@gmail.com</h3>
                </span>
                <span className="field">
                  <h2>GST No:</h2>
                  <h3></h3>
                </span>
              </div>
              <hr className="w-[90%] border" style={{ width: '90%', borderWidth: '1px' }} />
            </div>
            <table className="w-full border-collapse text-slate-600">
              <tbody>
                <tr>
                  <th>Bill No:</th>
                  <td>{receipt?.bill?.billNumber ?? ''}</td>
                </tr>
                <tr>
                  <th>Receipt No:</th>
                  <td>{receipt?.receiptNumber ?? ''}</td>
                </tr>
                <tr>
                  <th>Receipt Date:</th>
                  <td>{receipt?.paymentDate ? formatDSNT(receipt?.paymentDate) : ''}</td>
                </tr>
                <tr>
                  <th>Customer Name:</th>
                  <td>{receipt?.bill?.name ?? ''}</td>
                </tr>
                <tr>
                  <th>Mobile:</th>
                  <td>{receipt?.bill?.mobile ?? ''}</td>
                </tr>
                <tr>
                  <th>Pay Method:</th>
                  <td>{receipt?.paymentMethod ?? ''}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <table className="w-full border-collapse border-black text-slate-600">
              <thead>
                <tr>
                  <th>SI No</th>
                  <th>Bill No</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{receipt?.bill?.billNumber ?? ''}</td>
                  <td>{receipt?.amount ?? ''}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <table className="w-full border-collapse text-slate-600">
              <tbody>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Total Amount:</th>
                  <td>{cal.totalAmount}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Discount:</th>
                  <td>{cal.discount}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Grand Net:</th>
                  <td>{cal.grandTotal}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Amount Paid:</th>
                  <td>{cal.paidAmount}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Balance:</th>
                  <td>{cal.dueAmount}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <span className="flex flex-col gap-2 text-slate-800">
              <span>Thank You</span>
              {cal.discount > 0 ? <span>{`Hurray You saved ${cal.discount}₹ !`}</span> : ''}
              <span>Visit Again</span>
            </span>
          </div>
        </>
      )}
    </span>
  );
}
