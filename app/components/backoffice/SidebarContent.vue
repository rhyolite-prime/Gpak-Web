<script setup lang="ts">
import type { Component } from 'vue';
import { ExternalLink, LogOut } from 'lucide-vue-next';

interface NavItem {
  to: string;
  label: string;
  icon: Component;
  exact?: boolean;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

defineProps<{
  navGroups: NavGroup[];
  isActive: (item: NavItem) => boolean;
}>();
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Brand -->
    <div class="flex items-center gap-3 px-6 pb-6 pt-7">
      <span class="grid size-10 place-items-center rounded-xl bg-brand-500 font-bold text-slate-950 shadow-[0_0_0_4px_oklch(83.5%_0.165_90/0.15)]">G</span>
      <div class="leading-tight">
        <p class="text-[15px] font-semibold tracking-tight text-white">GPAK CRM</p>
        <p class="text-xs text-slate-400">Backoffice</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="scroll-slim flex-1 space-y-7 overflow-y-auto px-3" aria-label="Backoffice">
      <div v-for="group in navGroups" :key="group.label">
        <p class="eyebrow mb-2 px-3 text-slate-500!">{{ group.label }}</p>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 hover:bg-white/5 hover:text-white"
              :class="isActive(item) ? 'bg-white/[0.08] text-white' : 'text-slate-400'"
              :aria-current="isActive(item) ? 'page' : undefined"
            >
              <span
                v-if="isActive(item)"
                class="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand-500"
              />
              <component
                :is="item.icon"
                class="size-[18px] shrink-0 transition"
                :class="isActive(item) ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'"
              />
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer -->
    <div class="space-y-1 p-3">
      <NuxtLink to="/" class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
        <ExternalLink class="size-4" />
        Back to website
      </NuxtLink>
      <button type="button" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
        <LogOut class="size-4" />
        Sign out
      </button>
    </div>
  </div>
</template>
