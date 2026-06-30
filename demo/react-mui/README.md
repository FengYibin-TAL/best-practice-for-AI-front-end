# react-mui ③

> **组件库对比栈（MUI）**：React 19 + TypeScript + MUI v7（Material UI）  
> 与 ① react-shadcn 构成组件库对比组，验证 runtime CSS-in-JS 方案对代码量和 AI 可维护性的影响。

---

## 技术栈

| 项目 | 版本 | 说明 |
|------|------|------|
| React | 19.2 | 纯函数组件 |
| TypeScript | 6.0 | 严格类型 |
| MUI | v7（@mui/material 9.1） | Material Design 组件库 |
| Emotion | 11 | CSS-in-JS runtime（MUI 默认样式引擎） |
| Vite | 8.1 | 构建工具 |

> **无 Tailwind**：MUI 使用 `sx` prop 和 `styled()` 处理样式，不使用 Tailwind。

---

## 项目指标

| 指标 | 数值 | vs ① react-shadcn |
|------|------|-------------------|
| 源码行数（LOC） | **904** | +37% |
| Bundle gzip | **106 KB** | +68%（emotion runtime 开销） |
| Playwright 测试 | **9/9 通过** | 持平 |
| console error | **0** | 持平 |

---

## 架构

```
src/
├── App.tsx              # 根组件，持有全局状态（与 ① 基本一致）
├── main.tsx             # 入口，包裹 CssBaseline 重置默认样式
├── index.css            # 最小化全局样式（无 Tailwind）
│
├── components/
│   ├── DragFillStar.tsx # 拖拽填空（纯 inline style，无 MUI 组件）
│   ├── FlipMatchStar.tsx# 翻牌配对（3D 翻转用 inline style）
│   ├── HotspotStar.tsx  # 热区点击（MUI Button + sx prop）
│   ├── QuizStar.tsx     # 单选题（MUI Button + sx prop）
│   ├── ModalStack.tsx   # 弹窗栈（MUI Dialog）
│   ├── Header.tsx       # 顶部栏（MUI Box + Typography）
│   ├── PageNav.tsx      # 底部导航（MUI Button）
│   └── Confetti.tsx     # 彩带动画（Canvas，与 ① 相同）
│
├── data/
│   └── levels.ts        # 与 ① 完全相同的关卡数据
│
└── lib/
    └── storage.ts       # localStorage 持久化
```

### MUI 样式写法

MUI 通过 `sx` prop 接收样式，单位为 `theme.spacing`（默认 8px 倍数）：

```tsx
// MUI sx prop 示例
<Box sx={{ display: 'flex', gap: 1, borderRadius: 2 }}>
  <Button variant="contained" sx={{ px: 3, py: 1 }}>下一关</Button>
</Box>

// Dialog 宽度必须用字符串，数字会被解释为 spacing 单位
// ❌ 错误：sx: { width: 288 }  → 288 × 8px = 2304px
// ✅ 正确：sx: { width: '288px' }
```

对比 Tailwind：
```tsx
// Tailwind — 自文档，AI 无需上下文
<div className="flex gap-2 rounded-lg">
  <button className="px-3 py-1 bg-slate-900 text-white">下一关</button>
</div>
```

### 关键 Bug 记录

**MUI Dialog 宽度 Bug**：`sx: { width: 288 }` 被 MUI 解释为 `theme.spacing(288) = 2304px`，被 `maxWidth: '90vw'` 截断导致弹窗过宽。  
**修复**：改为 `sx: { width: '288px' }`（字符串绕过 spacing 解析）。

**3D 翻牌无法用 sx 实现**：`perspective` 和 `backface-visibility` 是 CSS 非标准属性，MUI sx 不支持，必须用 inline `style` 属性：
```tsx
<div style={{ perspective: '600px', transformStyle: 'preserve-3d' }}>
```
这是 MUI 组件 LOC 比 ① 多 37% 的主要原因之一。

### 为什么 AI 文档评级低

MUI 的 AI 支持（llms.txt / MCP 工具）几乎为空——没有官方 llms.txt，无专用 MCP。AI 生成 MUI 代码时依赖训练数据，无法获取最新 API。在 4 栈中 AI 文档支持评级最低（D 级）。

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

| 维度 | ① react-shadcn | ③ react-mui |
|------|---------------|-------------|
| 样式方案 | Tailwind 原子类（编译期） | MUI sx + emotion（运行时） |
| 样式可读性 | `className="flex gap-2"` | `sx={{ display:'flex', gap: 1 }}` |
| AI 需要了解 | Tailwind 类名（自文档） | MUI 主题 token + spacing 单位 |
| 3D CSS | inline style | 只能 inline style |
| 组件可直改 | ✅ 代码在仓库 | ❌ npm 黑盒 |
| AI 文档支持 | ✅ llms.txt | ❌ 无 |

完整对比见 [`docs/experiment-reports/comparison-report.md`](../../docs/experiment-reports/comparison-report.md)。
