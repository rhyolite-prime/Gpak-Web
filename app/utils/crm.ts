import type { CrmDeal, CrmProductionOrder, CrmQuotation, CustomerStatus, DealStage, QuotationStatus } from '~/models/crm';

/** Format a Ghana cedi amount, e.g. "GH₵ 1,250,000". */
export const formatGHS = (value: number, compact = false) => {
  if (compact && Math.abs(value) >= 1000) {
    const formatter = new Intl.NumberFormat('en-GH', { notation: 'compact', maximumFractionDigits: 1 });
    return `GH₵ ${formatter.format(value)}`;
  }
  return `GH₵ ${new Intl.NumberFormat('en-GH', { maximumFractionDigits: 0 }).format(value)}`;
};

/** "12 Nov 2026" style date from an ISO date string. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Human relative label such as "Today", "3 days ago", "in 5 days". Relative to 2026-11-01. */
export const relativeDays = (iso: string, today = '2026-11-01') => {
  const diff = Math.round((new Date(`${iso}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return diff > 0 ? `in ${diff} days` : `${Math.abs(diff)} days ago`;
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export type Tone = 'brand' | 'emerald' | 'sky' | 'amber' | 'rose' | 'slate' | 'violet';

export const customerStatusTone = (status: CustomerStatus): Tone =>
  ({ Active: 'emerald', Prospect: 'sky', Dormant: 'slate' } as const)[status];

export const dealStageTone = (stage: DealStage): Tone =>
  ({ Enquiry: 'sky', Quoted: 'violet', Negotiation: 'amber', Won: 'emerald', Lost: 'rose' } as const)[stage];

export const quotationStatusTone = (status: QuotationStatus): Tone =>
  ({
    Draft: 'slate',
    'Awaiting Approval': 'amber',
    Sent: 'sky',
    'Customer Approved': 'emerald',
    'Customer Rejected': 'rose',
  } as const)[status];

/** Classes for a status pill, keyed by tone. */
export const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-100 text-brand-800 ring-brand-300/60',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  sky: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  rose: 'bg-rose-50 text-rose-700 ring-rose-600/15',
  slate: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/15',
};

export const avatarTones = [
  'bg-brand-100 text-brand-800',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-800',
];

export const avatarTone = (name: string) => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return avatarTones[hash % avatarTones.length];
};

export const pipelineValue = (list: CrmDeal[]) =>
  list.filter((d) => d.stage !== 'Lost' && d.stage !== 'Won').reduce((sum, d) => sum + d.value, 0);

export const isOverdue = (order: CrmProductionOrder, today = '2026-11-01') =>
  order.stageIndex < 4 && order.dueDate < today;

export const quotationsOutstanding = (list: CrmQuotation[]) =>
  list.filter((q) => q.status === 'Sent' || q.status === 'Awaiting Approval').length;
