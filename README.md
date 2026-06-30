# AI 时代前端技术栈最佳实践

> **目标**：通过可复现的对比实验，回答一个具体问题：AI 辅助开发场景下，哪套前端技术栈的代码最精简、最易维护、AI 可读性最高？

---

## 项目结构

```
.
├── demo/                          # 代码实验主体
│   ├── react-shadcn/              # ① React 19 + Tailwind v4 + shadcn/ui（copy-in）
│   ├── vue-shadcn/                # ② Vue 3.5 + Tailwind v4 + shadcn-vue（copy-in）
│   ├── react-mui/                 # ③ React 19 + MUI 7（runtime CSS-in-JS）
│   ├── react-antd/                # ④ React 19 + Ant Design 5（runtime CSS-in-JS）
│   ├── react-shadcn-mf/           # ⑤ 微前端版本（Module Federation，基于①拆分）
│   ├── spec/                      # 4 栈共享功能规格 + mock 数据
│   └── _test/                     # Playwright 统一测试（9 项，4 栈全通过）
│
└── docs/                          # 所有文档与报告
    ├── experiment-reports/        # 本项目实验产出报告
    │   ├── comparison-report.md   # 4 栈 + MF 对比报告（数据归因）
    │   ├── prescriptive-report.md # AI 时代前端处方报告（选型指导）
    │   ├── measurements/          # 原始测量数据（LOC/Bundle/框架结构/MF）
    │   ├── images/                # 报告配图
    │   └── pdf/                   # PDF 导出版
    ├── 全网方案调研/               # AI 时代前端技术栈全网方案调研报告（v4.6）
    └── web-fetch-experiment/      # Web fetch 对比实验（独立侧实验）
```

---

## 实验对象

5 个技术栈实现同一个"Epic Labs 复杂 demo"——3 关卡、4 种交互组件（拖填、翻牌、热区点击、单选题）、Modal 栈、localStorage 持久化、彩带动画、徽章解锁。

| 栈 | 框架 | 样式方案 | 组件库 | 架构 |
|----|------|---------|--------|------|
| ① react-shadcn | React 19.2 | Tailwind v4 | shadcn/ui（copy-in） | SPA |
| ② vue-shadcn | Vue 3.5 | Tailwind v4 | shadcn-vue（copy-in） | SPA |
| ③ react-mui | React 19.2 | MUI sx / emotion | MUI v7 | SPA |
| ④ react-antd | React 19.2 | inline style | Ant Design 5 | SPA |
| ⑤ react-shadcn-mf | React 19.2 | Tailwind v4 | shadcn/ui | 微前端（MF） |

---

## 核心结论

**首选：React 19 + Tailwind v4 + shadcn/ui（SPA）**

- 最精简代码量（662 LOC），纯函数组件 + Tailwind 原子类对 AI 可读性最高
- 合理 bundle（63 KB gzip），shadcn copy-in 策略让 AI 可直接读改组件
- Playwright 9/9 通过，0 console error

**微前端（⑤）结论**：相同功能 MF 版 LOC +39%（920 LOC），bundle 首屏 +105%（129 KB）。小规模项目架构开销大于收益，微前端价值需在多团队/大规模场景才能显现。

详见 [`docs/experiment-reports/comparison-report.md`](docs/experiment-reports/comparison-report.md) 和 [`docs/experiment-reports/prescriptive-report.md`](docs/experiment-reports/prescriptive-report.md)。

---

## 快速启动

```bash
# SPA 栈（①-④）
cd demo/react-shadcn   # 或 vue-shadcn / react-mui / react-antd
npm install
npm run dev

# 微前端栈（⑤）
cd demo/react-shadcn-mf
./start-preview.sh     # 构建并启动 shell + level1/2/3 共 4 个服务
```

**运行 Playwright 测试**（SPA 栈需先 `npm run build` + `npm run preview`）：

```bash
cd demo/_test
npm install
# SPA 栈（默认 4173 端口）
node test.mjs
# 微前端栈
URL=http://localhost:5174/ node test.mjs
```

---

## 相关报告

| 文档 | 说明 |
|------|------|
| [4 栈 + MF 对比报告](docs/experiment-reports/comparison-report.md) | Bundle 体积、LOC、AI 文档支持、SPA vs MF 对比，含数据图 |
| [前端处方报告](docs/experiment-reports/prescriptive-report.md) | 选型决策树、代码写法 5 要点、shadcn 包管理模式、组件覆盖对比 |
| [全网方案调研](docs/全网方案调研/AI-Native-Frontend-Tech-Stack.md) | AI 时代前端技术栈全网方案调研（独立调研，v4.6）|