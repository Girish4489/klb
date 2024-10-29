import {
  ChartBarIcon,
  UserPlusIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CogIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  KeyIcon,
  LockClosedIcon,
  ServerStackIcon,
  SquaresPlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';

export interface SubNavItem {
  title: string;
  href?: string;
  enable: boolean;
  icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
}

export interface NavItem {
  title: string;
  onclick: string;
  imgSrc: string;
  enable: boolean;
  icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
  subNav: SubNavItem[];
}

const subIconClass: string = 'h-5 w-5 text-primary';
const navIconClass: string = 'h-5 w-5 text-secondary';

const masterRecordNav: NavItem = {
  title: 'Master Record',
  onclick: 'masterRecordDropdown',
  imgSrc: '/apps_logos/docs.svg',
  enable: true,
  icon: DocumentIcon,
  iconClass: navIconClass,
  subNav: [
    { title: 'Form Master', href: '#m1', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Input Data', href: '#m2', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    {
      title: 'Category',
      href: '/dashboard/master-record/category',
      enable: true,
      icon: TagIcon,
      iconClass: subIconClass,
    },
    { title: 'Work Process', href: '#m4', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Work Process Style', href: '#m5', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Work Master', href: '#m6', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Category Details', href: '#m7', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Ledger Master', href: '#m8', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Pay Mode', href: '#m9', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Discount', href: '#m10', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Manufacture Master', href: '#m11', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Distributor Master', href: '#m12', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Product', href: '#m13', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Product Stock', href: '#m14', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'No Advance Start', href: '#m15', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Customer Master', href: '#m16', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Request', href: '#m17', enable: false, icon: DocumentIcon, iconClass: subIconClass },
    { title: 'Tax', href: '/dashboard/master-record/tax', enable: true, icon: DocumentIcon, iconClass: subIconClass },
  ],
};

const inventoryNav: NavItem = {
  title: 'Inventory',
  onclick: 'inventoryDropdown',
  imgSrc: '/apps_logos/docs.svg',
  enable: false,
  icon: ClipboardDocumentListIcon,
  iconClass: navIconClass,
  subNav: [
    { title: 'Purchase Order', href: '#i1', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'Purchase', href: '#i2', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'Sales', href: '#i3', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'Outward Note', href: '#i4', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'Stock Status', href: '#i5', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'Stock Damage', href: '#i6', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
  ],
};

const workManageNav: NavItem = {
  title: 'Work Manage',
  onclick: 'workManageDropdown',
  imgSrc: '/apps_logos/docs.svg',
  enable: true,
  icon: ChartBarIcon,
  iconClass: navIconClass,
  subNav: [
    {
      title: 'New Customer',
      href: '/dashboard/work-manage/new-customer',
      enable: true,
      icon: UserPlusIcon,
      iconClass: subIconClass,
    },
    { title: 'Bill', href: '/dashboard/work-manage/bill', enable: true, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Edit Bill', href: '#w11', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Photo Gallery', href: '#w2', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Work Process', href: '#w3', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Lebeling', href: '#w4', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Store in', href: '#w5', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Store out', href: '#w6', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Bill Status', href: '#w7', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Bill Status with details', href: '#w8', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Barcode Sheet', href: '#w9', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Photo Verification', href: '#w10', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'SMS Verification', href: '#w11', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
    { title: 'Messaging', href: '#w12', enable: false, icon: ChartBarIcon, iconClass: subIconClass },
  ],
};

const staffManageNav: NavItem = {
  title: 'Staff Manage',
  onclick: 'staffManageDropdown',
  imgSrc: '/apps_logos/docs.svg',
  enable: false,
  icon: UserGroupIcon,
  iconClass: navIconClass,
  subNav: [
    { title: 'Company', href: '#company', enable: false, icon: UserGroupIcon, iconClass: subIconClass },
    { title: 'Team', href: '#team', enable: false, icon: UserGroupIcon, iconClass: subIconClass },
    { title: 'Careers', href: '#careers', enable: false, icon: UserGroupIcon, iconClass: subIconClass },
  ],
};

const transactionNav: NavItem = {
  title: 'Transaction',
  onclick: 'transactionDropdown',
  imgSrc: '/apps_logos/docs.svg',
  enable: true,
  icon: CurrencyDollarIcon,
  iconClass: navIconClass,
  subNav: [
    {
      title: 'Receipt',
      href: '/dashboard/transaction/receipt',
      enable: true,
      icon: CurrencyDollarIcon,
      iconClass: subIconClass,
    },
    { title: 'Receipt Credit', href: '#t2', enable: false, icon: CurrencyDollarIcon, iconClass: subIconClass },
    { title: 'Worker Payment', href: '#t3', enable: false, icon: CurrencyDollarIcon, iconClass: subIconClass },
    { title: 'Counter', href: '#t4', enable: false, icon: CurrencyDollarIcon, iconClass: subIconClass },
    { title: 'Accounting', href: '#t5', enable: false, icon: CurrencyDollarIcon, iconClass: subIconClass },
    { title: 'Customer Credit receipt', href: '#t6', enable: false, icon: CurrencyDollarIcon, iconClass: subIconClass },
    { title: 'Profit', href: '#t7', enable: false, icon: CurrencyDollarIcon, iconClass: subIconClass },
    { title: 'Verify order Detail', href: '#t8', enable: false, icon: CurrencyDollarIcon, iconClass: subIconClass },
  ],
};

const reportNav: NavItem = {
  title: 'Report',
  onclick: 'reportDropdown',
  imgSrc: '/apps_logos/docs.svg',
  enable: true,
  icon: ClipboardDocumentListIcon,
  iconClass: navIconClass,
  subNav: [
    {
      title: 'Bill Details',
      href: '/dashboard/report/bill-details',
      enable: true,
      icon: ClipboardDocumentListIcon,
      iconClass: subIconClass,
    },
    {
      title: 'Receipt Details',
      href: '/dashboard/report/receipt',
      enable: true,
      icon: ClipboardDocumentListIcon,
      iconClass: subIconClass,
    },
    { title: 'Worker Details', href: '#r3', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'GST', href: '#r4', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'Payroll Sheet', href: '#r5', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    { title: 'Bill work status', href: '#r6', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    {
      title: 'Bill & Payment Transaction',
      href: '#r7',
      enable: false,
      icon: ClipboardDocumentListIcon,
      iconClass: subIconClass,
    },
    { title: 'Inventory', href: '#r8', enable: false, icon: ClipboardDocumentListIcon, iconClass: subIconClass },
    {
      title: 'Customer Details',
      href: '/dashboard/report/customer-details',
      enable: true,
      icon: ClipboardDocumentListIcon,
      iconClass: subIconClass,
    },
  ],
};

const utilityNav: NavItem = {
  title: 'Utility',
  onclick: 'utilityDropdown',
  imgSrc: '/apps_logos/docs.svg',
  enable: false,
  icon: CogIcon,
  iconClass: navIconClass,
  subNav: [
    { title: 'Printer Setup', href: '#u1', enable: false, icon: CogIcon, iconClass: subIconClass },
    { title: 'Security', href: '#u2', enable: false, icon: LockClosedIcon, iconClass: subIconClass },
    { title: 'Change Password', href: '#u3', enable: false, icon: KeyIcon, iconClass: subIconClass },
    { title: 'Options', href: '#u4', enable: false, icon: CogIcon, iconClass: subIconClass },
    { title: 'Dash Board', href: '#u5', enable: false, icon: SquaresPlusIcon, iconClass: subIconClass },
    { title: 'Login History', href: '#u6', enable: false, icon: ClockIcon, iconClass: subIconClass },
    { title: 'Login Manage', href: '#u7', enable: false, icon: LockClosedIcon, iconClass: subIconClass },
    { title: 'DB Copy', href: '#u8', enable: false, icon: ServerStackIcon, iconClass: subIconClass },
  ],
};

const navigationData: NavItem[] = [
  masterRecordNav,
  inventoryNav,
  workManageNav,
  staffManageNav,
  transactionNav,
  reportNav,
  utilityNav,
];

export default navigationData;
