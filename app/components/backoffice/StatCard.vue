<script setup lang="ts">
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next';
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    label: string;
    value: string;
    delta?: string;
    trend?: 'up' | 'down' | 'flat';
    hint?: string;
    icon: Component;
  }>(),
  { trend: 'flat' },
);
</script>

<template>
  <article class="surface group relative overflow-hidden p-5 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-float starting:opacity-0">
    <div class="flex items-start justify-between">
      <p class="text-sm font-medium text-slate-500">{{ label }}</p>
      <span class="grid size-10 place-items-center rounded-xl bg-slate-900 text-brand-400 transition group-hover:bg-brand-500 group-hover:text-slate-900">
        <component :is="icon" class="size-[18px]" />
      </span>
    </div>

    <p class="mt-4 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{{ value }}</p>

    <div class="mt-3 flex items-center gap-2 text-xs">
      <span
        v-if="delta"
        class="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold"
        :class="{
          'bg-emerald-50 text-emerald-700': trend === 'up',
          'bg-rose-50 text-rose-700': trend === 'down',
          'bg-slate-100 text-slate-600': trend === 'flat',
        }"
      >
        <ArrowUpRight v-if="trend === 'up'" class="size-3.5" />
        <ArrowDownRight v-else-if="trend === 'down'" class="size-3.5" />
        {{ delta }}
      </span>
      <span v-if="hint" class="text-slate-400">{{ hint }}</span>
    </div>
  </article>
</template>
