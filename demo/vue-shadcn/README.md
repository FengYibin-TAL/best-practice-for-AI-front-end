# vue-shadcn ②

> **框架对比栈**：Vue 3.5 + TypeScript + Tailwind v4 + shadcn-vue（copy-in）  
> 与 ① react-shadcn 构成框架对比组，控制变量：相同功能、相同样式方案，框架不同。

---

## 技术栈

| 项目 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5 | `<script setup lang="ts">` SFC |
| TypeScript | 6.0 | 严格类型 |
| Tailwind CSS | v4 | 原子类，与 ① 完全对齐 |
| Vite | 8.1 | 构建工具 |
| shadcn-vue | copy-in | Vue 版 shadcn 组件模式 |

---

## 项目指标

| 指标 | 数值 | vs ① react-shadcn |
|------|------|-------------------|
| 源码行数（LOC） | **732** | +11% |
| Bundle gzip | **28 KB** | −55%（Vue3 + Tailwind 更轻） |
| Playwright 测试 | **9/9 通过** | 持平 |
| console error | **0** | 持平 |

---

## 架构

```
src/
├── App.vue              # 根组件（<script setup>），持有全局状态
├── main.ts              # 入口，挂载到 #app
├── style.css            # Tailwind 入口
│
├── components/
│   ├── DragFillStar.vue # 拖拽填空
│   ├── FlipMatchStar.vue# 翻牌配对
│   ├── HotspotStar.vue  # 热区点击
│   ├── QuizStar.vue     # 单选题
│   ├── ModalStack.vue   # 模态弹窗栈
│   ├── Header.vue       # 顶部栏
│   ├── PageNav.vue      # 底部导航
│   └── Confetti.vue     # 彩带动画
│
├── data/
│   └── levels.ts        # 与 ① 完全相同的关卡数据
│
└── lib/
    └── storage.ts       # localStorage 持久化
```

### Vue SFC 与 React 的写法对比

**状态管理**：
```vue
<!-- Vue SFC — script setup -->
<script setup lang="ts">
const levelIdx = ref(0)
const completed = ref<Record<number, Set<string>>>({})

watchEffect(() => {
  saveProgress({ level: levelIdx.value, ... })
})
</script>
```
```tsx
// React — 函数组件
const [levelIdx, setLevelIdx] = useState(0)
const [completed, setCompleted] = useState<Record<number, Set<string>>>({})

useEffect(() => {
  saveProgress({ level: levelIdx, ... })
}, [levelIdx, completed])
```

**模板语法差异**：
- Vue `<template>` + `v-for` / `v-if` vs React JSX
- Vue `@click` / `:class` vs React `onClick` / `className`
- `<script setup>` 比 React 稍多模板代码，但差距不大（+11% LOC）

### 关键发现

**为什么 Vue bundle 更小？**  
Vue 3 的运行时比 React 19 轻约 35%，加上 Tailwind 激进的树摇，`vue-shadcn` 打包后仅 28 KB gzip，是 4 栈中最小的。

**AI 追加膨胀假设**：  
"Vue SFC 在 AI 持续迭代时比 JSX 更容易膨胀"是一个合理假设，但**未被本次单次快照证实**。需要 Method B（迭代 5+ 轮）专项实验验证。

---

## 快速启动

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build
npm run preview  # → http://localhost:4173
```

**运行测试**：
```bash
cd ../_test
node test.mjs
```

---

## 与 ① 的关键差异

| 文件 | React 写法 | Vue 写法 |
|------|-----------|---------|
| App | `useState` + `useCallback` | `ref` + `watchEffect` |
| 拖拽 | `useRef` 处理时序 | `ref` + 同步赋值 |
| 模板 | JSX inline | `<template>` + 指令 |
| mount point | `#root` | `#app` |
| TS 类型文件 | `.tsx` | `.vue` + `<script setup lang="ts">` |

完整对比见 [`docs/experiment-reports/comparison-report.md`](../../docs/experiment-reports/comparison-report.md)。
