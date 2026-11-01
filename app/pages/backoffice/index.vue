<script setup lang="ts">
import { computed } from 'vue';
import { Briefcase, Clock, Factory, FileText, Trophy } from 'lucide-vue-next';
import { customers, deals, monthlyBookings, productionOrders, quotations } from '~/data/crm';
import type { DealStage } from '~/models/crm';
import { PRODUCTION_STAGES } from '~/models/crm';

definePageMeta({ layout: 'backoffice' });
useHead({ title: 'Dashboard · GPAK CRM' });

const openDeals = computed(() => deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost'));
const pipelineTotal = computed(() => openDeals.value.reduce((s, d) => s + d.value, 0));
const wonTotal = computed(() => deals.filter((d) => d.stage === 'Won').reduce((s, d) => s + d.value, 0));
const closingThisWeek = computed(
  () => openDeals.value.filter((d) => d.expectedClose >= '2026-11-01' && d.expectedClose <= '2026-11-08').length,
);
const awaitingResponse = computed(
  () => quotations.filter((q) => q.status === 'Sent' || q.status === 'Awaiting Approval').length,
);
const activeJobs = computed(() => productionOrders.filter((o) => o.stageIndex < 4));
const overdueJobs = computed(() => activeJobs.value.filter((o) => o.dueDate < '2026-11-01'));

const stageOrder: DealStage[] = ['Enquiry', 'Quoted', 'Negotiation', 'Won'];
const stageColors: Record<string, string> = {
  Enquiry: 'bg-sky-400',
  Quoted: 'bg-violet-400',
  Negotiation: 'bg-amber-400',
  Won: 'bg-emerald-500',
};
const stageBreakdown = computed(() =>
  stageOrder.map((stage) => {
    const list = deals.filter((d) => d.stage === stage);
    return { stage, count: list.length, value: list.reduce((s, d) => s + d.value, 0) };
  }),
);
const stageTotal = computed(() => stageBreakdown.value.reduce((s, x) => s + x.value, 0) || 1);

const chartMax = Math.max(...monthlyBookings.map((m) => m.value));
const chart = computed(() =>
  monthlyBookings.map((m, i) => ({
    ...m,
    pct: Math.round((m.value / chartMax) * 100),
    current: i === monthlyBookings.length - 1,
  })),
);

const closingSoon = computed(() =>
  [...openDeals.value].sort((a, b) => a.expectedClose.localeCompare(b.expectedClose)).slice(0, 5),
);

const topCustomers = computed(() => [...customers].sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 4));

const stageLabel = (i: number) => PRODUCTION_STAGES[i];

// Accra is UTC+0 year-round, so the UTC hour is the local hour.
const greeting = computed(() => {
  const h = new Date().getUTCHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
});
</script>

<template>
  <div class="space-y-6">
    <BackofficePageHeader
      eyebrow="Overview"
      :title="`${greeting}, Ama`"
      description="Your pipeline, quotations and production jobs at a glance."
    >
      <NuxtLink
        to="/backoffice/pipeline"
        class="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
      >
        View pipeline
      </NuxtLink>
    </BackofficePageHeader>

    <!-- KPIs -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key figures">
      <BackofficeStatCard label="Open pipeline" :value="formatGHS(pipelineTotal, true)" :hint="`${openDeals.length} open deals`" :icon="Briefcase" />
      <BackofficeStatCard label="Revenue won" :value="formatGHS(wonTotal, true)" :hint="`${deals.filter((d) => d.stage === 'Won').length} deals closed`" :icon="Trophy" />
      <BackofficeStatCard label="Quotes awaiting reply" :value="String(awaitingResponse)" :hint="`${closingThisWeek} deals closing this week`" :icon="FileText" />
      <BackofficeStatCard label="Jobs in production" :value="String(activeJobs.length)" :hint="overdueJobs.length ? `${overdueJobs.length} overdue` : 'None overdue'" :trend="overdueJobs.length ? 'down' : 'flat'" :delta="overdueJobs.length ? 'Action needed' : undefined" :icon="Factory" />
    </section>

    <div class="grid gap-6 xl:grid-cols-3">
      <!-- Bookings chart -->
      <section class="surface p-6 xl:col-span-2">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Bookings</h2>
            <p class="text-sm text-slate-500">Last six months · sample data</p>
          </div>
          <p class="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-200 ring-inset">
            Oct · {{ formatGHS(monthlyBookings[monthlyBookings.length - 1].value, true) }}
          </p>
        </div>

        <div class="mt-8 flex h-56 items-end gap-3 sm:gap-5">
          <div v-for="bar in chart" :key="bar.month" class="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span class="text-xs font-medium text-slate-500 tabular-nums opacity-0 transition group-hover:opacity-100">
              {{ formatGHS(bar.value, true) }}
            </span>
            <div
              class="w-full max-w-14 rounded-t-xl transition-all duration-700 ease-smooth"
              :class="bar.current ? 'bg-linear-to-t from-brand-600 to-brand-400 shadow-[0_8px_24px_-8px_oklch(74%_0.15_83/0.6)]' : 'bg-slate-200 group-hover:bg-slate-300'"
              :style="{ height: `${bar.pct}%` }"
            />
            <span class="text-xs font-medium" :class="bar.current ? 'text-slate-900' : 'text-slate-400'">{{ bar.month }}</span>
          </div>
        </div>
      </section>

      <!-- Pipeline by stage -->
      <section class="surface flex flex-col p-6">
        <h2 class="text-base font-semibold text-slate-900">Pipeline by stage</h2>
        <p class="text-sm text-slate-500">Deal value across stages</p>

        <div class="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            v-for="s in stageBreakdown"
            :key="s.stage"
            class="h-full transition-all duration-700 ease-smooth first:rounded-l-full last:rounded-r-full"
            :class="stageColors[s.stage]"
            :style="{ width: `${(s.value / stageTotal) * 100}%` }"
            :title="`${s.stage}: ${formatGHS(s.value)}`"
          />
        </div>

        <ul class="mt-6 space-y-4">
          <li v-for="s in stageBreakdown" :key="s.stage" class="flex items-center gap-3">
            <span class="size-2.5 rounded-full" :class="stageColors[s.stage]" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-slate-800">{{ s.stage }}</p>
              <p class="text-xs text-slate-400">{{ s.count }} {{ s.count === 1 ? 'deal' : 'deals' }}</p>
            </div>
            <p class="text-sm font-semibold text-slate-900 tabular-nums">{{ formatGHS(s.value, true) }}</p>
          </li>
        </ul>
      </section>

      <!-- Closing soon -->
      <section class="surface overflow-hidden xl:col-span-2">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Closing soon</h2>
            <p class="text-sm text-slate-500">Open deals by expected close date</p>
          </div>
          <NuxtLink to="/backoffice/pipeline" class="text-sm font-medium text-brand-800 hover:text-brand-900">View all</NuxtLink>
        </div>
        <ul class="divide-y divide-slate-100">
          <li v-for="deal in closingSoon" :key="deal.id" class="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50/70">
            <BackofficeAvatar :name="deal.owner" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-slate-900">{{ deal.title }}</p>
              <p class="truncate text-xs text-slate-500">{{ deal.customerName }} · {{ deal.service }}</p>
            </div>
            <BackofficeStatusPill :tone="dealStageTone(deal.stage)" class="hidden sm:inline-flex">{{ deal.stage }}</BackofficeStatusPill>
            <div class="text-right">
              <p class="text-sm font-semibold text-slate-900 tabular-nums">{{ formatGHS(deal.value, true) }}</p>
              <p class="flex items-center justify-end gap-1 text-xs text-slate-400">
                <Clock class="size-3" />{{ relativeDays(deal.expectedClose) }}
              </p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Production watchlist -->
      <section class="surface p-6">
        <h2 class="text-base font-semibold text-slate-900">Production watchlist</h2>
        <p class="text-sm text-slate-500">Active jobs and where they are</p>
        <ul class="mt-5 space-y-5">
          <li v-for="job in activeJobs.slice(0, 4)" :key="job.id">
            <div class="flex items-center justify-between gap-3">
              <p class="truncate text-sm font-medium text-slate-900">{{ job.orderNumber }} · {{ job.customerName }}</p>
              <BackofficeStatusPill v-if="job.priority === 'Rush'" tone="rose">Rush</BackofficeStatusPill>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <div class="flex flex-1 gap-1">
                <span
                  v-for="(_, i) in PRODUCTION_STAGES"
                  :key="i"
                  class="h-1.5 flex-1 rounded-full"
                  :class="i < job.stageIndex ? 'bg-emerald-500' : i === job.stageIndex ? 'bg-brand-500' : 'bg-slate-200'"
                />
              </div>
              <span class="w-24 text-right text-xs text-slate-500">{{ stageLabel(job.stageIndex) }}</span>
            </div>
          </li>
        </ul>
        <p v-if="!activeJobs.length" class="mt-6 text-sm text-slate-500">No active jobs.</p>
      </section>

      <!-- Top customers -->
      <section class="surface p-6 xl:col-span-3">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Top customers by lifetime value</h2>
            <p class="text-sm text-slate-500">Your most valuable accounts</p>
          </div>
          <NuxtLink to="/backoffice/customers" class="text-sm font-medium text-brand-800 hover:text-brand-900">All customers</NuxtLink>
        </div>
        <div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div v-for="c in topCustomers" :key="c.id" class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-900/5">
            <BackofficeAvatar :name="c.name" size="lg" />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-slate-900">{{ c.name }}</p>
              <p class="text-xs text-slate-500">{{ c.segment }} · {{ c.city }}</p>
              <p class="mt-1 text-sm font-semibold text-brand-800 tabular-nums">{{ formatGHS(c.lifetimeValue, true) }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
