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
- 功能点通过表（drag-fill/hotspot/quiz/modal/埋点 各 pass/fail）
- 修复轮数（到能跑为止，≤2）
- AI 文档可用性（shadcn→v0 / AntD→llms.txt+MCP / MUI→无）
- 代码质量与地道性（定性）

日志放 `method-a/<stack>.json`。

## 隐变量控制
固定同一 AI 模型 + 同一 prompt 模板；声明结论模型相关（报告 v4.4 Ch11.4）。
