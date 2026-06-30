<script setup lang="ts">
import { ref } from 'vue'

interface Card { id: string; pairId: string; emoji: string }

const props = defineProps<{ cards: Card[] }>()
const emit = defineEmits<{ complete: [] }>()

const flipped = ref(new Set<string>())
const matched = ref(new Set<string>())
const attempts = ref(0)
const lock = ref(false)

function click(c: Card) {
  if (lock.value || matched.value.has(c.id) || flipped.value.has(c.id)) return
  const nf = new Set(flipped.value)
  nf.add(c.id)
  flipped.value = nf
  if (nf.size === 2) {
    attempts.value++
    lock.value = true
    const [a, b] = [...nf]
    const ca = props.cards.find((x) => x.id === a)!
    const cb = props.cards.find((x) => x.id === b)!
    if (ca.pairId === cb.pairId) {
      setTimeout(() => {
        const nm = new Set(matched.value)
        nm.add(a)
        nm.add(b)
        matched.value = nm
        if (nm.size === props.cards.length) emit('complete')
        flipped.value = new Set()
        lock.value = false
      }, 400)
    } else {
      setTimeout(() => {
        flipped.value = new Set()
        lock.value = false
      }, 800)
    }
  }
}

function isUp(id: string) { return flipped.value.has(id) || matched.value.has(id) }
</script>

<template>
  <div class="bg-white/80 rounded-lg p-2 shadow">
    <div class="grid grid-cols-3 gap-1.5">
      <button
        v-for="c in cards"
        :key="c.id"
        class="flip-card relative w-12 h-14"
        style="perspective: 600px"
        :disabled="matched.has(c.id)"
        aria-label="card"
        @click="click(c)"
      >
        <div
          class="relative w-full h-full transition-transform duration-300"
          style="transform-style: preserve-3d"
          :style="{ transform: isUp(c.id) ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
        >
          <div
            class="absolute inset-0 rounded-md bg-slate-700 flex items-center justify-center text-white text-lg"
            style="backface-visibility: hidden"
          >?</div>
          <div
            class="absolute inset-0 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xl"
            style="backface-visibility: hidden; transform: rotateY(180deg)"
          >{{ c.emoji }}</div>
        </div>
      </button>
    </div>
    <p class="text-[10px] text-slate-500 mt-1 text-center">尝试 {{ attempts }}</p>
  </div>
</template>
