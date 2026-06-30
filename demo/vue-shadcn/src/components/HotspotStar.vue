<script setup lang="ts">
import { ref } from 'vue'

const ARROW: Record<string, string> = { up: '↑', down: '↓', left: '←', right: '→' }

const props = defineProps<{
  regions: { id: string; dir: 'up' | 'down' | 'left' | 'right' }[]
  correctId: string
}>()
const emit = defineEmits<{ complete: [] }>()

const picked = ref<string | null>(null)
const wrong = ref<string | null>(null)

function pick(id: string) {
  if (picked.value) return
  if (id === props.correctId) {
    picked.value = id
    emit('complete')
  } else {
    wrong.value = id
    setTimeout(() => { wrong.value = null }, 400)
  }
}
</script>

<template>
  <div class="bg-white/80 rounded-lg p-2 shadow">
    <div class="grid grid-cols-2 gap-1.5">
      <button
        v-for="r in regions"
        :key="r.id"
        :disabled="!!picked"
        class="w-11 h-11 rounded-md border-2 text-xl flex items-center justify-center transition"
        :class="
          picked === r.id
            ? 'bg-green-500 border-green-600 text-white'
            : wrong === r.id
            ? 'bg-red-400 border-red-500 text-white animate-shake'
            : 'bg-white border-slate-300 hover:border-slate-500'
        "
        @click="pick(r.id)"
      >{{ ARROW[r.dir] }}</button>
    </div>
  </div>
</template>
