# react-antd ④

> **组件库对比栈（AntD）**：React 19 + TypeScript + Ant Design 5  
> LOC 最多、bundle 最大，但 AI 文档支持反而是 4 栈中最好的——揭示了"代码量"和"AI 可维护性"不是同一维度。

---

## 技术栈

| 项目 | 版本 | 说明 |
|------|------|------|
| React | 19.2 | 纯函数组件 |
| TypeScript | 6.0 | 严格类型 |
| Ant Design | 5（antd 6.5） | 阿里 enterprise 组件库 |
| cssinjs | 内置 | AntD 自研 CSS-in-JS runtime |
| Vite | 8.1 | 构建工具 |

> **无 Tailwind**：AntD 使用自研 cssinjs 和 inline style 处理样式。

---

## 项目指标

| 指标 | 数值 | vs ① react-shadcn |
|------|------|-------------------|
| 源码行数（LOC） | **1184** | +79% |
| Bundle gzip | **146 KB** | +132% |
| Playwright 测试 | **9/9 通过** | 持平 |
| console error | **0** | 持平 |
| **AI 文档支持** | **A 级** | ① 的 B 级更低 |

---

## 架构

```
src/
├── App.tsx              # 根组件，持有全局状态
├── main.tsx             # 入口，import antd/dist/reset.css 重置
├── index.css            # 最小化全局样式
│
├── components/
│   ├── DragFillStar.tsx # 拖拽填空（纯 inline style + div）
│   ├── FlipMatchStar.tsx# 翻牌配对（inline style 3D，同 ③）
│   ├── HotspotStar.tsx  # 热区点击（AntD Button）
│   ├── QuizStar.tsx     # 单选题（AntD Button）
│   ├── ModalStack.tsx   # 弹窗栈（纯 div，不用 AntD Modal）
│   ├── Header.tsx       # 顶部栏（inline style）
│   ├── PageNav.tsx      # 底部导航（AntD Button）
│   └── Confetti.tsx     # 彩带动画（Canvas）
│
├── data/
│   └── levels.ts        # 与 ① 完全相同的关卡数据
│
└── lib/
    └── storage.ts       # localStorage 持久化
```

### 为什么 LOC 最多

**原因 1：AntD 无布局组件，ModalStack 需手写**  
AntD Modal 有自己的弹窗管理机制，不适合实现多层叠加的弹窗栈。本实验的 ModalStack 需要用纯 `div` 从头实现，相比 ① 的 shadcn Dialog 多了大量 inline style 代码。

**原因 2：inline style 比 Tailwind 类名冗长**  
```tsx
// AntD 风格 — 全 inline style
<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

// ① Tailwind — 原子类
<div className="fixed inset-0 bg-black/40 flex items-center justify-center">
```

**原因 3：data + lib 层更重**  
AntD 的 storage 接口和 ① 不同（`completedStars: string[]` vs `completed: Record<number, string[]>`），data 层定义更繁琐。

### AntD 的反常优势

虽然 bundle 最大、LOC 最多，但 **AntD 的 AI 文档支持在 4 栈中最好**：

- 官方维护 6 个 `llms.txt` 文件（不同语言/框架版本）
- 官方 MCP 工具（可直接在 AI 对话中查组件 API）
- 社区文档覆盖率高，AI 训练数据充足

对于重度依赖 AI 辅助开发的团队，AntD 的这一优势是真实的——即使代码量更多，AI 能更准确地生成和修改 AntD 代码。

### 关键 Bug 记录

**Modal 不消失 Bug**：`goNextLevel` 只调用了 `setCurrentLevelIdx`，没有清空 `modalStack`，导致点击"下一关"后弹窗残留。  
**修复**：
```tsx
const goNextLevel = useCallback(() => {
  setModalStack([])   // 必须先清空，再切换关卡
  setCurrentLevelIdx(i => Math.min(i + 1, LEVELS.length - 1))
}, [])
```

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

| 维度 | ① react-shadcn | ④ react-antd |
|------|---------------|-------------|
| 样式方案 | Tailwind 原子类 | inline style + cssinjs |
| ModalStack | shadcn Dialog | 纯 div 手写 |
| 组件可直改 | ✅ 代码在仓库 | ❌ npm 黑盒 |
| AI 文档 | ✅ llms.txt | ✅✅ 6个 llms.txt + MCP |
| bundle | 63 KB | **146 KB**（+132%）|
| LOC | 662 | **1184**（+79%）|

完整对比见 [`docs/experiment-reports/comparison-report.md`](../../docs/experiment-reports/comparison-report.md)。
