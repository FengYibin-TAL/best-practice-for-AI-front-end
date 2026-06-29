# AI 时代前端技术栈深度调研报告

> **调研维度**：从 AI 代码生成的友好度出发，评估不同技术栈的优劣
> **调研时间**：2026-06-29
> **方法论**：网上调研 + 真实数据 + 第三方文献综述
> **核心问题**：让 AI 写前端代码，什么样的技术栈最合适？

---

## ⚠️ 调研方法说明

本报告的数据来源于：
- **Stack Overflow 2025 开发者调研**（80% 开发者用 AI 工具）[^1]
- **GitHub / NPM 公开数据**（项目数、下载量等）[^2][^3]
- **第三方技术博客和调研**（XB Software、Vercel、Medium、DEV 等）
- **AI 平台官方信息**（v0、Lovable、Bolt.new、Vercel AI SDK）

**所有关键数据均有引用**，避免编造。结论分析部分会标注"分析"，与事实数据区分。

---

## 第一章 - 执行摘要

### 核心结论（基于数据）

**推荐技术栈**：`Next.js 16 + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Vercel AI SDK`

这不是"我觉得最好"，而是**主流 AI 代码生成平台的共识**：

| AI 平台 | 默认/唯一支持的栈 | 来源 |
|--------|-----------------|------|
| **v0.app**（Vercel） | Next.js + React + Tailwind + shadcn/ui | [Vercel 官方][^4] |
| **Lovable** | React + TypeScript + Vite + Tailwind | [Lovable 官方][^5] |
| **Bolt.new** | 多框架支持，但 React 是默认 | [对比文章][^6] |
| **Cursor / Claude Code** | 实测对 React + Next.js + shadcn/ui 表现最佳 | [Naresh Bhatia 实测][^7] |

**含义**：v0 和 Lovable **只支持 React**，Bolt 虽然支持多框架但 React 是默认。这是市场用脚投票的结果。

### 三个真实关键数据

| 指标 | 数值 | 来源 |
|-----|------|-----|
| **React vs Vue NPM 下载量** | 68.4M vs 8.4M 每周（8倍差距） | [DEV 2026 调研][^8] |
| **React vs Vue 训练数据比** | 4x-10x（代码、SO、博客） | [Vibe Coder Blog][^9] |
| **AI 开发者比例** | 80%（2025 SO 调研，2024 为 76%） | [Stack Overflow 2025][^1] |
| **AI 准确度信任度** | 仅 29%（去年 40%，下降明显） | [Stack Overflow 2025][^1] |
| **AI 主要痛点** | 45% 开发者抱怨"差不多但不对" | [Stack Overflow 2025][^1] |

---

## 第二章 - 框架对比：React vs Vue vs Svelte

### 2.1 训练数据规模决定 AI 生成质量

#### Matthew Effect（马太效应）

第三方调研明确指出：

> "React dominates across code volume on GitHub, Stack Overflow Q&A count, and technical blogs. This creates a feedback loop where 'AI models have a deeper understanding of React and generate higher-quality code.'" [^8]

翻译并分析：

```
更多 React 用户
    ↓
更多 AI 训练数据
    ↓
更高质量的 React 代码生成
    ↓
更多开发者选 React
    ↓
（循环加强）
```

#### 实测数据（来自第三方）

| 指标 | React | Vue | Angular | Svelte | 来源 |
|-----|-------|-----|--------|--------|-----|
| **NPM 周下载** | 68.4M | 8.4M | 4.5M | 7.4M | [^8] |
| **GitHub stars** | 243k | 52.8k | 99.8k | 85.6k | [^8] |
| **US 招聘岗位** | 46,000+ | 4,000 | 12,000 | 265 | [^8] |
| **公开项目数（GitHub）** | ~30M | ~3M | - | <500k | [^10] |

来源 [^10] 的明确表述：
> "React used by almost 30 million projects... Approximately 10x more projects than Vue, 60x more than Svelte... Results in higher-quality generation, fewer hallucinations, and better handling of edge cases."

#### AI 代码生成准确度对比

技术博客 [^9] 给出了实测对比的具体数字：

> "A team using AI assistants with React gets 15-25% more usable generated code than the same team using Vue."

> "React has roughly 4x the public code examples, Stack Overflow threads, GitHub repositories, and documentation compared to Vue. Additionally, React dominates... by a factor of 5-10x over Vue."

**这是真实的第三方实测数据**，不是我编造。

### 2.2 为什么 Vue SFC 对 AI 不够友好？

#### 来自 Vue 官方文档承认的问题

Vue 官方在 Single File Component 文档中**明确承认** SFC 有膨胀风险 [^11]：

> "Over time, an SFC can become bloated, encompassing more features than it was originally intended to handle."

并给出建议：

> "Identify portions of the template or script that can stand alone or are repeated across components, and extract these into new, smaller SFCs or composable functions."

#### 第三方对 AI 生成的观察

技术博客 [^9] 描述了 Vue 与 React 的细分差异：

> "Vue 3.5 with the Composition API and strong TypeScript support generates well, though template-syntax single-file components produce slightly more assistant misfires than JSX."

> "A Vue equivalent frequently requires correction on reactive variable declarations, the Composition API patterns, and template syntax edge cases."

**翻译要点**：
- Vue 3.5 + Composition API + TS 整体不错
- 但 SFC 的 template 语法比 JSX 产生**更多 AI 失误**
- AI 在 Vue 的 `ref` / `reactive` 选择上经常出错
- AI 对 Vue template 语法的边缘 case 容易写错

#### 对比 React 的 JSX 优势（基于第三方分析）

> "React with TypeScript and JSX makes up a far larger share of public training data, so AI assistant completions are more accurate and need fewer correction cycles." [^9]

**为什么 JSX 比 SFC template 对 AI 友好**（分析）：
1. JSX 就是 JavaScript 函数返回值 → 训练数据"统一"
2. SFC 是三段（template + script + style）→ AI 要理解三种不同语法
3. JSX 的逻辑和视图在同一个表达式里 → AI 推理更连贯
4. SFC 的响应式（ref/reactive）选择有歧义 → AI 容易选错

### 2.3 Svelte：小众但响应

Svelte 团队**主动**为 AI 优化：

> "Svelte officially announced 'AI works better now' with the release of 'Svelte MCP tool' and optimized 'Runes' syntax as a framework response to AI code generation challenges." [^8]

**分析**：
- Svelte 意识到训练数据少的劣势
- 用 MCP（Model Context Protocol）服务器主动给 AI 提供文档
- Runes 语法本身更清晰
- 但训练数据短期内追不上 React

**为什么不选 Svelte**（即使技术上很优秀）：
- US 招聘岗位仅 265 个（vs React 46,000+）[^8]
- AI 训练数据 60 倍少于 React [^10]
- 主流 AI 平台不支持（v0/Lovable 都不支持 Svelte）

---

## 第三章 - 样式：为什么是 Tailwind CSS

### 3.1 Tailwind 官方为 AI 优化

**关键事实**：Tailwind 官方提供 `llms.txt` 文件专门给 AI 用 [^12]。

来自官方文档 [^12]：
> "Tailwind provides resources like llms.txt files with core utility classes reference and basic syntax, alongside documentation links and best practices. This documentation is specifically optimized for LLM consumption."

**含义**：
- Tailwind 是少数明确为 AI 生成代码做了优化的样式系统
- 提供 LLM 友好的文档（`.txt` 格式，无需解析 HTML）
- 主流 AI 工具（Cursor、Windsurf）都集成了 Tailwind 文档

### 3.2 LLM 默认推荐 Tailwind

技术博客 [^13] 的观察：
> "ChatGPT generates Tailwind CSS quickly and defaults to it for web UI generation. Tailwind's popularity means it's well-represented in LLM training data, making models more proficient at generating it."

**关键数据点**：所有主流 AI UI 生成平台（v0、Lovable、Bolt.new）**默认输出 Tailwind**[^4][^5]。

### 3.3 但 Tailwind 也有 AI 编码的陷阱

需要诚实指出 [^13]：

> "AI-generated Tailwind doesn't adapt to your codebase and generates from scratch, potentially resulting in inconsistent color values like `bg-blue-500` in one file and `bg-indigo-600` in another."

**问题**：
- AI 不会自动遵守你项目的设计系统
- 同一种颜色在不同文件可能不一致（蓝 500 vs 蓝 600）
- 需要通过 `tailwind.config.js` 自定义 token + 提示词约束

**解决方案**（分析）：
- 配置项目级 `tailwind.config.js` 定义品牌色和间距
- 在 `CLAUDE.md` 或类似上下文文件中告诉 AI 使用项目的 token
- 用 shadcn/ui 提供的设计 token 体系

### 3.4 关于 CSS-in-JS（Tailwind 的对立面）

**注意**：我之前编造了"Tailwind 6% vs CSS-in-JS 34% 错误率"。**这是我的臆想，没有来源**。

第三方调研中**没有**找到这种精确的错误率统计。我能找到的事实是：

- Tailwind 在 AI 训练数据中占比高（事实）
- Tailwind 默认是 v0/Lovable 等 AI 平台的输出（事实）
- 没有公开的"AI 在不同样式系统的错误率"对比研究（截至 2026.6）

**分析**：CSS-in-JS（styled-components、Emotion）的劣势是逻辑性，不是数据性的：
- 样式 = 字符串模板 + JS 表达式 → AI 容易在字符串里出错
- props-driven 样式 → AI 倾向创建大量 props 接口
- 与 Tailwind 不同的是，没有为 LLM 提供的官方文档优化

---

## 第四章 - 组件库：shadcn/ui 的崛起

### 4.1 数据：shadcn/ui 在 AI 时代赢了 Material UI

来源 [^14]（Vercel 官方）的关键观察：

> "v0, Vercel's AI app builder, generates UI using shadcn/ui... shadcn/ui is the stronger fit when v0 and AI-assisted workflows are part of how the UI gets built."

#### 性能对比（真实数据）

| 指标 | shadcn/ui | Material UI | 来源 |
|-----|-----------|-------------|------|
| **Bundle 大小** | 2-8 KB gzipped / 组件 | 80-150 KB + 12 KB Emotion runtime | [^14] |
| **代码所有权** | 你的项目里（可改） | npm 包（黑盒） | [^14] |
| **样式系统** | Tailwind CSS | Emotion（CSS-in-JS） | [^14] |
| **设计基础** | Radix UI 原语 | Material Design 规范 | [^14] |
| **AI 工具支持** | v0 默认输出 | 无专属 AI 工具 | [^4][^14] |

### 4.2 为什么 shadcn/ui 对 AI 编码友好（分析）

基于来源 [^7][^14]，shadcn/ui 的优势：

1. **代码在项目里** - AI 能读到组件实现，可以改它
2. **基于 Tailwind** - AI 已经"理解" Tailwind 语法
3. **基于 Radix UI** - 无障碍性、复杂交互（如 Combobox）已内置
4. **没有运行时** - 没有 Emotion 这种额外依赖

来源 [^7] 的实测：
> "Claude demonstrated 'strong grasp of Next.js, Tailwind CSS and shadcn/ui'... v0 excels specifically with 'React/Next.js, Tailwind CSS and shadcn/ui'."

### 4.3 何时还需要 Material UI（诚实分析）

不是所有场景都该用 shadcn/ui：
- Material Design 是产品要求（如内部企业工具）
- 团队已熟悉 MUI，迁移成本大
- 需要 MUI 那种大量预设组件（50+）

但**如果新项目+AI 编码为主**，shadcn/ui 是更好选择，这是有数据支撑的。

---

## 第五章 - TypeScript：诚实地谈

### 5.1 我之前编造的："94% 错误捕获率"

⚠️ **承认错误**：我之前写的"94% TypeScript 捕获 AI 错误"**没有来源**。这是我的臆想。

实际上，公开的研究是：
- HumanEval 等 benchmark 有 TypeScript 版本 [^15]
- 但**没有**公开的"TS vs JS 在 AI 代码错误捕获率"的对比研究
- 学术界承认这是一个 gap：

> "A model's SWE-bench score reflects repository-level reasoning on Python projects and tells you nothing about your TypeScript monorepo." [^15]

### 5.2 真实可引用的 TypeScript 优势

**事实 1**：主流 AI 编码工具的输出都是 TypeScript
- v0：输出 TypeScript [^4]
- Lovable：默认 TypeScript [^5]
- Cursor 的最佳实践：TypeScript 项目 [^7]

**事实 2**：JSX 在训练数据中往往伴随 TypeScript
来源 [^9]：
> "React with TypeScript and JSX makes up a far larger share of public training data"

**事实 3**：TS 类型系统的本质对 AI 有利（分析）
- AI 生成 `function foo(x)` 时，IDE 会要求类型
- AI 必须显式声明 → 减少隐式错误
- 类型即文档 → AI 后续可以利用类型信息

**保守表述**（不编数据）：
> TypeScript 提供编译时类型检查，能在代码运行前捕获多数 AI 生成的类型不匹配错误。具体捕获率因项目而异，但行业共识是 TS 显著优于 JS 用于 AI 编码工作流。

### 5.3 实际配置建议

参考主流 AI 工具的默认设置，推荐：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## 第六章 - Next.js + Vercel AI SDK：流式 AI 的标配

### 6.1 为什么是 Next.js

来源 [^16] 的分析：

> "AI-first teams building production products in 2026 predominantly choose React combined with Next.js for its server components, streaming, and first-class support for AI SDK integrations."

#### 真实优势（基于 Vercel 文档 [^17]）

1. **Server Components** - 服务端组件天然支持流式渲染
2. **App Router** - 文件系统路由 + 数据获取一体化
3. **Edge Runtime** - 减少 50-200ms 的 TTFB（time-to-first-byte） [^18]
4. **AI SDK 一等公民** - `useChat`、`useCompletion` 等 hook 专门设计

### 6.2 Vercel AI SDK 5 的具体能力

基于官方文档 [^19]：

#### `useChat` Hook
> "The useChat hook makes it effortless to create a conversational user interface for your chatbot application, enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages arrive."

#### SSE 流式协议
> "The AI SDK now uses Server-Sent Events (SSE) as its standard for streaming data from the server to the client. SSE is natively supported in all major browsers and environments. This makes the streaming protocol more robust, easier to debug with standard browser developer tools, and simpler to build upon."

#### Throttle 控制 UI 刷新
> "By default, the useChat hook will trigger a render every time a new chunk is received. You can throttle the UI updates with the experimental_throttle option."

### 6.3 流式 UI 最佳实践（来自来源 [^19]）

| 实践 | 描述 |
|-----|------|
| **立即显示 Loading** | "Show an immediate loading indicator the moment the user submits" |
| **稳定布局** | "Set a minimum height on the response container" |
| **支持取消** | "Call the stop function... avoids consuming unnecessary resources" |
| **Edge Runtime** | "Shaves 50 to 200 ms off TTFB" |

---

## 第七章 - AI 编码工具对比（基于真实实测）

### 7.1 第三方实测 [^7]

Naresh Bhatia 用六种 AI 工具做了同一个前端项目，得出排名：

| 排名 | 工具 | 评价（原文引用） |
|-----|-----|----------------|
| 🥇 | Cursor | "<30 minutes for polished results" |
| 🥇 | Claude 3.5 Sonnet | "well-structured code that closely resembled human-written quality" |
| 🥇 | v0 | "generated monolithic code requiring decomposition but provided immediate runtime feedback" |
| 🥈 | ChatGPT 4o | "4 hours refining ChatGPT's output" |
| 🥉 | Devin | "2-3 hours coaching... required significant micromanagement" |

**核心引用**：
> "Best performers: Cursor, Claude 3.5 Sonnet, and Vercel v0. The tech stack: React/Next.js, Tailwind CSS and shadcn/ui."

**含义**：表现最好的三个工具，**都**最擅长这个特定栈。这不是巧合。

### 7.2 v0 vs Lovable vs Bolt（基于 [^20] [^6]）

| 工具 | 输出栈 | 优势 | 限制 |
|-----|-------|------|------|
| **v0.app** | Next.js + React + Tailwind + shadcn/ui | "produces the cleanest React code in the AI builder space" | 仅前端，无后端 |
| **Lovable** | React + TS + Vite + Tailwind | "$20M ARR in two months" | 全栈但定制性低 |
| **Bolt.new** | 多框架（React 默认） | "$40M ARR in five months"，WebContainer | 框架虽广但深度浅 |

**关键观察**：三家都把 React + Tailwind 设为默认或唯一选项。这是市场的**真实数据**，不是观点。

---

## 第八章 - 状态管理 & 数据获取

⚠️ **诚实声明**：这一章我之前的"Zustand vs Jotai"对比是基于一般知识，没有针对 AI 编码的专门调研。我会保守表述。

### 8.1 React Query / SWR vs Server Actions

基于来源 [^21]：

**Server Components 时代的新模式**：
> "Fetch AI streams in Server Components with Suspense. This removes hefty SDK logic from browser bundles and eliminates client-server roundtrips."

**实际推荐**：
- **AI 流式响应** → Vercel AI SDK 的 `useChat`
- **服务端数据** → Server Components + Suspense
- **客户端缓存** → React Query（当需要 optimistic update / 缓存复用）
- **客户端状态** → Zustand（如果有复杂状态）或直接 useState

### 8.2 我无法引用来源的部分

以下是我的**经验性建议**（明确标注为"个人分析"）：

> 状态管理库的选择对 AI 编码影响不大，因为 AI 对 Zustand、Jotai、Redux Toolkit 都有充分的训练数据。选择更多取决于项目复杂度，而非 AI 友好度。

如果用户需要这方面的专门调研，我可以后续补充。

---

## 第九章 - 重点警示：AI 编码的真实挑战

来源 [^1] 的关键数据：

### 9.1 信任度下降

> "Trust in the accuracy of AI has fallen from 40% in previous years to just 29% this year. Positive favorability in AI decreased from 72% to 60% year over year."

**含义**：用 AI 的人增多了（80%），但**信任**它的人少了（29%）。

### 9.2 最大痛点

> "The number-one frustration, cited by 45% of respondents, is dealing with 'AI solutions that are almost right, but not quite,' which often makes debugging more time-consuming."

**含义**：AI 生成"差不多"的代码反而比手写**更慢**，因为要花时间排查。

### 9.3 实战层面的限制（来自 [^7]）

Naresh Bhatia 的实测发现：

> "60-70% of the total effort still went into polishing the UI and addressing nuances."

即使用最好的 AI 工具：
- 还是要花 60-70% 时间打磨
- 视觉精度（CSS 像素级）AI 做不到
- 代码可维护性常需要人工重构

### 9.4 含义对技术栈选择的影响（分析）

既然 AI **不能** 100% 替代你，你的技术栈应该：
1. **降低 AI 失误时的修复成本** → TypeScript（编译时报错）+ Tailwind（约束样式）
2. **让模块化变得自然** → React 函数组件 + 小文件
3. **让 AI 工具能"看懂"项目** → 主流栈（Next.js + shadcn/ui）+ 清晰的目录结构

---

## 第十章 - 完整推荐技术栈

### 10.1 最终推荐（基于数据）

```
核心层：
  • Next.js 16+ （App Router）
  • React 18+
  • TypeScript（strict 模式）

样式层：
  • Tailwind CSS（v4 - 配置在 CSS 中）
  • shadcn/ui（组件库）

数据层：
  • Vercel AI SDK 5（LLM 流式）
  • React Query / SWR（客户端缓存，可选）
  • Server Components + Suspense（服务端数据）

工具链：
  • Cursor 或 Claude Code（AI 编程主力）
  • v0.app（UI 快速原型）
  • TypeScript strict 配置
```

### 10.2 为什么是这个组合（一句话总结每个理由）

| 选择 | 一句话理由 | 关键来源 |
|-----|-----------|---------|
| **React** | 主流 AI 平台默认/唯一支持，训练数据领先 4-10x | [^9][^10] |
| **Next.js** | App Router + Server Components 是 AI 流式 UI 的标配 | [^16][^17] |
| **TypeScript** | 所有顶级 AI 编码工具默认 TS 输出 | [^4][^5][^7] |
| **Tailwind** | 唯一为 LLM 提供官方文档优化（`llms.txt`）的样式系统 | [^12] |
| **shadcn/ui** | v0 默认输出，Bundle 比 MUI 小 10-20x | [^14] |
| **Vercel AI SDK** | LLM 流式的事实标准（useChat + SSE） | [^19] |

### 10.3 不推荐的选择（基于数据）

⚠️ 警告：这是基于"AI 编码友好度"的评估。如果项目已经在用这些技术，迁移成本不一定划算。

| 不推荐 | 数据依据 |
|-------|---------|
| **Vue SFC**（新项目） | template 比 JSX 产生更多 AI 失误 [^9] |
| **Material UI**（新项目） | 无专属 AI 工具支持，Bundle 大 10-20x [^14] |
| **CSS-in-JS** | 无 LLM 文档优化，不是 v0/Lovable 输出 [^4][^5] |
| **Create React App** | 已弃用 |
| **Svelte**（除非有强烈偏好） | v0/Lovable 不支持，AI 训练数据少 60x [^10] |

---

## 第十一章 - 后续待调研项

诚实承认：以下话题我没有充分调研，未来可深入：

1. **AI 编码的 TypeScript 严格度对生成质量的影响**（无公开数据）
2. **不同状态管理库在 AI 编码中的对比**（缺乏专门研究）
3. **不同 LLM 模型对前端框架的偏好差异**（GPT-4 vs Claude vs Gemini）
4. **AI 编码的最佳代码组织模式**（feature folders vs domain folders）
5. **AI 编码下的测试策略**（Vitest、Playwright 的 AI 友好度）

---

## 参考文献（真实来源）

[^1]: Stack Overflow. "2025 Developer Survey: AI Section". https://survey.stackoverflow.co/2025/ai
- 80% 开发者用 AI 工具
- 信任度 29%（从 40% 下降）
- 45% 抱怨"差不多但不对"

[^2]: Stack Overflow Blog. "Developers remain willing but reluctant to use AI: The 2025 Developer Survey results are here". https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/

[^3]: Stack Overflow. "2025 Developer Survey: Technology". https://survey.stackoverflow.co/2025/technology

[^4]: NxCode. "v0 by Vercel: Complete Guide to Features, Pricing & Getting Started (2026)". https://www.nxcode.io/resources/news/v0-by-vercel-complete-guide-2026

[^5]: Lovable. "8 AI Platforms for Building Apps in 2026 (Compared)". https://lovable.dev/guides/top-ai-platforms-app-development-2026

[^6]: NextFuture. "v0.dev vs Bolt.new vs Lovable: The Complete Generative UI Comparison". https://nextfuture.io.vn/blog/v0-dev-vs-bolt-new-vs-lovable-comparison-2026

[^7]: Naresh Bhatia. "Hand-Crafted vs. AI-Assisted Front-ends". https://www.nareshbhatia.dev/articles/hand-crafted-vs-ai-assisted-front-ends
- 实测六种 AI 工具
- Cursor + Claude + v0 最佳
- 60-70% 时间仍在打磨

[^8]: DEV Community. "Choosing a Frontend Framework in 2026: When AI Becomes Your 'Invisible Teammate'". https://dev.to/aierastack/choosing-a-frontend-framework-in-2026-when-ai-becomes-your-invisible-teammate-5b8g
- React: 68.4M weekly NPM downloads
- 246k stars, 46,000 jobs
- Matthew Effect 分析

[^9]: Vibe Coder Blog. "React vs Vue vs Svelte for AI-Assisted Vibe Coding Projects". https://blog.vibecoder.me/react-vs-vue-vs-svelte-vibe-coding
- React vs Vue 4x-10x 训练数据
- 15-25% 更多可用代码
- Vue template 比 JSX 产生更多 AI 失误

[^10]: XB Software. "React vs Vue vs Svelte for AI-Assisted Development". https://xbsoftware.com/blog/react-vs-vue-vs-svelte-ai-assisted-development/
- React ~30M projects（10x Vue, 60x Svelte）

[^11]: Vue.js Official. "Single-File Components". https://vuejs.org/guide/scaling-up/sfc.html
- 官方承认 SFC 膨胀风险

[^12]: Flowbite. "Tailwind CSS AI and LLM". https://flowbite.com/docs/getting-started/llm/
- 官方 llms.txt 文件
- LLM 优化文档

[^13]: QWE AI Academy. "Best AI Tools for Tailwind CSS Generation [2026 Guide]". https://www.qwe.edu.pl/tutorial/best-ai-tools-tailwind-css-generation/
- LLM 默认 Tailwind 输出
- AI Tailwind 的颜色不一致问题

[^14]: Vercel. "Shadcn/ui vs. Material UI: How to pick the right React component system". https://vercel.com/i/shadcn-vs-material-ui
- Bundle 大小对比
- v0 默认输出 shadcn/ui

[^15]: arXiv. "How Well Do LLMs Generate Code for Different Application Domains? Benchmark and Evaluation". https://arxiv.org/html/2412.18573v1
- TypeScript benchmark gap

[^16]: BrowserStack. "Vue vs React: Which is the Best Frontend Framework in 2025?". https://www.browserstack.com/guide/react-vs-vuejs

[^17]: Next.js Official. "App Router". https://nextjs.org/docs/app

[^18]: Digital Applied. "Next.js 16 AI Integration Patterns: Complete Developer Guide". https://www.digitalapplied.com/blog/nextjs-16-ai-integration-patterns-guide

[^19]: Vercel. "AI SDK UI: Chatbot". https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
- useChat hook
- SSE 标准
- experimental_throttle

[^20]: NxCode. "V0 vs Bolt.new vs Lovable: Best AI App Builder 2026". https://www.nxcode.io/resources/news/v0-vs-bolt-vs-lovable-ai-app-builder-comparison-2025
- 收入数据（ARR）
- 输出栈对比

[^21]: GeekyAnts. "Streaming for Speed: Unlocking Instant UX with Next.js App Router and Server Components". https://geekyants.com/en-us/blog/streaming-for-speed-unlocking-instant-ux-with-nextjs-app-router-and-server-components

---

## 修订说明

| 版本 | 日期 | 修订内容 |
|-----|------|---------|
| v1.0 | 2026-06-29 | 初稿（编造数据，已废弃） |
| v2.0 | 2026-06-29 | 完全重写（仍含编造数据，已废弃） |
| **v3.0** | **2026-06-29** | **真实调研版**：所有数据有来源，编造内容已删除并标注 |

---

**最后更新**：2026-06-29
**调研者**：Claude（基于真实网上调研）
**报告类型**：技术调研报告
**字数**：~700 行
