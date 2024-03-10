import { formatDateWithSlash, formatDateWithSlashWithoutTime } from '@/app/util/format/dateUtils';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { IBill, IReceipt } from '@/models/klm';
import toast from 'react-hot-toast';
import klm from '../../public/klm.png';

export const printDocument = async (billNumber: number, type: string) => {
  let style = '';
  let htmlContent = '';
  let htmlConcate;
  // Define print options for A4 sheets
  const a4PrintOptions = `
    size: A4 portrait;
    margin: 1cm;
  `;

  // Define print options for thermal printer (adjust these according to your printer specifications)
  const thermalPrintOptions = `
    size: Custom;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    width: 80mm;
    height: auto;
  `;

  // Determine print options based on the type of document
  let printOptions = '';
  const cal: {
    totalAmount: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    dueAmount: number;
  } = {
    totalAmount: 0,
    discount: 0,
    grandTotal: 0,
    paidAmount: 0,
    dueAmount: 0,
  };
  if (!type) {
    toast.error('Print type is required');
    return;
  }
  async function getBillData(type: string, billNumber: number) {
    if (type === 'Customer Bill' || type === 'Worker Bill') {
      if (!billNumber) {
        toast.error('Bill number is required');
        return;
      }
      printOptions = a4PrintOptions;
      // Fetch the bill data from the server
      const response = await ApiGet.printDocument.PrintBill(type, billNumber);
      if (response.success === false) {
        toast.error(response.message);
        return;
      }
      return response.bill;
    }
  }

  async function getReceiptData(type: string, receiptNumber: number) {
    if (type === 'Receipt') {
      if (!receiptNumber) {
        toast.error('Receipt number is required');
        return;
      }
      printOptions = thermalPrintOptions;
      // Fetch the receipt data from the server
      const response = await ApiGet.printDocument.PrintReceipt(type, receiptNumber);
      if (response.success === false) {
        toast.error(response.message);
        return;
      }

      if (response.bill) {
        cal.totalAmount = response.bill.totalAmount || 0;
        cal.discount = response.bill.discount || 0;
        cal.grandTotal = response.bill.grandTotal || 0;
        cal.paidAmount = response.bill.paidAmount || 0;
        cal.dueAmount = response.bill.dueAmount || 0;
      }
      return response.receipt;
    }
  }

  let data: any;
  if (type === 'Customer Bill' || type === 'Worker Bill') {
    data = await getBillData(type, billNumber);
  } else if (type === 'Receipt') {
    data = await getReceiptData(type, billNumber);
  }
  if (!data) {
    return;
  }

  style = `
  /* Reset default styles */
body {
	margin: 0;
	padding: 0;
}

/* Add your custom styles here */
body {
	font: 12px Georgia, "Times New Roman", Times, serif;
	color: #333;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	font: bold 100% Georgia, "Times New Roman", Times, serif;
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
	font: bold 100% Georgia, "Times New Roman", Times, serif;
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


@page { ${printOptions} }

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

`;

  // Create the HTML content for the bill or receipt

  if (type === 'Customer Bill' || type === 'Worker Bill') {
    const bill: IBill = data;
    htmlContent = `
      <div class="flex flex-col justify-between gap-2 mx-2 " style="height: 100%; margin-bottom: 0;">
			<span class="grow gap-2 flex flex-col grow-1">
				<h4 class="billType">${type}</h4>
				<div class="header-box">
					<div class="flex flex-row items-center justify-between">
						<div class="flex flex-row item-center gap-4">
							<span class="profile">
								<img src="${klm.src}" alt="Profile">
							</span>
							<hr>
              ${
                type === 'Customer Bill'
                  ? `
							<span class="flex flex-col items-center justify-center">
								<h2 id="header">Kalamandir Ladies boutique</h2>
								<address>1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208</address>
							</span>`
                  : `<div class="header-col text-center flex flex-col justify-start w-50per">
							<h2 id="text-center">Barcode</h2>
						</div>`
              }
						</div>
            ${
              type === 'Customer Bill'
                ? `
						<hr>
						<div class="flex flex-col item-center justify-between">
							<span class="field">
								<h2>Phone:</h2>
								<h3>9845371322</h3>
							</span>
							<span class="field">
								<h2>Email:</h2>
								<h3>kalamandir2106@gmail.com</h3>
							</span>
							<span class="field">
								<h2>GST No:</h2>
								<h3></h3>
							</span>
						</div>`
                : `
              <div class="flex flex-col item-center justify-between">
                <span class="field">
                  <h2>Bill No:</h2>
                  <h3>${bill.billNumber}</h3>
                </span>
                <span class="field">
                  <h2>Bill By:</h2>
                  <h3>${bill.billBy?.name}</h3>
                </span>
                <span class="field">
                  <h2>Due Date:</h2>
                  <h3>${bill?.dueDate ? formatDateWithSlash(bill?.dueDate) : ''}</h3>
                </span>
              </div>
            `
            }
					</div>
          ${
            type === 'Customer Bill' &&
            `
					<hr>
					<div class="flex flex-row justify-between">
						<div class="customer-details grow">
							<span class="field">
								<h2>Bill No:</h2>
								<h3>${bill.billNumber}</h3>
							</span>
							<span class="field">
								<h2>Bill Date:</h2>
								<h3>${bill?.date ? formatDateWithSlash(bill?.date) : ''}</h3>
							</span>
              <span class="field">
                <h2>Name:</h2>
                <h3>${bill?.name}</h3>
              </span>
							<span class="field">
								<h2>Due Date:</h2>
								<h3>${bill?.dueDate ? formatDateWithSlash(bill?.dueDate) : ''}</h3>
							</span>
							<span class="field">
								<h2>Mobile:</h2>
								<h3>${bill?.mobile}</h3>
							</span>
							<span class="field">
								<h2>Email:</h2>
								<h3>${bill?.email}</h3>
							</span>
							<span class="field address">
								<h2>Address:</h2>
								<h3></h3>
							</span>
						</div>
						<hr>
						<div class="header-col text-center flex flex-col justify-start w-50per">
							<h2 id="text-center">Barcode</h2>
						</div>
					</div>`
          }
				</div>
        ${bill.order.map(
          (order, orderIndex) => `<div class="flex flex-col header-box order-details">

					<span class="flex flex-row gap-8 items-center justify-between">
						<span class="flex flex-row gap-8 items-center">
							<h1>${orderIndex + 1}.</h1>
              <span class="flex flex-row gap-4 items-center">
                <h1>Category:</h1>
                <h2>${order.category?.categoryName}</h2>
              </span>
						</span>
            <span class="flex flex-row gap-8 items-center justify-center">
							<h1>Work:</h1>
							<h2>${order.work ? 'Yes' : 'No'}</h2>
						</span>
            <span class="flex flex-row gap-8 items-center justify-center">
							<h1>Qr Code:</h1>
							<h2>${order.barcode ? 'Yes' : 'No'}</h2>
						</span>
            ${
              type === 'Customer Bill' &&
              `<span class="flex flex-row gap-8 items-center justify-center">
                <h1>Amount:</h1>
                <h2>${order.amount}</h2>
              </span>`
            }
					</span>
					<hr style="margin: 0%; padding: 0%;">
					<span class="flex flex-row gap-8 items-center">
						<h1>Styles:</h1>
            ${order.styleProcess.map(
              (style, styleIndex) => `
            <span class="flex flex-col item-center justify-start process-box grow-1">
              <span class="flex flex-row gap-8 items-center justify-around">
                <h1>${styleIndex + 1}). ${style.styleProcessName}</h1>
                <hr>
                <h2>${style.styleName}</h2>
              </span>
            </span>`,
            )}
					</span>
					<hr style="margin: 0%; padding: 0%;">
					<span class="flex flex-row gap-8 items-center">
						<h1>Measurement:</h1>
						<h2>${order.measurement}</h2>
					</span>
					<hr style="margin: 0%; padding: 0%;">
					<span class="flex flex-row gap-8 items-center">
            ${order.dimension.map(
              (dimension, dimensionIndex) => `
            <span class="flex flex-col item-center justify-start process-box grow-1">
							<span class="flex flex-row gap-8 items-center justify-around">
								<h1>${dimensionIndex + 1}). ${dimension.dimensionTypeName}</h1>
								<hr>
								<h2>${dimension.dimensionName}</h2>
							</span>
							<hr style="width: 100%; margin: 0%; padding: 0%;">
							<span class="flex flex-row gap-8 items-center justify-center">
								<h1>${dimension.note}</h1>
							</span>
						</span>`,
            )}

					</span>
				</div>`,
        )}
			</span>
      <span class="flex flex-col gap-2 footer mx-8">
        ${
          type === 'Customer Bill'
            ? `

          <hr style="width: 95%; border: 1px solid;">
          <span class="flex flex-row w-full items-start justify-between gap-2">
            <span class="process-box">
              <span class="field">
                <h2>Total:</h2>
                <h3>${bill.totalAmount}</h3>
              </span>
              <span class="field">
                <h2>Discount:</h2>
                <h3>${bill.discount}</h3>
              </span>
              <span class="field">
                <h2>Tax:</h2>
                <h3>000</h3>
              </span>

            </span>
            <span class="process-box grow-1">
              <div class="header-col text-center flex flex-col justify-start">
                <h2 id="text-center">Barcode</h2>
              </div>
            </span>
            <span class="process-box flex">
              <span class="field">
                <h2>Grand:</h2>
                <h3>${bill.grandTotal}</h3>
              </span>
            </span>
          </span>
          <span class="flex flex-row justify-between item-center" style="margin: 0 5px 0 5px; padding: auto;">
            <span class="flex flex-row items-center gap-4 justify-between">
              <h1>Bill By</h1>
              <h2>${bill.billBy?.name}</h2>
            </span>
            <h2>Signature</h2>
          </span>
        </span>
        `
            : `
        <span class="flex flex-row items-center justify-between gap-4 mx-8 padding-4" style="border: 1px solid; border-radius: 20px;">
          <span class="field">
            <h2>Bill By:</h2>
            <h3>${bill.billBy?.name}</h3>
          </span>
          <span class="flex flex-col items-center justify-start">
            <span class="flex flex-row items-center gap-4">
              <h2 class="my-2">Date:</h2>
              <h3 class="my-2">${bill?.date ? formatDateWithSlashWithoutTime(bill?.date) : ''}</h3>
            </span>
            <span class="flex flex-row items-center gap-4">
              <h2 class="my-2">Due Date:</h2>
              <h3 class="my-2">${bill?.dueDate ? formatDateWithSlashWithoutTime(bill?.dueDate) : ''}</h3>
            </span>
          </span>
          <span class="field">
            <h2>Customer Sign</h2>
          </span>

        `
        }
      </span>
		</div>
    `;
  } else if (type === 'Receipt' || (data as IReceipt)) {
    const receipt: IReceipt = data;
    htmlContent = `
		<div class="receipt">
			<h2 style="margin: 1px;">${type}</h2>
			<div class="flex flex-col items-center gap-2">
				<div class="flex flex-row item-center gap-4">
					<span class="profile">
						<img src="${klm.src}" alt="Profile">
					</span>
					<hr>
					<span class="flex flex-col items-center justify-center">
						<h2 id="header">Kalamandir Ladies boutique</h2>
						<address>1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208</address>
					</span>
				</div>
				<hr style="width: 90%; border-width: 1px;">
				<div class="flex flex-col item-center justify-between">
					<span class="field">
						<h2>Phone:</h2>
						<h3>9845371322</h3>
					</span>
					<span class="field">
						<h2>Email:</h2>
						<h3>kalamandir2106@gmail.com</h3>
					</span>
					<span class="field">
						<h2>GST No:</h2>
						<h3></h3>
					</span>
				</div>
				<hr style="width: 90%; border-width: 1px;">
			</div>
			<table style="border-collapse: collapse; width: 100%;">
				<tbody>
					<tr>
						<th>Bill No:</th>
						<td>${receipt.bill?.billNumber ?? ''}</td>
					</tr>
					<tr>
						<th>Receipt No:</th>
						<td>${receipt.receiptNumber ?? ''}</td>
					</tr>
					<tr>
						<th>Receipt Date:</th>
						<td>${receipt.paymentDate ? formatDateWithSlashWithoutTime(receipt.paymentDate) : ''}</td>
					</tr>
					<tr>
						<th>Customer Name:</th>
						<td>${receipt.bill?.name ?? ''}</td>
					</tr>
					<tr>
						<th>Mobile:</th>
						<td>${receipt.bill?.mobile ?? ''}</td>
					</tr>
					<tr>
						<th>Pay Method:</th>
						<td>${receipt.paymentMethod ?? ''}</td>
					</tr>
				</tbody>
			</table>
			<hr>
			<table style="border-collapse: collapse; width: 100%;">
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
						<td>${receipt.bill?.billNumber ?? ''}</td>
						<td>${receipt.amount ?? ''}</td>
					</tr>
				</tbody>
			</table>
			<hr>
			<table style="border-collapse: collapse; width: 100%;">
				<tbody>
					<tr class="flex flex-row w-full items-center justify-between">
						<th>Total Amount:</th>
						<td>${cal.totalAmount}</td>
					</tr>
					<tr class="flex flex-row w-full items-center justify-between">
						<th>Discount:</th>
						<td>${cal.discount}</td>
					</tr>
					<tr class="flex flex-row w-full items-center justify-between">
						<th>Grand Net:</th>
						<td>${cal.grandTotal}</td>
					</tr>
					<tr class="flex flex-row w-full items-center justify-between">
						<th>Amount Paid:</th>
						<td>${cal.paidAmount}</td>
					</tr>
					<tr class="flex flex-row w-full items-center justify-between">
						<th>Balance:</th>
						<td>${cal.dueAmount}</td>
					</tr>
				</tbody>
			</table>
			<hr>
			<span class="flex flex-col gap-2">
				<span>Thank You</span>
       ${cal.discount > 0 ? `<span>Hurray You saved ${cal.discount}₹ !</span>` : ''}
				<span>Visit Again</span>
			</span>
		</div>
    `;
  }

  // html format
  htmlConcate = `
  <html>
  <head>
    <title>${type}</title>
    <style>
      ${style}
    </style>
  </head>
  <body>
    ${htmlContent}
  </body>
  </html>
  `;

  // Open a new window and write the complete HTML content to it
  const printWindow = window.open('', '_blank');
  printWindow?.document.write(htmlConcate);
  printWindow?.document.close();
  // Delay printing to ensure all content is loaded
  setTimeout(() => {
    printWindow?.print();
  }, 600);
};
