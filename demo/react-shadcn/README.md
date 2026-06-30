# react-shadcn ①

> **实验基准栈**：React 19 + TypeScript + Tailwind v4 + shadcn/ui（copy-in）  
> 4 栈对比实验中的参考实现，AI 可维护性最高，LOC 最精简。

---

## 技术栈

| 项目 | 版本 | 说明 |
|------|------|------|
| React | 19.2 | 纯函数组件 + Hooks，无 class component |
| TypeScript | 6.0 | 严格类型，接口驱动 |
| Tailwind CSS | v4 | 原子类，编译期生成，无 runtime |
| Vite | 8.1 | 构建工具，ESM 原生 |
| shadcn/ui | copy-in | 组件代码在仓库内，可直接读改 |

> shadcn/ui 在本项目中指"copy-in 组件模式"——组件源码直接在 `src/components/` 里，
> 而非从 npm 包 import。AI 可以直接 `Read` 和 `Edit` 每个组件文件。

---

## 项目指标

| 指标 | 数值 |
|------|------|
| 源码行数（LOC） | **662** |
| Bundle gzip | **63 KB** |
| Playwright 测试 | **9/9 通过** |
| console error | **0** |

---

## 架构

```
src/
├── App.tsx              # 根组件，持有全局状态（关卡/完成情况/Modal/彩带）
├── main.tsx             # 入口，挂载到 #root
├── index.css            # Tailwind 入口（@import "tailwindcss"）
│
├── components/
│   ├── DragFillStar.tsx # 拖拽填空组件（pointer events + RAF 动画）
│   ├── FlipMatchStar.tsx# 翻牌配对组件
│   ├── HotspotStar.tsx  # 热区点击组件
│   ├── QuizStar.tsx     # 单选题组件
│   ├── ModalStack.tsx   # 模态弹窗栈（page-complete / final / help）
│   ├── Header.tsx       # 顶部：关卡进度 + 徽章 + 帮助按钮
│   ├── PageNav.tsx      # 底部：上一关 / 下一关 / 进度点
│   └── Confetti.tsx     # 彩带动画（Canvas 2D）
│
├── data/
│   └── levels.ts        # 3 关卡数据（星型配置、背景色、位置）
│
└── lib/
    └── storage.ts       # localStorage 读写（进度持久化）
```

### 状态流

```
App.tsx（全局状态）
  ├── currentLevelIdx  → 当前关卡
  ├── completed        → 已完成星型 ID（按关卡分组）
  ├── ratings          → 各关卡星级
  ├── modals           → 弹窗栈
  └── confetti         → 彩带触发计数
       │
       ├── 传 props → Header（分数、徽章）
       ├── 传 props → PageNav（导航）
       ├── 传 props → ModalStack（弹窗）
       └── 渲染 StarView（按类型分发到各星型组件）
              │
              └── 星型完成 → completeStar(id) → 回调到 App
```

### 关键设计决策

**1. useRef 处理拖拽时序**  
React state 更新是异步的，`onPointerUp` 执行时 `dragId` state 可能还是旧值。`DragFillStar` 用 `dragIdRef` 同步追踪当前拖拽 ID：
```tsx
const dragIdRef = useRef<string | null>(null)
// onPointerDown: dragIdRef.current = pid （同步写）
// onPointerUp:   const pid = dragIdRef.current （同步读）
```

**2. Tailwind v4 原子类**  
样式即文档——每个类名都是自描述的，AI 无需查 MUI 主题 token 即可理解：
```tsx
<div className="relative w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden">
```

**3. 无全局 store**  
所有状态集中在 `App.tsx`，通过 props 向下传递。避免 context/reducer 的隐式依赖。

---

## 快速启动

```bash
npm install
npm run dev      # 开发服务器 → http://localhost:5173
npm run build    # 生产构建
npm run preview  # 预览构建产物 → http://localhost:4173
```

**运行测试**（需先 build + preview）：
```bash
cd ../_test
node test.mjs    # 默认打 http://localhost:4173
```

---

## 与其他栈对比

| 维度 | ① react-shadcn | ② vue-shadcn | ③ react-mui | ④ react-antd |
|------|:-:|:-:|:-:|:-:|
| LOC | **662** | 732 | 904 | 1184 |
| Bundle gzip | 63 KB | **28 KB** | 106 KB | 146 KB |
| 样式方案 | Tailwind 原子类 | Tailwind 原子类 | MUI sx/emotion | inline style |
| AI 可读性 | ✅ 高 | ✅ 高 | ⚠️ 中（需知 token） | ✅ 高 |
| 组件可直改 | ✅ | ✅ | ❌ 黑盒 | ❌ 黑盒 |

完整对比见 [`docs/experiment-reports/comparison-report.md`](../../docs/experiment-reports/comparison-report.md)。
