# AI 前端最佳实践 · 对比 Demo

4 个技术栈实现同一功能（Epic Labs 子集），实证"AI 时代前端技术栈与代码实现要点"。
配套调研报告：`../docs/全网方案调研/AI-Native-Frontend-Tech-Stack.md`（v4.6）。

## 4 个栈（每个可独立运行）
| 栈 | 目录 | 技术栈 | 角色 |
|---|---|---|---|
| ① | react-shadcn | React 19 + TS + Tailwind v4（shadcn-ready） | 基准 |
| ② | vue-shadcn | Vue 3 + TS + Tailwind v4（shadcn-vue-ready） | ①↔② 框架对比 |
| ③ | react-mui | React 19 + TS + Material UI | ①↔③ 组件库对比 |
| ④ | react-antd | React 19 + TS + Ant Design | ①↔④ 组件库对比 |
| ⑤ | react-shadcn-mf | React 19 + Tailwind v4（Module Federation） | SPA vs 微前端架构对比 |

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
  spec/              功能 spec + 共享 mock 数据契约
  react-shadcn/      ① React + Tailwind（SPA）
  vue-shadcn/        ② Vue 3 + Tailwind（SPA）
  react-mui/         ③ React + MUI（SPA）
  react-antd/        ④ React + AntD（SPA）
  react-shadcn-mf/   ⑤ React + Tailwind（Module Federation 微前端）
  _test/             Playwright 统一测试脚本
```

报告和测量数据已移至 `../docs/experiment-reports/`。

## 实验控制
- 固定同一 AI 模型 + 同一 prompt 模板；结论模型相关。
- 两栈同 Tailwind 控制样式变量（①②）；③④ 同 React 控制框架变量（①↔③④）。
- 测量口径见 `../docs/experiment-reports/measurements/README.md`。
