# AI 前端最佳实践 · 对比 Demo

4 个技术栈实现同一功能（Epic Labs 子集），实证"AI 时代前端技术栈与代码实现要点"。
配套调研报告：`../docx/全网方案调研/AI-Native-Frontend-Tech-Stack.md`（v4.4）。

## 4 个栈（每个可独立运行）
| 栈 | 目录 | 技术栈 | 角色 |
|---|---|---|---|
| ① | react-shadcn | React 19 + TS + Tailwind v4（shadcn-ready） | 基准 |
| ② | vue-shadcn | Vue 3 + TS + Tailwind v4（shadcn-vue-ready） | ①↔② 框架对比 |
| ③ | react-mui | React 19 + TS + Material UI | ①↔③ 组件库对比 |
| ④ | react-antd | React 19 + TS + Ant Design | ①↔④ 组件库对比 |

## 运行
```bash
cd demo/<app>      # 任选一个：react-shadcn / vue-shadcn / react-mui / react-antd
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建
```

## 两条对比
- **方法 B（①↔②，框架）**：迭代膨胀压测。同 prompt 序列 6 轮（R0~R5），每轮采膨胀轨迹 → 验证/证伪"template-SFC vs JSX → 膨胀"（报告 Ch11.2 假设）。迭代序列见 `spec/feature-spec.md`。
- **方法 A（①③④，组件库）**：单次生成 + 最多 2 轮修复。测生成正确率 / 修复轮数 / AI 文档可用性 → 第七章实证。

## 目录
```
demo/
  spec/            功能 spec + 共享 mock 数据契约
  react-shadcn/    ① React + Tailwind
  vue-shadcn/      ② Vue 3 + Tailwind
  react-mui/       ③ React + MUI
  react-antd/      ④ React + AntD
  measurements/    测量协议与日志（method-b / method-a）
  report/          对比报告 + 指导性总结报告
```

## 实验控制
- 固定同一 AI 模型 + 同一 prompt 模板；结论模型相关（报告 Ch11.4）。
- 两栈同 Tailwind 控制样式变量（①②）；③④ 同 React 控制框架变量（①↔③④）。
- 测量口径见 `measurements/README.md`。
