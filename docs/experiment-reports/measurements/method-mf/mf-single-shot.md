# 微前端架构测量记录（react-shadcn-mf）

> 测量日期：2026-06-30  
> 架构：Module Federation（Vite + @originjs/vite-plugin-federation 1.4.1）  
> 基准：react-shadcn SPA（662 LOC，63 KB gzip）

## 架构拆分方式

```
shell（host）      ← 路由 + 全局 UI（Header/PageNav/Modal/Confetti）+ localStorage
  ├── level1 remote  ← 第1关（DragFill + Hotspot）
  ├── level2 remote  ← 第2关（FlipMatch + Quiz）
  └── level3 remote  ← 第3关（DragFill + Hotspot + Quiz）
```

## LOC 统计

| 子应用 | 文件数（tsx/ts） | LOC | 职责 |
|-------|----------------|-----|------|
| shell | 8 | 339 | 路由、全局状态、Header/PageNav/ModalStack/Confetti/storage |
| level1 | 5 | 198 | DragFillStar、HotspotStar、LevelApp、关卡数据 |
| level2 | 5 | 144 | FlipMatchStar、QuizStar、LevelApp、关卡数据 |
| level3 | 6 | 239 | DragFillStar、HotspotStar、QuizStar、LevelApp、关卡数据 |
| **合计** | **24** | **920** | |

**对比 SPA**：662 LOC → 920 LOC，**+39%**

主要原因：
- 类型定义在各子应用中重复（Star/DragFillConfig/HotspotConfig 等）
- LevelApp 入口文件是新增的中间层
- Shell 的 LEVEL_METAS 与各子应用的 STARS 数据分离，有重复

## Bundle 大小

> ⚠️ 注意：MF 模式下各子应用各自打包了完整的 react + react-dom 依赖。  
> 虽然配置了 shared singleton，但 `vite preview` 模式下各 remote 还是各自携带了 React。  
> 实际生产部署（webpack/vite dev 服务器热加载）会正确共享，preview 模式是静态文件，shared 解析有限制。

| 子应用 | JS gzip | 说明 |
|-------|---------|------|
| shell | 64 KB | 含 react + react-dom + 全局 UI |
| level1 | 65 KB | 含 react + react-dom + 星型组件 |
| level2 | 64 KB | 含 react + react-dom + 星型组件 |
| level3 | 65 KB | 含 react + react-dom + 星型组件 |
| **合计（首屏 = shell + level1）** | **129 KB** | 用户首屏实际加载 |
| **总计（全部加载）** | **258 KB** | 走完3关后累计 |

**对比 SPA**：63 KB → 129 KB 首屏（+105%）；258 KB 总计（+310%）

理想情况（react 真正共享后）估算：
- shell: ~15 KB（去掉 react/react-dom）
- 每关: ~5 KB（仅业务逻辑）
- 首屏: ~20 KB，总计 ~30 KB

## 测试结果

Playwright 9/9 通过，0 console error  
URL：`http://localhost:5174/`（shell preview）

## 工程注意事项

1. **vite-plugin-federation 1.4.x CSS 注入 bug**：remoteEntry.js 生成的 `dynamicLoadingCss` 函数期待数组参数，但传入的是字符串，导致 `e.forEach is not a function`。  
   临时 workaround：build 后用 `sed` patch remoteEntry.js，将字符串包装为数组。  
   已固化在 `start-preview.sh` 中。

2. **跨 MF 边界的 React setState**：子应用通过 props 回调触发 shell setState 时，React 严格模式会报 "setState during render" warning。  
   修复：在子应用组件里用 `requestAnimationFrame` 延迟 `onComplete()` 调用。

3. **Tailwind CSS 作用域**：子应用不独立处理 Tailwind，所有 Tailwind 类名由 Shell 的 `index.css` 统一生成（通过 `@source` 指令扫描所有子应用 tsx 文件）。
