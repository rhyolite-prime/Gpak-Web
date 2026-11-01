<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowRight, FileSearch, Info } from 'lucide-vue-next';
import { quotations } from '~/data/crm';
import type { QuotationStatus } from '~/models/crm';

definePageMeta({ layout: 'backoffice' });
useHead({ title: 'Quotations · GPAK CRM' });

const statusFilter = ref<'All' | QuotationStatus>('All');
const statuses: ('All' | QuotationStatus)[] = ['All', 'Draft', 'Awaiting Approval', 'Sent', 'Customer Approved', 'Customer Rejected'];

const lookupId = ref('');
const openQuotation = () => {
  const id = lookupId.value.trim();
  if (id) navigateTo(`/backoffice/quotations/${encodeURIComponent(id)}`);
};

const rows = computed(() =>
  quotations.filter((q) => statusFilter.value === 'All' || q.status === statusFilter.value),
);

const summary = computed(() => ({
  open: quotations.filter((q) => q.status === 'Sent' || q.status === 'Awaiting Approval').length,
  approved: quotations.filter((q) => q.status === 'Customer Approved').length,
  value: quotations
    .filter((q) => q.status === 'Sent' || q.status === 'Awaiting Approval')
    .reduce((s, q) => s + q.amount, 0),
}));
</script>

<template>
  <div class="space-y-6">
    <BackofficePageHeader eyebrow="Operations" title="Quotations" description="Track every quotation issued to a customer, from draft to customer decision." />

    <!-- Lookup card -->
    <section class="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-float sm:p-7">
      <div class="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-brand-500/20 blur-3xl" />
      <div class="relative grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 class="text-lg font-semibold tracking-tight">Open a quotation</h2>
          <p class="mt-1 text-sm text-slate-400">Enter a quotation ID to load its full specification, pricing and signatories from the GPAK API.</p>
          <form class="mt-5 flex flex-col gap-2 sm:flex-row" @submit.prevent="openQuotation">
            <label class="relative flex-1">
              <span class="sr-only">Quotation ID</span>
              <FileSearch class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                v-model="lookupId"
                type="text"
                placeholder="e.g. 3f2a9c1e-…"
                class="h-11 w-full rounded-xl bg-white/[0.06] pl-10 pr-3 text-sm text-white ring-1 ring-inset ring-white/10 outline-none transition placeholder:text-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-brand-400"
              />
            </label>
            <button
              type="submit"
              :disabled="!lookupId.trim()"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Open
              <ArrowRight class="size-4" />
            </button>
          </form>
        </div>
        <dl class="grid grid-cols-3 gap-3">
          <div class="rounded-xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10">
            <dt class="text-xs text-slate-400">Awaiting reply</dt>
            <dd class="mt-1 text-2xl font-semibold tabular-nums">{{ summary.open }}</dd>
          </div>
          <div class="rounded-xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10">
            <dt class="text-xs text-slate-400">Approved</dt>
            <dd class="mt-1 text-2xl font-semibold tabular-nums text-emerald-400">{{ summary.approved }}</dd>
          </div>
          <div class="rounded-xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10">
            <dt class="text-xs text-slate-400">Value open</dt>
            <dd class="mt-1 text-lg font-semibold tabular-nums">{{ formatGHS(summary.value, true) }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- List -->
    <section class="surface overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div class="scroll-slim flex gap-1.5 overflow-x-auto rounded-xl bg-slate-100/80 p-1" role="tablist" aria-label="Quotation status">
          <button
            v-for="s in statuses"
            :key="s"
            type="button"
            role="tab"
            :aria-selected="statusFilter === s"
            class="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition duration-200"
            :class="statusFilter === s ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-800'"
            @click="statusFilter = s"
          >
            {{ s }}
          </button>
        </div>
        <p class="flex items-center gap-1.5 text-xs text-slate-400">
          <Info class="size-3.5" />
          Sample list · live quotations open by ID above
        </p>
      </div>

      <div class="scroll-slim overflow-x-auto">
        <table class="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th class="px-5 py-3 font-semibold">Quotation</th>
              <th class="px-5 py-3 font-semibold">Customer</th>
              <th class="px-5 py-3 font-semibold">Service</th>
              <th class="px-5 py-3 text-right font-semibold">Amount</th>
              <th class="px-5 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 font-semibold">Issued</th>
              <th class="px-5 py-3 font-semibold">Valid until</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="q in rows" :key="q.id" class="transition hover:bg-slate-50/80">
              <td class="px-5 py-4 font-mono text-xs font-semibold text-slate-900">{{ q.number }}</td>
              <td class="px-5 py-4 font-medium text-slate-800">{{ q.customerName }}</td>
              <td class="px-5 py-4 text-slate-600">{{ q.service }}</td>
              <td class="px-5 py-4 text-right font-semibold text-slate-900 tabular-nums">{{ formatGHS(q.amount) }}</td>
              <td class="px-5 py-4">
                <BackofficeStatusPill :tone="quotationStatusTone(q.status)">{{ q.status }}</BackofficeStatusPill>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-slate-600">{{ formatDate(q.issuedOn) }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-slate-600">{{ formatDate(q.validUntil) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!rows.length" class="px-6 py-12 text-center text-sm text-slate-500">No quotations with this status.</p>
      </div>
    </section>
  </div>
</template>
