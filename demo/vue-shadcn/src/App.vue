<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { LEVELS } from './data/levels'
import { loadProgress, saveProgress, clearProgress } from './lib/storage'
import type { Progress } from './lib/storage'
import Header from './components/Header.vue'
import PageNav from './components/PageNav.vue'
import DragFillStar from './components/DragFillStar.vue'
import FlipMatchStar from './components/FlipMatchStar.vue'
import HotspotStar from './components/HotspotStar.vue'
import QuizStar from './components/QuizStar.vue'
import ModalStack from './components/ModalStack.vue'
import type { Modal } from './components/ModalStack.vue'
import Confetti from './components/Confetti.vue'

// --- init from localStorage ---
let mid = 0
const newModal = (m: Omit<Modal, 'id'>): Modal => ({ ...m, id: `m${++mid}` })

const savedProgress = loadProgress()

const levelIdx = ref(savedProgress ? Math.min(savedProgress.level, LEVELS.length - 1) : 0)

function initCompleted(): Record<number, Set<string>> {
  const c: Record<number, Set<string>> = {}
  if (savedProgress?.completed) {
    Object.entries(savedProgress.completed).forEach(([k, v]) => { c[+k] = new Set(v) })
  }
  return c
}

const completed = ref<Record<number, Set<string>>>(initCompleted())

const ratings = ref<Record<number, number>>(savedProgress?.ratings ?? {})
const modals = ref<Modal[]>([])
const confetti = ref(0)
const round = ref(0)

// --- computed ---
const level = computed(() => LEVELS[levelIdx.value])
const doneSet = computed(() => completed.value[levelIdx.value] ?? new Set<string>())
const doneCount = computed(() => doneSet.value.size)
const totalScore = computed(() => Object.values(completed.value).reduce((s, set) => s + set.size, 0))
const allLevelsDone = computed(() => LEVELS.every((lv, i) => (completed.value[i]?.size ?? 0) >= lv.stars.length))
const badge = computed(() => totalScore.value >= 8)

// --- persistence ---
watchEffect(() => {
  const p: Progress = {
    level: levelIdx.value,
    completed: Object.fromEntries(
      Object.entries(completed.value).map(([k, v]) => [k, [...v]])
    ) as Record<number, string[]>,
    ratings: ratings.value,
    total: totalScore.value,
  }
  saveProgress(p)
})

// --- level completion watcher ---
watchEffect(() => {
  if (doneCount.value >= level.value.stars.length && !ratings.value[levelIdx.value]) {
    ratings.value = { ...ratings.value, [levelIdx.value]: 3 }
    confetti.value++
    if (!allLevelsDone.value) {
      modals.value = [...modals.value, newModal({ kind: 'page-complete', rating: 3, total: level.value.id })]
    }
  }
})

// --- final modal watcher ---
watchEffect(() => {
  if (allLevelsDone.value && !modals.value.some((m) => m.kind === 'final')) {
    modals.value = [...modals.value, newModal({ kind: 'final', score: totalScore.value, badge: badge.value })]
  }
})

// --- keyboard ---
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && modals.value.length) {
    modals.value = modals.value.slice(0, -1)
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

// --- actions ---
function completeStar(starId: string) {
  const cur = new Set(completed.value[levelIdx.value] ?? [])
  if (cur.has(starId)) return
  cur.add(starId)
  completed.value = { ...completed.value, [levelIdx.value]: cur }
}

function closeTop() { modals.value = modals.value.slice(0, -1) }
function openHelp() { modals.value = [...modals.value, newModal({ kind: 'help' })] }
function nextLevel() {
  modals.value = modals.value.slice(0, -1)
  levelIdx.value = Math.min(LEVELS.length - 1, levelIdx.value + 1)
}
function replayLevel() {
  modals.value = modals.value.slice(0, -1)
  completed.value = { ...completed.value, [levelIdx.value]: new Set() }
  const r = { ...ratings.value }
  delete r[levelIdx.value]
  ratings.value = r
  round.value++
}
function replayAll() {
  modals.value = []
  completed.value = {}
  ratings.value = {}
  levelIdx.value = 0
  round.value++
  clearProgress()
}
function onNavChange(lvl: number) { levelIdx.value = lvl - 1 }
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-4 flex flex-col items-center font-sans">
    <Header :level="level.id" :total="LEVELS.length" :score="totalScore" :badge="badge" @help="openHelp" />

    <div
      :key="levelIdx"
      class="relative w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
      :style="{ background: level.bg, aspectRatio: '4 / 3' }"
    >
      <div
        v-for="star in level.stars"
        :key="`${levelIdx}-${round}-${star.id}`"
        class="absolute"
        :style="{ left: `${star.pos.x * 100}%`, top: `${star.pos.y * 100}%`, transform: 'translate(-50%,-50%)' }"
      >
        <div v-if="star.type === 'drag-fill' && star.dragFill" class="w-56 h-40 bg-white/20 rounded-lg">
          <DragFillStar :pieces="star.dragFill.pieces" :slots="star.dragFill.slots" @complete="completeStar(star.id)" />
        </div>
        <FlipMatchStar
          v-else-if="star.type === 'flip-match' && star.flipMatch"
          :cards="star.flipMatch.cards"
          @complete="completeStar(star.id)"
        />
        <HotspotStar
          v-else-if="star.type === 'hotspot' && star.hotspot"
          :regions="star.hotspot.regions"
          :correct-id="star.hotspot.correctId"
          @complete="completeStar(star.id)"
        />
        <QuizStar
          v-else-if="star.type === 'quiz-single' && star.quiz"
          :question="star.quiz.question"
          :options="star.quiz.options"
          @complete="completeStar(star.id)"
        />
      </div>
    </div>

    <PageNav
      :level="level.id"
      :total="LEVELS.length"
      :dots="LEVELS.map((_, i) => (completed[i]?.size ?? 0) >= LEVELS[i].stars.length)"
      @change="onNavChange"
    />

    <ModalStack
      :modals="modals"
      @close="closeTop"
      @next="nextLevel"
      @replay="replayLevel"
      @replay-all="replayAll"
    />

    <Confetti :run="confetti" />
  </div>
</template>
