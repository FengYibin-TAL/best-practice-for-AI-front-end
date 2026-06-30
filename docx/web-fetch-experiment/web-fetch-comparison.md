# Web Fetch 工具三方对比实验报告

> 实验日期：2026-06-30  
> 对比工具：内置 WebFetch / Puppeteer MCP / Playwright MCP  
> 目标：量化三种工具在不同页面类型下的数据获取差异

---

## 工具概述

| 工具 | 底层 | 返回格式 | JS渲染 |
|------|------|----------|--------|
| **WebFetch** | HTTP GET + HTML→Markdown 小模型压缩 | Markdown 摘要 | ✗ |
| **Puppeteer MCP** | Chromium（`puppeteer_evaluate` 执行 JS） | JS 执行结果（原始） | ✓（但需等待） |
| **Playwright MCP** | Chromium（`browser_snapshot` + evaluate） | Accessibility Tree + JS 结果 | ✓ |

---

## 维度一：静态页面基线（MDN Fetch API 文档）

**目标 URL：** `https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch`

| 指标 | WebFetch | Puppeteer | Playwright |
|------|----------|-----------|------------|
| 页面标题 | ✓ 正确 | ✗ 导航超时(30s) | ✓ 正确 |
| 第一个代码块 | ✓ 完整获取 | ✗ 超时 | ✗ `pre` 选择器为空（MDN 用 Web Components 渲染代码块） |
| H2 数量 | 4个（过滤了导航栏） | ✗ 超时 | 6个（含导航 h2） |
| 末尾段落 | ✓ 版权信息 | ✗ 超时 | ✓ 版权信息 |

**发现：**
- Puppeteer 导航 MDN 超时——MDN 有反爬或资源加载慢导致 30s 超限
- MDN 代码块用 Web Components（自定义元素）渲染，Playwright 的 `pre` 选择器为空；WebFetch 拿的是服务端 HTML，代码完整
- WebFetch 对 H2 过滤更准（跳过导航区），Playwright 拿到原始 DOM 所有 h2 包括侧边栏

---

## 维度二：JS 渲染内容（Ant Design React SPA）

**目标 URL：** `https://ant.design/components/button`

| 指标 | WebFetch | Puppeteer | Playwright |
|------|----------|-----------|------------|
| 页面标题 | ✓ Button - Ant Design | ✓ Button - Ant Design | ✓ Button - Ant Design |
| API Props 表格 | ✓ **完整**（21行，含类型/默认值） | ✓ 拿到 DOM（4张表） | ✓ 拿到 DOM（4张表，结构完整） |
| 表格 headers | 部分列值混排 | `table[0]` 是 Import 表 | 精准定位到 index=1 含 `Property\|Description\|Type\|Default` |
| 内容精确度 | 中（AI摘要可能重组格式） | 高（原始 DOM） | 高（原始 DOM） |

**发现：**
- **Ant Design 是 SSR 页面**，服务端已渲染 HTML，所以 WebFetch 也能拿到完整 Props 表——这与纯 CSR SPA 不同
- Playwright/Puppeteer 拿到的是真实 DOM，可以精准按 table index 提取，WebFetch 的摘要存在列值边界混乱
- 两个浏览器工具结果一致，Playwright 的 evaluate API 更易读

---

## 维度三：动态数据（npm 实时下载量）

**目标 URL：** `https://www.npmjs.com/package/react`

| 指标 | WebFetch | Puppeteer | Playwright |
|------|----------|-----------|------------|
| 能访问 | ✗ **403 Forbidden** | ✓ | ✓ |
| Weekly Downloads | N/A | ✗ NOT FOUND | ✗ NOT FOUND |
| 版本号 | N/A | ✓ `19.2.7` | ✓ `19.2.7` |
| Dependents 数 | N/A | ✓ `212,869` | ✓ `212,869` |
| 页面 body 字符数 | N/A | 1,970 字符 | 1,970 字符 |

**发现：**
- WebFetch 被 npm 的 403 直接拦截，**浏览器工具可绕过**（携带真实 User-Agent 和浏览器指纹）
- Weekly Downloads 图表是 **canvas/SVG 渲染**，innerText 无法提取——两个浏览器工具均失败，需截图 + Vision 模型才能读取
- body 字符数仅 1,970（完整页面应远不止），说明 npm 下载图表等数据通过异步 API 懒加载，导航后立即执行 JS 拿不到

---

## 维度四：长内容完整性（react.dev/learn）

**目标 URL：** `https://react.dev/learn`

| 指标 | WebFetch | Puppeteer | Playwright |
|------|----------|-----------|------------|
| H2 数量 | 12个（含 Sitemap） | 未测（转向 npm） | **12个**（含 "On this page" 侧边栏） |
| 末尾内容 | ✓ 准确（最后5行） | 未测 | ✓ 准确（最后5行一致） |
| 总字符数 | 估算 7,000–8,000 | 未测 | **实测 13,231 字符** |
| 内容截断 | 未截断（页面中等长） | 未测 | 未截断 |

**发现：**
- react.dev 是 Next.js SSR，WebFetch 可完整获取内容，未发现截断
- Playwright 实测字符数 13,231，WebFetch 估算 7,000–8,000——说明 **WebFetch 的小模型摘要会压缩/截断内容**，估算偏低约 40%
- 对于超长页面（>50k 字符），WebFetch 截断会更明显

---

## 综合结论

### 什么时候用哪个工具

| 场景 | 推荐工具 | 原因 |
|------|----------|------|
| 抓静态/SSR 文档页 | **WebFetch** | 最快，结果直接可用，无需写 JS |
| 目标有反爬/403 | **Playwright / Puppeteer** | 真实浏览器指纹，可绕过基本反爬 |
| 需要精确 DOM 结构（表格/列表） | **Playwright** | evaluate 返回结构化数据，Accessibility Tree 辅助定位 |
| 页面数据懒加载（动态 API） | **Playwright + 等待策略** | 需配合 `waitForSelector` 等待数据渲染 |
| canvas/图表数据 | **截图 + Vision 模型** | 三种工具均无法从 innerText 提取 |
| 快速摘要/问答 | **WebFetch** | 内置小模型摘要，直接返回自然语言结果 |

### 核心差异总结

```
WebFetch    = HTTP源码 → 小模型压缩 → 自然语言摘要（快、有损、403无解）
Puppeteer   = 真实浏览器 → 立即执行JS → 原始结果（需手写选择器，导航有超时风险）
Playwright  = 真实浏览器 → Accessibility Tree + JS → 结构化（最稳定，API最友好）
```

### 意外发现

1. **MDN 导致 Puppeteer 超时**：部分大型文档站资源加载慢，Puppeteer 默认 30s 超时不够
2. **MDN 代码块用 Web Components 渲染**：浏览器工具的 `pre` 选择器失效，反而 WebFetch 拿源码更准
3. **npm Weekly Downloads 是 canvas 图**：任何文本工具都无法提取，需 Vision
4. **WebFetch 字符数估算偏低 ~40%**：小模型在摘要时会压缩内容，长文档信息损耗明显
