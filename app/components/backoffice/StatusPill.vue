<script setup lang="ts">
import { computed } from 'vue';
import { toneClasses, type Tone } from '~/utils/crm';

const props = withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'slate' });
const classes = computed(() => toneClasses[props.tone]);
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset"
    :class="classes"
  >
    <span class="size-1.5 rounded-full bg-current opacity-70" />
    <slot />
  </span>
</template>
