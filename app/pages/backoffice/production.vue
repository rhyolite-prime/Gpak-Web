<script setup lang="ts">
import { computed, ref } from 'vue';
import { AlertTriangle, Check, CalendarClock, Layers, Truck } from 'lucide-vue-next';
import { productionOrders } from '~/data/crm';
import { PRODUCTION_STAGES } from '~/models/crm';

definePageMeta({ layout: 'backoffice' });
useHead({ title: 'Production · GPAK CRM' });

const today = '2026-11-01';
const weekEnd = '2026-11-08';

const view = ref<'All' | 'Rush' | 'Overdue'>('All');

const enriched = computed(() =>
  productionOrders.map((o) => ({
    ...o,
    done: o.stageIndex >= 4,
    overdue: o.stageIndex < 4 && o.dueDate < today,
    dueSoon: o.stageIndex < 4 && o.dueDate >= today && o.dueDate <= weekEnd,
  })),
);

const active = computed(() => enriched.value.filter((o) => !o.done));
const stats = computed(() => ({
  active: active.value.length,
  rush: active.value.filter((o) => o.priority === 'Rush').length,
  overdue: active.value.filter((o) => o.overdue).length,
  dueThisWeek: active.value.filter((o) => o.dueSoon).length,
}));

const rows = computed(() => {
  const list = enriched.value.filter((o) => (view.value === 'Rush' ? o.priority === 'Rush' : view.value === 'Overdue' ? o.overdue : true));
  return [...list].sort((a, b) => Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate));
});

const stageTone = (index: number, stageIndex: number) => {
  if (index < stageIndex) return 'done';
  if (index === stageIndex) return 'current';
  return 'todo';
};
</script>

<template>
  <div class="space-y-6">
    <BackofficePageHeader eyebrow="Operations" title="Production" description="Every job on the floor, where it is in the workflow and whether it's on track.">
      <div class="flex gap-1.5 rounded-xl bg-slate-100/80 p-1" role="tablist" aria-label="Filter jobs">
        <button
          v-for="v in ['All', 'Rush', 'Overdue'] as const"
          :key="v"
          type="button"
          role="tab"
          :aria-selected="view === v"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition duration-200"
          :class="view === v ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-800'"
          @click="view = v"
        >
          {{ v }}
        </button>
      </div>
    </BackofficePageHeader>

    <!-- Stats -->
    <section class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <div class="surface flex items-center gap-4 p-5">
        <span class="grid size-11 place-items-center rounded-xl bg-slate-900 text-brand-400"><Layers class="size-5" /></span>
        <div>
          <p class="text-2xl font-semibold tabular-nums text-slate-900">{{ stats.active }}</p>
          <p class="text-xs text-slate-500">Active jobs</p>
        </div>
      </div>
      <div class="surface flex items-center gap-4 p-5">
        <span class="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600"><Truck class="size-5" /></span>
        <div>
          <p class="text-2xl font-semibold tabular-nums text-slate-900">{{ stats.rush }}</p>
          <p class="text-xs text-slate-500">Rush jobs</p>
        </div>
      </div>
      <div class="surface flex items-center gap-4 p-5">
        <span class="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700"><AlertTriangle class="size-5" /></span>
        <div>
          <p class="text-2xl font-semibold tabular-nums text-slate-900">{{ stats.overdue }}</p>
          <p class="text-xs text-slate-500">Overdue</p>
        </div>
      </div>
      <div class="surface flex items-center gap-4 p-5">
        <span class="grid size-11 place-items-center rounded-xl bg-sky-50 text-sky-700"><CalendarClock class="size-5" /></span>
        <div>
          <p class="text-2xl font-semibold tabular-nums text-slate-900">{{ stats.dueThisWeek }}</p>
          <p class="text-xs text-slate-500">Due this week</p>
        </div>
      </div>
    </section>

    <!-- Job cards -->
    <section class="grid gap-4 xl:grid-cols-2">
      <article
        v-for="job in rows"
        :key="job.id"
        class="surface flex flex-col gap-5 p-5 transition duration-300 ease-smooth hover:shadow-float starting:opacity-0"
        :class="job.done ? 'opacity-60' : ''"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="font-mono text-xs font-semibold text-slate-400">{{ job.orderNumber }}</p>
            <h2 class="mt-0.5 truncate text-base font-semibold text-slate-900">{{ job.customerName }}</h2>
            <p class="text-sm text-slate-500">{{ job.service }} · {{ job.quantity.toLocaleString('en-US') }} pcs</p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-2">
            <BackofficeStatusPill v-if="job.priority === 'Rush'" tone="rose">Rush</BackofficeStatusPill>
            <BackofficeStatusPill v-if="job.overdue" tone="amber">Overdue</BackofficeStatusPill>
            <BackofficeStatusPill v-else-if="job.done" tone="emerald">Dispatched</BackofficeStatusPill>
          </div>
        </div>

        <!-- Stage stepper -->
        <ol class="grid grid-cols-5 gap-2" aria-label="Production stages">
          <li v-for="(stage, i) in PRODUCTION_STAGES" :key="stage" class="flex min-w-0 flex-col gap-2">
            <div
              class="flex h-1.5 rounded-full"
              :class="stageTone(i, job.stageIndex) === 'todo' ? 'bg-slate-200' : stageTone(i, job.stageIndex) === 'current' ? 'bg-brand-500' : 'bg-emerald-500'"
            />
            <div class="flex items-center gap-1.5">
              <span
                class="grid size-4 shrink-0 place-items-center rounded-full text-[10px]"
                :class="{
                  'bg-emerald-500 text-white': stageTone(i, job.stageIndex) === 'done',
                  'bg-brand-500 text-slate-950 ring-4 ring-brand-100': stageTone(i, job.stageIndex) === 'current',
                  'bg-slate-100 text-slate-400': stageTone(i, job.stageIndex) === 'todo',
                }"
              >
                <Check v-if="stageTone(i, job.stageIndex) === 'done'" class="size-2.5" />
              </span>
              <span
                class="truncate text-[11px] font-medium"
                :class="stageTone(i, job.stageIndex) === 'current' ? 'text-slate-900' : 'text-slate-400'"
              >{{ stage }}</span>
            </div>
          </li>
        </ol>

        <div class="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <p class="text-slate-500">
            Due <span class="font-medium text-slate-800">{{ formatDate(job.dueDate) }}</span>
            <span class="text-xs text-slate-400"> · {{ relativeDays(job.dueDate) }}</span>
          </p>
          <p v-if="!job.done" class="text-xs font-medium text-slate-500">
            Now: <span class="text-slate-900">{{ PRODUCTION_STAGES[job.stageIndex] }}</span>
          </p>
        </div>
      </article>

      <p v-if="!rows.length" class="surface p-10 text-center text-sm text-slate-500 xl:col-span-2">No jobs match this filter.</p>
    </section>
  </div>
</template>
