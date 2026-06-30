<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  question: string
  options: { id: string; text: string; correct: boolean }[]
}>()
const emit = defineEmits<{ complete: [] }>()

const picked = ref<string | null>(null)
const done = ref(false)

function choose(o: { id: string; correct: boolean }) {
  if (done.value) return
  if (o.correct) {
    picked.value = o.id
    done.value = true
    emit('complete')
  } else {
    picked.value = o.id
    setTimeout(() => { picked.value = null }, 400)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-3 w-52">
    <p class="text-xs font-medium mb-2 text-slate-700">{{ question }}</p>
    <div class="flex flex-col gap-1">
      <button
        v-for="o in options"
        :key="o.id"
        :disabled="done"
        class="px-2.5 py-1.5 rounded border text-xs transition text-left"
        :class="
          done && o.correct
            ? 'bg-green-100 border-green-500'
            : picked === o.id
            ? 'bg-red-100 border-red-500 animate-shake'
            : 'bg-white border-slate-300 hover:border-slate-500'
        "
        @click="choose(o)"
      >{{ o.text }}</button>
    </div>
  </div>
</template>
