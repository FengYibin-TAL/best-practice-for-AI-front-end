<script lang="ts">
export interface Modal {
  id: string
  kind: 'page-complete' | 'final' | 'help'
  rating?: number
  score?: number
  total?: number
  badge?: boolean
}
</script>

<script setup lang="ts">
defineProps<{
  modals: Modal[]
}>()

defineEmits<{
  close: []
  next: []
  replay: []
  replayAll: []
}>()
</script>

<template>
  <template v-for="(m, i) in modals" :key="m.id">
    <div
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
      :style="{ zIndex: 50 + i }"
      @click="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-72 text-center" @click.stop>
        <template v-if="m.kind === 'page-complete'">
          <div class="text-4xl mb-2">🎉</div>
          <h2 class="text-xl font-bold text-slate-800">第 {{ m.total }} 关完成！</h2>
          <p class="text-2xl mt-1">{{ '⭐'.repeat(m.rating || 1) }}{{ '☆'.repeat(3 - (m.rating || 1)) }}</p>
          <div class="flex gap-2 mt-4 justify-center">
            <button class="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50" @click="$emit('replay')">重玩</button>
            <button class="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700" @click="$emit('next')">下一关</button>
          </div>
        </template>
        <template v-else-if="m.kind === 'final'">
          <div class="text-4xl mb-2">🏆</div>
          <h2 class="text-xl font-bold text-slate-800">全部完成！</h2>
          <p class="text-slate-500 mt-1">总分 <span class="font-bold text-slate-800">{{ m.score }}</span></p>
          <p class="text-2xl mt-2">{{ m.badge ? '🏅 徽章解锁' : '' }}</p>
          <div class="flex gap-2 mt-4 justify-center">
            <button class="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700" @click="$emit('replayAll')">重玩全部</button>
          </div>
        </template>
        <template v-else-if="m.kind === 'help'">
          <h2 class="text-lg font-bold text-slate-800 mb-2">玩法</h2>
          <p class="text-sm text-slate-600 text-left leading-relaxed">
            拖拽：把图标拖到虚线框。<br>
            翻牌：翻开两张配对。<br>
            热点：点正确方向。<br>
            测验：选正确答案。<br>
            完成所有星过关；Escape 关弹窗。
          </p>
          <div class="mt-4">
            <button class="px-4 py-2 rounded-md bg-slate-900 text-white" @click="$emit('close')">知道了</button>
          </div>
        </template>
      </div>
    </div>
  </template>
</template>
