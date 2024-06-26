const navigationData = [
  {
    title: 'Master Record',
    onclick: 'masterRecordDropdown',
    imgSrc: '/apps_logos/docs.svg',
    subNav: [
      { title: 'Form Master', href: '#m1' },
      { title: 'Input Data', href: '#m2' },
      { title: 'Category', href: '/dashboard/master-record/category' },
      { title: 'Work Process', href: '#m4' },
      { title: 'Work Process Style', href: '#m5' },
      { title: 'Work Master', href: '#m6' },
      { title: 'Category Details', href: '#m7' },
      { title: 'Ledger Master', href: '#m8' },
      { title: 'Pay Mode', href: '#m9' },
      { title: 'Discount', href: '#m10' },
      { title: 'Manufacture Master', href: '#m11' },
      { title: 'Distributor Master', href: '#m12' },
      { title: 'Product', href: '#m13' },
      { title: 'Product Stock', href: '#m14' },
      { title: 'No Advance Start', href: '#m15' },
      { title: 'Customer Master', href: '#m16' },
      { title: 'Request', href: '#m17' },
      { title: 'Tax', href: '/dashboard/master-record/tax' },
    ],
  },
  {
    title: 'Inventory',
    onclick: 'inventoryDropdown',
    imgSrc: '/apps_logos/docs.svg',
    subNav: [
      { title: 'Purchase Order', href: '#i1' },
      { title: 'Purchase', href: '#i2' },
      { title: 'Sales', href: '#i3' },
      { title: 'Outward Note', href: '#i4' },
      { title: 'Stock Status', href: '#i5' },
      { title: 'Stock Damage', href: '#i6' },
    ],
  },
  {
    title: 'Work Manage',
    onclick: 'workManageDropdown',
    imgSrc: '/apps_logos/docs.svg',
    subNav: [
      { title: 'New Customer', href: '/dashboard/work-manage/new-customer' },
      { title: 'Bill', href: '/dashboard/work-manage/bill' },
      { title: 'Edit Bill', href: '#w11' },
      { title: 'Photo Gallery', href: '#w2' },
      { title: 'Work Process', href: '#w3' },
      { title: 'Lebeling', href: '#w4' },
      { title: 'Store in', href: '#w5' },
      { title: 'Store out', href: '#w6' },
      { title: 'Bill Status', href: '#w7' },
      { title: 'Bill Status with details', href: '#w8' },
      { title: 'Barcode Sheet', href: '#w9' },
      { title: 'Photo Verification', href: '#w10' },
      { title: 'SMS Verification', href: '#w11' },
      { title: 'Messaging', href: '#w12' },
    ],
  },
  {
    title: 'Staff Manage',
    onclick: 'staffManageDropdown',
    imgSrc: '/apps_logos/docs.svg',
    subNav: [
      { title: 'Company', href: '#company' },
      { title: 'Team', href: '#team' },
      { title: 'Careers', href: '#careers' },
    ],
  },
  {
    title: 'Transaction',
    onclick: 'transactionDropdown',
    imgSrc: '/apps_logos/docs.svg',
    subNav: [
      { title: 'Receipt', href: '/dashboard/transaction/receipt' },
      { title: 'Receipt Credit', href: '#t2' },
      { title: 'Worker Payment', href: '#t3' },
      { title: 'Counter', href: '#t4' },
      { title: 'Accounting', href: '#t5' },
      { title: 'Customer Credit receipt', href: '#t6' },
      { title: 'Profit', href: '#t7' },
      { title: 'Verify order Detail', href: '#t8' },
    ],
  },
  {
    title: 'Report',
    onclick: 'reportDropdown',
    imgSrc: '/apps_logos/docs.svg',
    subNav: [
      { title: 'Bill Details', href: '/dashboard/report/bill-details' },
      { title: 'Receipt Details', href: '/dashboard/report/receipt' },
      { title: 'Worker Details', href: '#r3' },
      { title: 'GST', href: '#r4' },
      { title: 'Payroll Sheet', href: '#r5' },
      { title: 'Bill work status', href: '#r6' },
      { title: 'Bill & Payment Transaction', href: '#r7' },
      { title: 'Inventory', href: '#r8' },
      { title: 'Customer Details', href: '/dashboard/report/customer-details' },
    ],
  },
  {
    title: 'Utility',
    onclick: 'utilityDropdown',
    imgSrc: '/apps_logos/docs.svg',
    subNav: [
      { title: 'Printer Setup', href: '#u1' },
      { title: 'Security', href: '#u2' },
      { title: 'Change Password', href: '#u3' },
      { title: 'Options', href: '#u4' },
      { title: 'Dash Board', href: '#u5' },
      { title: 'Login History', href: '#u6' },
      { title: 'Login Manage', href: '#u7' },
      { title: 'DB Copy', href: '#u8' },
    ],
  },
];

export default navigationData;
