<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Factory, FileText, Kanban, LayoutDashboard, Menu, Search, Users, X } from 'lucide-vue-next';
import '~/assets/css/backoffice.css';

useHead({
  title: 'GPAK CRM Backoffice',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  htmlAttrs: { class: 'bg-slate-50' },
});

const route = useRoute();
const router = useRouter();

const navGroups = [
  {
    label: 'Sales',
    items: [
      { to: '/backoffice', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/backoffice/pipeline', label: 'Pipeline', icon: Kanban },
      { to: '/backoffice/customers', label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/backoffice/quotations', label: 'Quotations', icon: FileText },
      { to: '/backoffice/production', label: 'Production', icon: Factory },
    ],
  },
];

const isActive = (item: { to: string; exact?: boolean }) =>
  item.exact ? route.path === item.to : route.path === item.to || route.path.startsWith(`${item.to}/`);

const mobileOpen = ref(false);
watch(() => route.fullPath, () => (mobileOpen.value = false));

const searchQuery = ref('');
const submitSearch = () => {
  const q = searchQuery.value.trim();
  router.push({ path: '/backoffice/customers', query: q ? { q } : {} });
};

const today = computed(() =>
  new Date('2026-11-01T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
);
</script>

<template>
  <div class="crm flex min-h-dvh bg-slate-50 font-sans text-slate-800 antialiased">
    <!-- Desktop sidebar -->
    <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-950 text-slate-300 lg:flex">
      <BackofficeSidebarContent :nav-groups="navGroups" :is-active="isActive" />
    </aside>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-smooth"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" @click="mobileOpen = false" />
    </Transition>
    <Transition
      enter-active-class="transition duration-300 ease-smooth"
      enter-from-class="-translate-x-full"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="-translate-x-full"
    >
      <aside v-if="mobileOpen" class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-slate-300 shadow-float lg:hidden">
        <button class="absolute right-3 top-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close menu" @click="mobileOpen = false">
          <X class="size-5" />
        </button>
        <BackofficeSidebarContent :nav-groups="navGroups" :is-active="isActive" />
      </aside>
    </Transition>

    <div class="flex min-w-0 flex-1 flex-col lg:pl-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div class="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open menu" @click="mobileOpen = true">
            <Menu class="size-5" />
          </button>

          <form class="group relative max-w-md flex-1" role="search" @submit.prevent="submitSearch">
            <Search class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-brand-700" />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search customers, contacts, cities…"
              class="h-10 w-full rounded-xl border-0 bg-slate-100/80 pl-10 pr-16 text-sm text-slate-800 ring-1 ring-inset ring-transparent outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-400"
            />
            <kbd class="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[11px] text-slate-400 sm:block">Enter</kbd>
          </form>

          <div class="ml-auto hidden items-center gap-4 md:flex">
            <p class="text-sm text-slate-500">{{ today }}</p>
          </div>

          <div class="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-4">
            <BackofficeAvatar name="Ama Boateng" size="sm" />
            <div class="hidden leading-tight sm:block">
              <p class="text-sm font-semibold text-slate-900">Ama Boateng</p>
              <p class="text-xs text-slate-500">Sales Manager</p>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <slot />
      </main>

      <footer class="border-t border-slate-200/70 px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-8">
        © {{ new Date().getFullYear() }} G-PAK Limited · Subsidiary of the Graphic Communications Group · Sample data shown where live endpoints are not yet connected.
      </footer>
    </div>
  </div>
</template>
