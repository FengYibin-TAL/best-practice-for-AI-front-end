# 测量协议

## 方法 B（① react-shadcn ↔ ② vue-shadcn，迭代膨胀）
每轮（R0~R5）采：
- 最大单文件 LOC
- 文件 / 模块数
- 平均文件 LOC
- 单文件最大圈复杂度
- 抽取事件：本轮是否新建模块 vs 往既有文件追加

输出：两栈膨胀轨迹（折线图）。日志放 `method-b/<stack>/R<n>.json`。

## 方法 A（① react-shadcn / ③ react-mui / ④ react-antd，单次质量）
每栈采：
- 功能点通过表（drag-fill/hotspot/quiz/modal 各 pass/fail）
- 修复轮数（到能跑为止，≤2）
- AI 文档可用性（shadcn→v0 / AntD→llms.txt+MCP / MUI→无）
- 代码质量与地道性（定性）

日志放 `method-a/<stack>.json`。

## 方法 MF（⑤ react-shadcn-mf，微前端架构对比）
对比基准为 ① react-shadcn SPA 版本，测量维度：
- 总 LOC（shell + level1/2/3 之和）vs SPA
- 各子应用 LOC 分布（shell / 每关 / 数据层）
- Bundle gzip（首屏 = shell + level1，全量 = 3 关全加载）vs SPA
- AI 可维护性（定性：bug 定位路径、状态追踪、修改组件路径）
- 构建复杂度（build 次数、patch 步骤）

数据见 `method-mf/mf-single-shot.md`。

## 隐变量控制
固定同一 AI 模型 + 同一 prompt 模板；声明结论模型相关。
