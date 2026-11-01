<script setup lang="ts">
import { computed } from 'vue';
import { CalendarDays } from 'lucide-vue-next';
import { deals } from '~/data/crm';
import type { DealStage } from '~/models/crm';

definePageMeta({ layout: 'backoffice' });
useHead({ title: 'Pipeline · GPAK CRM' });

const columns: { stage: DealStage; dot: string; bar: string }[] = [
  { stage: 'Enquiry', dot: 'bg-sky-400', bar: 'bg-sky-400' },
  { stage: 'Quoted', dot: 'bg-violet-400', bar: 'bg-violet-400' },
  { stage: 'Negotiation', dot: 'bg-amber-400', bar: 'bg-amber-400' },
  { stage: 'Won', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
  { stage: 'Lost', dot: 'bg-rose-400', bar: 'bg-rose-400' },
];

const board = computed(() =>
  columns.map((col) => {
    const items = deals
      .filter((d) => d.stage === col.stage)
      .sort((a, b) => a.expectedClose.localeCompare(b.expectedClose));
    return { ...col, items, total: items.reduce((s, d) => s + d.value, 0) };
  }),
);

const maxColumnTotal = computed(() => Math.max(1, ...board.value.map((c) => c.total)));

const openValue = computed(() =>
  board.value
    .filter((c) => c.stage !== 'Won' && c.stage !== 'Lost')
    .reduce((s, c) => s + c.total, 0),
);
const winRate = computed(() => {
  const won = deals.filter((d) => d.stage === 'Won').length;
  const closed = deals.filter((d) => d.stage === 'Won' || d.stage === 'Lost').length;
  return closed ? Math.round((won / closed) * 100) : 0;
});
</script>

<template>
  <div class="flex h-full flex-col gap-6">
    <BackofficePageHeader eyebrow="Sales" title="Pipeline" description="Drag-free board view of every deal from first enquiry to signed order.">
      <div class="flex items-center gap-2">
        <div class="rounded-xl bg-white px-4 py-2 ring-1 ring-slate-900/5 shadow-card">
          <p class="text-[11px] font-medium uppercase tracking-wider text-slate-400">Open value</p>
          <p class="text-sm font-semibold text-slate-900 tabular-nums">{{ formatGHS(openValue, true) }}</p>
        </div>
        <div class="rounded-xl bg-white px-4 py-2 ring-1 ring-slate-900/5 shadow-card">
          <p class="text-[11px] font-medium uppercase tracking-wider text-slate-400">Win rate</p>
          <p class="text-sm font-semibold text-slate-900 tabular-nums">{{ winRate }}%</p>
        </div>
      </div>
    </BackofficePageHeader>

    <div class="scroll-slim -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <section
        v-for="col in board"
        :key="col.stage"
        class="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-slate-100/70 p-3 ring-1 ring-inset ring-slate-900/5"
        :aria-label="`${col.stage} column`"
      >
        <header class="mb-3 flex items-center justify-between px-1 pt-1">
          <div class="flex items-center gap-2">
            <span class="size-2.5 rounded-full" :class="col.dot" />
            <h2 class="text-sm font-semibold text-slate-800">{{ col.stage }}</h2>
            <span class="rounded-md bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-500 tabular-nums ring-1 ring-slate-900/5">
              {{ col.items.length }}
            </span>
          </div>
          <p class="text-xs font-medium text-slate-500 tabular-nums">{{ formatGHS(col.total, true) }}</p>
        </header>

        <div class="relative h-1 overflow-hidden rounded-full bg-slate-200/70">
          <div class="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-smooth" :class="col.bar" :style="{ width: `${(col.total / maxColumnTotal) * 100}%` }" />
        </div>

        <ul class="mt-3 flex flex-1 flex-col gap-3">
          <li
            v-for="deal in col.items"
            :key="deal.id"
            class="group rounded-xl bg-white p-4 shadow-card ring-1 ring-slate-900/5 transition duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-float starting:opacity-0"
          >
            <p class="text-sm font-semibold leading-snug text-slate-900 text-balance">{{ deal.title }}</p>
            <p class="mt-1 truncate text-xs text-slate-500">{{ deal.customerName }}</p>

            <div class="mt-3 flex items-center justify-between gap-2">
              <span class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{{ deal.service }}</span>
              <p class="text-sm font-semibold text-slate-900 tabular-nums">{{ formatGHS(deal.value, true) }}</p>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <p class="flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarDays class="size-3.5" />
                {{ formatDate(deal.expectedClose) }}
              </p>
              <BackofficeAvatar :name="deal.owner" size="sm" />
            </div>
          </li>

          <li v-if="!col.items.length" class="grid flex-1 place-items-center rounded-xl border border-dashed border-slate-300/80 p-6 text-center text-xs text-slate-400">
            No deals in {{ col.stage.toLowerCase() }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
