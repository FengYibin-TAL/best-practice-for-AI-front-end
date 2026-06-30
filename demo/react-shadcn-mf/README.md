# react-shadcn-mf ⑤

> **微前端架构对比栈**：React 19 + TypeScript + Tailwind v4 + Module Federation  
> 基于 ① react-shadcn 拆分，量化"SPA vs 微前端"在代码量、bundle、AI 可维护性三个维度的架构差异成本。

---

## 技术栈

| 项目 | 版本 | 说明 |
|------|------|------|
| React | 19.2 | 纯函数组件 |
| TypeScript | 6.0 | 严格类型 |
| Tailwind CSS | v4 | 原子类，由 Shell 统一生成 |
| Vite | 8.1 | 构建工具 |
| @originjs/vite-plugin-federation | 1.4.1 | Module Federation 实现 |

---

## 项目指标

| 指标 | 数值 | vs ① SPA react-shadcn |
|------|------|----------------------|
| 总 LOC（4 个子应用之和） | **920** | +39%（类型重复 + 中间层） |
| Bundle 首屏 gzip（shell + level1） | **129 KB** | +105%（preview 模式 React 未共享） |
| Bundle 总计（3 关全加载） | **258 KB** | +310% |
| Playwright 测试 | **9/9 通过** | 持平 |
| console error | **0** | 持平 |

> **bundle 说明**：`vite preview` 静态模式下各子应用各自携带 react + react-dom（各 ~57KB）。
> 生产部署（CDN + webpack server）中 React singleton shared 生效后，首屏估算降至 ~20 KB。

---

## 架构

### 拆分方式：按关卡划分子应用

```
react-shadcn-mf/
├── shell/             # Host（主应用壳）
│   ├── src/
│   │   ├── App.tsx        # 路由 + React.lazy 动态加载 remote
│   │   ├── components/    # 全局 UI：Header / PageNav / ModalStack / Confetti
│   │   ├── data/levels.ts # 关卡元数据（背景色、星数，不含星型配置）
│   │   └── lib/storage.ts # localStorage（key: epic-labs-mf-v1）
│   └── vite.config.ts     # federation host，声明 3 个 remotes
│
├── level1/            # Remote 子应用：第 1 关
│   ├── src/
│   │   ├── LevelApp.tsx       # expose 入口，接收 props
│   │   ├── components/        # DragFillStar + HotspotStar
│   │   └── data/level.ts      # 第 1 关数据
│   └── vite.config.ts         # federation remote，exposes ./LevelApp
│
├── level2/            # Remote 子应用：第 2 关（FlipMatch + Quiz）
├── level3/            # Remote 子应用：第 3 关（DragFill + Hotspot + Quiz）
└── start-preview.sh   # 一键构建 + 启动全部服务
```

### 状态流

```
Shell App.tsx（持有全局状态）
  ├── completed: Record<number, Set<string>>  ← 哪些星完成了
  ├── levelIdx: number                         ← 当前关卡
  ├── modals / confetti / ratings             ← UI 状态
  │
  └── React.lazy(() => import('level1/LevelApp'))
         ↓ props
      LevelApp({ completed: Set<string>, onComplete: (starId) => void })
         ↓ 内部渲染画布 + 星型组件
         ↓ 完成时 requestAnimationFrame(() => onComplete(starId))
         ↓ Shell 的 completeStar 更新全局 completed
```

**设计原则**：
- Shell 持有所有状态，子应用**无自己的状态**（纯 props 驱动）
- 跨 MF 边界调用 Shell setState 时，用 `requestAnimationFrame` 延迟，避免 React 跨实例 warning
- Tailwind CSS 由 Shell 统一生成（Shell 的 `@source` 指令扫描所有子应用 tsx 文件）

### Module Federation 配置

**Shell（host）**：
```ts
// shell/vite.config.ts
federation({
  name: 'shell',
  // Local preview only — update for production deployment
  remotes: {
    level1: 'http://localhost:5175/assets/remoteEntry.js',
    level2: 'http://localhost:5176/assets/remoteEntry.js',
    level3: 'http://localhost:5177/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom'],  // singleton，避免多 React 实例
})
```

**子应用（remote）**：
```ts
// levelN/vite.config.ts
federation({
  name: 'level1',
  filename: 'remoteEntry.js',
  exposes: { './LevelApp': './src/LevelApp.tsx' },
  shared: ['react', 'react-dom'],
})
```

---

## 快速启动

### 方式一：一键脚本（推荐）

```bash
cd demo/react-shadcn-mf
./start-preview.sh
```

等待输出：
```
  Shell:  http://localhost:5174
  Level1: http://localhost:5175
  Level2: http://localhost:5176
  Level3: http://localhost:5177

Press Ctrl+C to stop all servers.
```

浏览器打开 **http://localhost:5174**。

### 方式二：手动分步（便于调试）

每个子目录独立启动，需开 4 个终端：

```bash
# 终端 1
cd level1 && npm run build && npm run preview   # → http://localhost:5175

# 终端 2
cd level2 && npm run build && npm run preview   # → http://localhost:5176

# 终端 3
cd level3 && npm run build && npm run preview   # → http://localhost:5177

# 终端 4（等前三个就绪后）
cd shell  && npm run build && npm run preview   # → http://localhost:5174
```

> ⚠️ 每次 rebuild 后需要手动 patch（脚本已包含此步骤）：
> ```bash
> # macOS
> for dir in level1 level2 level3; do
>   sed -i '' "s/a(\`__v__css__\([^,]*\)\`,/a([\`__v__css__\1\`],/g" \
>     "$dir/dist/assets/remoteEntry.js"
> done
> ```

### 运行测试

```bash
cd ../_test
URL=http://localhost:5174/ node test.mjs
```

期望结果：9/9 通过，0 console error。

---

## 端口规划

| 服务 | dev 端口 | preview 端口 |
|------|---------|-------------|
| shell | 5200 | **5174** |
| level1 | 5201 | **5175** |
| level2 | 5202 | **5176** |
| level3 | 5203 | **5177** |

---

## 已知工程问题

### 1. vite-plugin-federation CSS 注入 Bug

`@originjs/vite-plugin-federation` 1.4.x 生成的 `remoteEntry.js` 中，`dynamicLoadingCss` 函数期待数组参数，但实际传入的是字符串，导致运行时 `e.forEach is not a function` 错误，整个子应用无法加载。

**Workaround**：每次 build 后用 `sed` 将字符串包装为数组：
```
a(`__v__css__...`,  →  a([`__v__css__...`],
```
已固化在 `start-preview.sh` 中自动执行。

### 2. 跨 MF 边界 React setState Warning

子应用通过 props 回调触发 Shell setState 时，React 严格模式报 "Cannot update a component while rendering a different component"。

**修复**：子应用组件里用 `requestAnimationFrame` 延迟 `onComplete()` 调用，推迟到下一帧再更新父组件状态。

### 3. Tailwind CSS 作用域

子应用不独立运行 Tailwind 编译（已从 vite.config 中移除 `@tailwindcss/vite` plugin）。所有 Tailwind 类名由 Shell 统一生成，Shell 的 `src/index.css` 用 `@source` 指令扫描所有子应用：
```css
@import "tailwindcss";
@source "../../level1/src/**/*.tsx";
@source "../../level2/src/**/*.tsx";
@source "../../level3/src/**/*.tsx";
```

---

## SPA vs 微前端：架构对比

| 维度 | ① SPA react-shadcn | ⑤ MF react-shadcn-mf |
|------|-------------------|----------------------|
| 总 LOC | 662 | **920（+39%）** |
| 首屏 bundle | 63 KB | **129 KB（+105%）** |
| 构建复杂度 | 1 个 vite build | **4 个 vite build + patch** |
| AI 定位 bug | 单仓库全局搜索 | 需判断在哪个子应用 |
| AI 修改组件 | 直接改组件文件 | 相同，但路径更深 |
| 状态追踪 | 全在 App.tsx | shell + props 跨边界 |
| 适用场景 | 中小项目，单团队 | 多团队独立部署，大规模 |

**结论**：本实验规模（900 LOC）对微前端而言偏小，架构开销大于收益。微前端的价值在多团队/大规模场景下才能体现。

完整分析见 [`docs/experiment-reports/comparison-report.md`](../../docs/experiment-reports/comparison-report.md) 第 8 章。
