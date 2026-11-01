<script setup lang="ts">
import { computed } from 'vue';
import { avatarTone, initials } from '~/utils/crm';

const props = withDefaults(defineProps<{ name: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' });
const sizeClass = computed(
  () => ({ sm: 'size-7 text-[11px]', md: 'size-9 text-xs', lg: 'size-12 text-sm' })[props.size],
);
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white"
    :class="[sizeClass, avatarTone(name)]"
    :title="name"
    aria-hidden="true"
  >
    {{ initials(name) }}
  </span>
</template>
