<script setup lang="ts">
defineProps<{
  level: number
  total: number
  score: number
  badge: boolean
}>()

defineEmits<{ help: [] }>()
</script>

<template>
  <header class="w-full max-w-3xl flex items-center justify-between mb-3">
    <div class="flex items-center gap-2">
      <h1 class="text-lg font-bold text-slate-800">Epic Labs</h1>
      <span class="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Lv {{ level }}/{{ total }}</span>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-sm">⭐ {{ score }}</span>
      <span class="text-lg" :title="badge ? '徽章已解锁' : '未解锁'">{{ badge ? '🏆' : '▪️' }}</span>
      <button
        class="help-btn w-7 h-7 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
        aria-label="帮助"
        @click="$emit('help')"
      >?</button>
    </div>
  </header>
</template>
