<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Mail, Phone, Plus, SearchX } from 'lucide-vue-next';
import { customers } from '~/data/crm';
import type { CustomerSegment, CustomerStatus } from '~/models/crm';

definePageMeta({ layout: 'backoffice' });
useHead({ title: 'Customers · GPAK CRM' });

const route = useRoute();
const router = useRouter();

const query = ref(typeof route.query.q === 'string' ? route.query.q : '');
watch(
  () => route.query.q,
  (q) => (query.value = typeof q === 'string' ? q : ''),
);

const statusFilter = ref<'All' | CustomerStatus>('All');
const segmentFilter = ref<'All' | CustomerSegment>('All');

const statuses: ('All' | CustomerStatus)[] = ['All', 'Active', 'Prospect', 'Dormant'];
const segments: ('All' | CustomerSegment)[] = ['All', 'Corporate', 'Publisher', 'Retail', 'Education', 'NGO'];

const counts = computed(() => ({
  All: customers.length,
  Active: customers.filter((c) => c.status === 'Active').length,
  Prospect: customers.filter((c) => c.status === 'Prospect').length,
  Dormant: customers.filter((c) => c.status === 'Dormant').length,
}));

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return customers
    .filter((c) => statusFilter.value === 'All' || c.status === statusFilter.value)
    .filter((c) => segmentFilter.value === 'All' || c.segment === segmentFilter.value)
    .filter(
      (c) =>
        !q ||
        [c.name, c.contact, c.email, c.city, c.segment].some((field) => field.toLowerCase().includes(q)),
    )
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue);
});

const clearFilters = () => {
  query.value = '';
  statusFilter.value = 'All';
  segmentFilter.value = 'All';
  if (route.query.q) router.replace({ query: {} });
};

const onSearchInput = () => {
  // Keep the URL in sync so searches are shareable and survive refresh.
  router.replace({ query: query.value ? { q: query.value } : {} });
};

const totalLifetimeValue = computed(() => filtered.value.reduce((s, c) => s + c.lifetimeValue, 0));
</script>

<template>
  <div class="space-y-6">
    <BackofficePageHeader eyebrow="Sales" title="Customers" description="Every client and prospect, their owner and how much they're worth to GPAK.">
      <button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        title="Customer creation is coming soon"
        disabled
      >
        <Plus class="size-4" />
        New customer
      </button>
    </BackofficePageHeader>

    <section class="surface overflow-hidden">
      <!-- Toolbar -->
      <div class="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-wrap gap-1.5 rounded-xl bg-slate-100/80 p-1" role="tablist" aria-label="Customer status">
          <button
            v-for="s in statuses"
            :key="s"
            type="button"
            role="tab"
            :aria-selected="statusFilter === s"
            class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition duration-200"
            :class="statusFilter === s ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-800'"
            @click="statusFilter = s"
          >
            {{ s }}
            <span class="rounded-md bg-slate-100 px-1.5 text-xs tabular-nums text-slate-500" :class="statusFilter === s && 'bg-brand-100 text-brand-800'">
              {{ counts[s] }}
            </span>
          </button>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <label class="relative block">
            <span class="sr-only">Search customers</span>
            <input
              v-model="query"
              type="search"
              placeholder="Search name, contact, email, city"
              class="h-10 w-full rounded-xl bg-white px-3.5 text-sm text-slate-800 ring-1 ring-inset ring-slate-200 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-400 sm:w-72"
              @input="onSearchInput"
            />
          </label>
          <select
            v-model="segmentFilter"
            class="h-10 cursor-pointer rounded-xl bg-white px-3 pr-9 text-sm text-slate-800 ring-1 ring-inset ring-slate-200 outline-none focus:ring-2 focus:ring-brand-400"
            aria-label="Segment"
          >
            <option v-for="seg in segments" :key="seg" :value="seg">{{ seg === 'All' ? 'All segments' : seg }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="scroll-slim overflow-x-auto">
        <table class="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th class="px-5 py-3 font-semibold">Customer</th>
              <th class="px-5 py-3 font-semibold">Contact</th>
              <th class="px-5 py-3 font-semibold">Segment</th>
              <th class="px-5 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 text-right font-semibold">Lifetime value</th>
              <th class="px-5 py-3 font-semibold">Last contact</th>
              <th class="px-5 py-3 font-semibold">Owner</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="c in filtered" :key="c.id" class="group transition hover:bg-slate-50/80">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <BackofficeAvatar :name="c.name" />
                  <div class="min-w-0">
                    <p class="truncate font-semibold text-slate-900">{{ c.name }}</p>
                    <p class="text-xs text-slate-500">{{ c.city }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <p class="font-medium text-slate-800">{{ c.contact }}</p>
                <div class="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
                  <span class="flex items-center gap-1"><Mail class="size-3" />{{ c.email }}</span>
                </div>
                <p class="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><Phone class="size-3" />{{ c.phone }}</p>
              </td>
              <td class="px-5 py-4 text-slate-600">{{ c.segment }}</td>
              <td class="px-5 py-4">
                <BackofficeStatusPill :tone="customerStatusTone(c.status)">{{ c.status }}</BackofficeStatusPill>
              </td>
              <td class="px-5 py-4 text-right font-semibold text-slate-900 tabular-nums">
                {{ c.lifetimeValue ? formatGHS(c.lifetimeValue) : '—' }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-slate-600">
                <p>{{ formatDate(c.lastContact) }}</p>
                <p class="text-xs text-slate-400">{{ relativeDays(c.lastContact) }}</p>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-2 text-slate-600">
                  <BackofficeAvatar :name="c.owner" size="sm" />
                  <span class="whitespace-nowrap">{{ c.owner }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!filtered.length" class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <span class="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
            <SearchX class="size-6" />
          </span>
          <p class="font-semibold text-slate-900">No customers match these filters</p>
          <p class="text-sm text-slate-500">Try a different search term or clear the filters.</p>
          <button type="button" class="mt-1 text-sm font-medium text-brand-800 hover:text-brand-900" @click="clearFilters">Clear filters</button>
        </div>
      </div>

      <footer class="flex flex-col gap-1 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Showing <span class="font-semibold text-slate-700">{{ filtered.length }}</span> of {{ customers.length }} customers</p>
        <p>Combined lifetime value: <span class="font-semibold text-slate-700 tabular-nums">{{ formatGHS(totalLifetimeValue, true) }}</span></p>
      </footer>
    </section>
  </div>
</template>
