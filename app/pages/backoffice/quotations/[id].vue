<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, ArrowLeft, ExternalLink, Mail, Phone, RotateCw } from 'lucide-vue-next';
import { getQuotationDetails } from '~/services/productionOrder';
import type { Quotation } from '~/models';

definePageMeta({ layout: 'backoffice' });

const route = useRoute();
const id = computed(() => String(route.params.id));

const { data, status, error, refresh } = useAsyncData(
  () => `backoffice-quotation-${id.value}`,
  () => getQuotationDetails(id.value),
  { server: false, lazy: true, watch: [id] },
);

const quotation = computed<Quotation | null>(() => data.value?.quotationInfo ?? null);
const production = computed(() => data.value?.productionRequestDetails ?? null);

useHead({
  title: computed(() => `${quotation.value?.quotationNumber ?? 'Quotation'} · GPAK CRM`),
});

const statusTone = (status: string) => {
  if (status === 'Customer Approved') return 'emerald' as const;
  if (status === 'Customer Rejected') return 'rose' as const;
  if (status === 'Sent') return 'sky' as const;
  if (status === 'Awaiting Approval') return 'amber' as const;
  return 'slate' as const;
};

const money = (value: number | undefined | null) =>
  value == null ? '—' : new Intl.NumberFormat('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const termFields = computed(() => [
  { label: 'Specification', value: quotation.value?.specification },
  { label: 'Origination', value: quotation.value?.origination },
  { label: 'Terms', value: quotation.value?.terms },
  { label: 'Customer feedback', value: quotation.value?.customerFeedback },
]);

const lineCount = computed(() => quotation.value?.details?.length ?? 0);
const validity = computed(() => (quotation.value?.validityInDays ? `${quotation.value.validityInDays} days` : '—'));
const quoteStatus = computed(() => quotation.value?.status || 'Draft');
</script>

<template>
  <div class="space-y-6">
    <NuxtLink to="/backoffice/quotations" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900">
      <ArrowLeft class="size-4" />
      All quotations
    </NuxtLink>

    <!-- Loading -->
    <div v-if="status === 'idle' || status === 'pending'" class="surface space-y-5 p-6 sm:p-8">
      <div class="h-6 w-1/3 animate-pulse rounded-lg bg-slate-200" />
      <div class="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100" />
      <div class="grid gap-4 sm:grid-cols-3">
        <div v-for="n in 3" :key="n" class="h-24 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error || !quotation" class="surface flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
      <span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
        <AlertTriangle class="size-6" />
      </span>
      <div class="flex-1">
        <h1 class="text-lg font-semibold text-slate-900">Quotation couldn't be loaded</h1>
        <p class="mt-1 text-sm text-slate-500">
          We couldn't retrieve <span class="font-mono text-slate-700">{{ id }}</span> from the GPAK API. Check the ID and try again.
        </p>
      </div>
      <button type="button" class="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800" @click="refresh()">
        <RotateCw class="size-4" />
        Retry
      </button>
    </div>

    <template v-else>
      <!-- Header -->
      <header class="surface flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-3">
            <p class="eyebrow">Quotation</p>
            <BackofficeStatusPill :tone="statusTone(quoteStatus)">{{ quoteStatus }}</BackofficeStatusPill>
          </div>
          <h1 class="mt-2 font-mono text-2xl font-semibold tracking-tight text-slate-900">
            {{ quotation.quotationNumber || 'Unnumbered' }}
          </h1>
          <p class="mt-1 text-base text-slate-600">{{ quotation.businessName }}</p>
          <div class="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span v-if="quotation.email" class="flex items-center gap-1.5"><Mail class="size-4" />{{ quotation.email }}</span>
            <span v-if="quotation.phoneNumber" class="flex items-center gap-1.5"><Phone class="size-4" />{{ quotation.phoneNumber }}</span>
          </div>
        </div>

        <div class="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          <a
            :href="`/self-service/quotation/${quotation.id}`"
            target="_blank"
            rel="noopener"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <ExternalLink class="size-4" />
            Customer view
          </a>
          <p class="text-xs text-slate-400 lg:text-right">Opens the customer-facing approval page</p>
        </div>
      </header>

      <!-- Key figures -->
      <section class="grid gap-4 sm:grid-cols-3">
        <div class="surface p-5">
          <p class="text-sm text-slate-500">Quoted total</p>
          <p class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">GH₵ {{ money(quotation.quotedPrice) }}</p>
          <p class="mt-1 text-xs text-slate-400">{{ lineCount }} {{ lineCount === 1 ? 'line item' : 'line items' }}</p>
        </div>
        <div class="surface p-5">
          <p class="text-sm text-slate-500">Validity</p>
          <p class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{{ validity }}</p>
          <p class="mt-1 text-xs text-slate-400">Set when the quotation was issued</p>
        </div>
        <div class="surface p-5">
          <p class="text-sm text-slate-500">Production order</p>
          <p class="mt-2 font-mono text-2xl font-semibold tracking-tight text-slate-900">{{ production?.orderNumber || '—' }}</p>
          <p class="mt-1 text-xs text-slate-400">{{ production?.orderNumber ? 'Linked to production' : 'Not yet in production' }}</p>
        </div>
      </section>

      <!-- Line items -->
      <section class="surface overflow-hidden">
        <div class="border-b border-slate-100 px-6 py-4">
          <h2 class="text-base font-semibold text-slate-900">Line items</h2>
        </div>
        <div class="scroll-slim overflow-x-auto">
          <table class="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr class="bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="px-5 py-3 font-semibold">Description</th>
                <th class="px-5 py-3 font-semibold">Size (mm)</th>
                <th class="px-5 py-3 font-semibold">Paper GSM</th>
                <th class="px-5 py-3 font-semibold">Colour</th>
                <th class="px-5 py-3 text-right font-semibold">Qty</th>
                <th class="px-5 py-3 text-right font-semibold">Unit (GH₵)</th>
                <th class="px-5 py-3 text-right font-semibold">NHIL / GETF</th>
                <th class="px-5 py-3 text-right font-semibold">VAT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(item, i) in quotation.details" :key="i" class="transition hover:bg-slate-50/80">
                <td class="px-5 py-4 font-semibold text-slate-900">{{ item.itemName }}</td>
                <td class="px-5 py-4 whitespace-pre-wrap text-slate-600">{{ item.size }}</td>
                <td class="px-5 py-4 whitespace-pre-wrap text-slate-600">{{ item.paperGsm }}</td>
                <td class="px-5 py-4 whitespace-pre-wrap text-slate-600">{{ item.colour }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-slate-700">{{ item.quantity }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-slate-900">{{ money(item.unitPrice) }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-slate-600">{{ money(item.getflNhil) }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-slate-600">{{ money(item.vatTax) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t border-slate-200 bg-slate-50/60">
                <td colspan="7" class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Total amount</td>
                <td class="px-5 py-4 text-right text-base font-semibold text-slate-900 tabular-nums">GH₵ {{ money(quotation.quotedPrice) }}</td>
              </tr>
            </tfoot>
          </table>
          <p v-if="!lineCount" class="px-6 py-10 text-center text-sm text-slate-500">This quotation has no line items.</p>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <section class="surface p-6 lg:col-span-2">
          <h2 class="text-base font-semibold text-slate-900">Terms & specification</h2>
          <dl class="mt-5 grid gap-5 sm:grid-cols-2">
            <div v-for="field in termFields" :key="field.label">
              <dt class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ field.label }}</dt>
              <dd class="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{{ field.value || '—' }}</dd>
            </div>
          </dl>
        </section>

        <section class="surface p-6">
          <h2 class="text-base font-semibold text-slate-900">Signatories</h2>
          <ul class="mt-5 space-y-4">
            <li v-for="(sig, i) in quotation.signatories || []" :key="i" class="flex items-center gap-3">
              <BackofficeAvatar :name="sig.name || '?'" />
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">{{ sig.name }}</p>
                <p class="truncate text-xs text-slate-500">{{ sig.designation }}<span v-if="sig.phoneNo"> · {{ sig.phoneNo }}</span></p>
              </div>
            </li>
          </ul>
          <p v-if="!quotation.signatories?.length" class="mt-5 text-sm text-slate-500">No signatories on file.</p>
        </section>
      </div>
    </template>
  </div>
</template>
