<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = defineProps<{
  title?: string;
  subtitle?: string;
  headerAlign?: 'left' | 'center' | 'right';
}>();

const slots = useSlots();

const hasHeaderSlot = computed(() => Boolean(slots.header));
const hasFooterSlot = computed(() => Boolean(slots.footer));
const headerAlignClass = computed(() => {
  if (props.headerAlign === 'center') return 'text-center';
  if (props.headerAlign === 'right') return 'text-right';
  return 'text-left';
});
</script>

<template>
  <section class="my-card w-full rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
    <header v-if="hasHeaderSlot || title || subtitle" :class="['mb-8', headerAlignClass]">
      <slot name="header">
        <p v-if="subtitle" class="text-sm font-medium text-slate-500">
          {{ subtitle }}
        </p>
        <h1 v-if="title" class="mt-2 text-2xl font-semibold text-slate-900">
          {{ title }}
        </h1>
      </slot>
    </header>

    <div class="space-y-6">
      <slot />
    </div>

    <footer v-if="hasFooterSlot" class="mt-8">
      <slot name="footer" />
    </footer>
  </section>
</template>
