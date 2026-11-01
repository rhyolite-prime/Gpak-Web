// SAMPLE DATA for the CRM backoffice UI.
// The GPAK API exposes quotation detail/approval endpoints, but no list endpoints
// for customers, deals, or production orders yet. Swap these arrays for service
// calls in app/services/crm.ts once those endpoints exist.
import type {
  CrmCustomer,
  CrmDeal,
  CrmProductionOrder,
  CrmQuotation,
} from '~/models/crm';

export const customers: CrmCustomer[] = [
  { id: 'c-101', name: 'Lakeview Academy', contact: 'Abena Owusu', email: 'a.owusu@lakeview.edu.gh', phone: '+233 24 410 2290', city: 'Accra', segment: 'Education', status: 'Active', owner: 'Ama Boateng', lifetimeValue: 186400, lastContact: '2026-10-29' },
  { id: 'c-102', name: 'Savannah Dairy Co.', contact: 'Kofi Asante', email: 'kofi@savannahdairy.com', phone: '+233 27 881 4410', city: 'Tamale', segment: 'Corporate', status: 'Active', owner: 'Yaw Mensah', lifetimeValue: 412900, lastContact: '2026-10-30' },
  { id: 'c-103', name: 'Sankofa Publishing House', contact: 'Efua Darko', email: 'efua@sankofapress.gh', phone: '+233 20 555 0187', city: 'Accra', segment: 'Publisher', status: 'Active', owner: 'Ama Boateng', lifetimeValue: 955300, lastContact: '2026-10-31' },
  { id: 'c-104', name: 'Coastline Pharmacy', contact: 'Nana Ampofo', email: 'nana@coastlinepharm.com', phone: '+233 54 219 7730', city: 'Takoradi', segment: 'Retail', status: 'Active', owner: 'Yaw Mensah', lifetimeValue: 74250, lastContact: '2026-10-24' },
  { id: 'c-105', name: 'Golden Stool Beverages', contact: 'Ruth Addo', email: 'ruth@goldenstool.gh', phone: '+233 26 730 1120', city: 'Kumasi', segment: 'Corporate', status: 'Prospect', owner: 'Kwame Osei', lifetimeValue: 0, lastContact: '2026-10-28' },
  { id: 'c-106', name: 'Baobab Foods Ltd', contact: 'Samuel Tetteh', email: 'stetteh@baobabfoods.com', phone: '+233 24 690 5514', city: 'Tema', segment: 'Corporate', status: 'Active', owner: 'Kwame Osei', lifetimeValue: 263800, lastContact: '2026-10-27' },
  { id: 'c-107', name: 'Adomi Tech Labs', contact: 'Gifty Quaye', email: 'gifty@adomitech.io', phone: '+233 50 388 2041', city: 'Accra', segment: 'Corporate', status: 'Prospect', owner: 'Ama Boateng', lifetimeValue: 0, lastContact: '2026-10-31' },
  { id: 'c-108', name: 'Bright Future Foundation', contact: 'Daniel Otoo', email: 'daniel@brightfuture.org', phone: '+233 30 277 9981', city: 'Cape Coast', segment: 'NGO', status: 'Dormant', owner: 'Yaw Mensah', lifetimeValue: 39800, lastContact: '2026-07-14' },
  { id: 'c-109', name: 'Oasis Cosmetics Ltd', contact: 'Akosua Frimpong', email: 'akosua@oasiscosmetics.com', phone: '+233 24 512 6603', city: 'Accra', segment: 'Retail', status: 'Active', owner: 'Kwame Osei', lifetimeValue: 128700, lastContact: '2026-10-22' },
  { id: 'c-110', name: 'Tema Freight Partners', contact: 'Isaac Lartey', email: 'isaac@temafreight.com', phone: '+233 20 874 3317', city: 'Tema', segment: 'Corporate', status: 'Prospect', owner: 'Yaw Mensah', lifetimeValue: 0, lastContact: '2026-10-26' },
];

export const deals: CrmDeal[] = [
  { id: 'd-201', title: '2026 Annual Report (5,000 copies)', customerId: 'c-103', customerName: 'Sankofa Publishing House', service: 'Book Printing', value: 84500, stage: 'Negotiation', owner: 'Ama Boateng', expectedClose: '2026-11-12' },
  { id: 'd-202', title: 'Yogurt carton packaging, 3 SKUs', customerId: 'c-102', customerName: 'Savannah Dairy Co.', service: 'Packaging', value: 136200, stage: 'Quoted', owner: 'Yaw Mensah', expectedClose: '2026-11-20' },
  { id: 'd-203', title: 'Product labels — hair care range', customerId: 'c-109', customerName: 'Oasis Cosmetics Ltd', service: 'Labels & Stickers', value: 27900, stage: 'Won', owner: 'Kwame Osei', expectedClose: '2026-10-28' },
  { id: 'd-204', title: 'Term-end exam booklets', customerId: 'c-101', customerName: 'Lakeview Academy', service: 'Book Printing', value: 46300, stage: 'Enquiry', owner: 'Ama Boateng', expectedClose: '2026-11-30' },
  { id: 'd-205', title: 'Launch posters & flyers', customerId: 'c-105', customerName: 'Golden Stool Beverages', service: 'Posters & Flyers', value: 18750, stage: 'Enquiry', owner: 'Kwame Osei', expectedClose: '2026-11-08' },
  { id: 'd-206', title: 'Corporate stationery refresh', customerId: 'c-106', customerName: 'Baobab Foods Ltd', service: 'Commercial Printing', value: 22400, stage: 'Won', owner: 'Kwame Osei', expectedClose: '2026-10-22' },
  { id: 'd-207', title: 'Pharmacy dispensing bags', customerId: 'c-104', customerName: 'Coastline Pharmacy', service: 'Packaging', value: 31600, stage: 'Quoted', owner: 'Yaw Mensah', expectedClose: '2026-11-15' },
  { id: 'd-208', title: 'Brand guidelines print pack', customerId: 'c-107', customerName: 'Adomi Tech Labs', service: 'Commercial Printing', value: 9800, stage: 'Enquiry', owner: 'Ama Boateng', expectedClose: '2026-11-05' },
  { id: 'd-209', title: 'Freight waybill books', customerId: 'c-110', customerName: 'Tema Freight Partners', service: 'Commercial Printing', value: 14250, stage: 'Negotiation', owner: 'Yaw Mensah', expectedClose: '2026-11-10' },
  { id: 'd-210', title: 'Community awareness calendars', customerId: 'c-108', customerName: 'Bright Future Foundation', service: 'Posters & Flyers', value: 11600, stage: 'Lost', owner: 'Yaw Mensah', expectedClose: '2026-10-18' },
  { id: 'd-211', title: 'Mini-cartons for soap bars', customerId: 'c-109', customerName: 'Oasis Cosmetics Ltd', service: 'Packaging', value: 58300, stage: 'Quoted', owner: 'Kwame Osei', expectedClose: '2026-11-18' },
  { id: 'd-212', title: 'Textbook reprint — Grade 6', customerId: 'c-103', customerName: 'Sankofa Publishing House', service: 'Book Printing', value: 212000, stage: 'Won', owner: 'Ama Boateng', expectedClose: '2026-10-15' },
];

export const quotations: CrmQuotation[] = [
  { id: 'q-1001', number: 'QT-2026-1187', customerName: 'Savannah Dairy Co.', service: 'Packaging', amount: 136200, status: 'Sent', issuedOn: '2026-10-29', validUntil: '2026-11-28' },
  { id: 'q-1002', number: 'QT-2026-1188', customerName: 'Coastline Pharmacy', service: 'Packaging', amount: 31600, status: 'Awaiting Approval', issuedOn: '2026-10-30', validUntil: '2026-11-29' },
  { id: 'q-1003', number: 'QT-2026-1189', customerName: 'Oasis Cosmetics Ltd', service: 'Packaging', amount: 58300, status: 'Draft', issuedOn: '2026-10-31', validUntil: '2026-11-30' },
  { id: 'q-1004', number: 'QT-2026-1181', customerName: 'Sankofa Publishing House', service: 'Book Printing', amount: 84500, status: 'Customer Approved', issuedOn: '2026-10-19', validUntil: '2026-11-18' },
  { id: 'q-1005', number: 'QT-2026-1177', customerName: 'Tema Freight Partners', service: 'Commercial Printing', amount: 14250, status: 'Sent', issuedOn: '2026-10-21', validUntil: '2026-11-20' },
  { id: 'q-1006', number: 'QT-2026-1172', customerName: 'Bright Future Foundation', service: 'Posters & Flyers', amount: 11600, status: 'Customer Rejected', issuedOn: '2026-10-08', validUntil: '2026-11-07' },
  { id: 'q-1007', number: 'QT-2026-1190', customerName: 'Lakeview Academy', service: 'Book Printing', amount: 46300, status: 'Draft', issuedOn: '2026-11-01', validUntil: '2026-12-01' },
];

export const productionOrders: CrmProductionOrder[] = [
  { id: 'po-1', orderNumber: 'JO-44021', customerName: 'Sankofa Publishing House', service: 'Book Printing', quantity: 12000, stageIndex: 1, dueDate: '2026-11-06', priority: 'Rush' },
  { id: 'po-2', orderNumber: 'JO-44024', customerName: 'Oasis Cosmetics Ltd', service: 'Labels & Stickers', quantity: 40000, stageIndex: 3, dueDate: '2026-11-03', priority: 'Normal' },
  { id: 'po-3', orderNumber: 'JO-44027', customerName: 'Baobab Foods Ltd', service: 'Commercial Printing', quantity: 3500, stageIndex: 0, dueDate: '2026-11-09', priority: 'Normal' },
  { id: 'po-4', orderNumber: 'JO-44030', customerName: 'Savannah Dairy Co.', service: 'Packaging', quantity: 25000, stageIndex: 2, dueDate: '2026-11-05', priority: 'Rush' },
  { id: 'po-5', orderNumber: 'JO-44033', customerName: 'Coastline Pharmacy', service: 'Packaging', quantity: 8000, stageIndex: 4, dueDate: '2026-10-31', priority: 'Normal' },
  { id: 'po-6', orderNumber: 'JO-44036', customerName: 'Lakeview Academy', service: 'Book Printing', quantity: 6000, stageIndex: 0, dueDate: '2026-11-14', priority: 'Normal' },
];

/** Sample monthly bookings (GH₵) for the dashboard chart. */
export const monthlyBookings: { month: string; value: number }[] = [
  { month: 'May', value: 142000 },
  { month: 'Jun', value: 198500 },
  { month: 'Jul', value: 121300 },
  { month: 'Aug', value: 233800 },
  { month: 'Sep', value: 187400 },
  { month: 'Oct', value: 264900 },
];
