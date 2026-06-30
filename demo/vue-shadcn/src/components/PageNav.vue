<script setup lang="ts">
defineProps<{
  level: number
  total: number
  dots: boolean[]
}>()

defineEmits<{ change: [lvl: number] }>()
</script>

<template>
  <div class="w-full max-w-3xl flex items-center justify-center gap-4 mt-3">
    <button
      :disabled="level <= 1"
      class="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-30 hover:bg-slate-50 text-slate-700 text-sm"
      @click="$emit('change', level - 1)"
    >← 上一页</button>
    <div class="flex gap-1.5">
      <span
        v-for="(d, i) in dots"
        :key="i"
        class="w-2.5 h-2.5 rounded-full"
        :class="d ? 'bg-green-500' : i + 1 === level ? 'bg-slate-700' : 'bg-slate-300'"
      />
    </div>
    <button
      :disabled="level >= total"
      class="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-30 hover:bg-slate-50 text-slate-700 text-sm"
      @click="$emit('change', level + 1)"
    >下一页 →</button>
  </div>
</template>
