// Types for the GPAK CRM backoffice.

export type ServiceLine =
  | 'Commercial Printing'
  | 'Book Printing'
  | 'Packaging'
  | 'Labels & Stickers'
  | 'Posters & Flyers';

export type CustomerSegment = 'Corporate' | 'Publisher' | 'Retail' | 'Education' | 'NGO';

export type CustomerStatus = 'Active' | 'Prospect' | 'Dormant';

export interface CrmCustomer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  segment: CustomerSegment;
  status: CustomerStatus;
  owner: string;
  lifetimeValue: number;
  lastContact: string; // ISO date
}

export type DealStage = 'Enquiry' | 'Quoted' | 'Negotiation' | 'Won' | 'Lost';

export interface CrmDeal {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  service: ServiceLine;
  value: number;
  stage: DealStage;
  owner: string;
  expectedClose: string; // ISO date
}

export type QuotationStatus =
  | 'Draft'
  | 'Awaiting Approval'
  | 'Sent'
  | 'Customer Approved'
  | 'Customer Rejected';

export interface CrmQuotation {
  id: string;
  number: string;
  customerName: string;
  service: ServiceLine;
  amount: number;
  status: QuotationStatus;
  issuedOn: string; // ISO date
  validUntil: string; // ISO date
}

export const PRODUCTION_STAGES = [
  'Prepress',
  'Printing',
  'Finishing',
  'Quality Check',
  'Dispatch',
] as const;

export type ProductionStage = (typeof PRODUCTION_STAGES)[number];

export interface CrmProductionOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  service: ServiceLine;
  quantity: number;
  stageIndex: number; // index into PRODUCTION_STAGES
  dueDate: string; // ISO date
  priority: 'Normal' | 'Rush';
}
