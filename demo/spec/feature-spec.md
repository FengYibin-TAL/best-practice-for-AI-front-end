# Epic Labs 子集 · 功能规格（共享）

> 4 个栈（① react-shadcn / ② vue-shadcn / ③ react-mui / ④ react-antd）实现同一份功能，用于对比。
> 数据契约见 `mock-data.ts`，API 全 mock。

## 功能范围
单本书页 + 2~3 种星标交互 + 模态计分层：

1. **书页**：背景图 + 翻页（prev/next），页面坐标系 0~1。
2. **drag-fill**：拖拽块到目标区，网格吸附 + 碰撞检测，到位即锁定。
3. **hotspot**：点击正确区域，正/误反馈。
4. **quiz-single**：单选题，选项点击判分。
5. **模态计分层**：所有星完成后弹层，显示分数 + "下一关"。
6. **状态**：各星完成情况、总分、当前页/关卡、进度。
7. **埋点（验收点）**：`EPIC_LABS_STAR_CLICK` / `EPIC_LABS_DRAG_FILL_COMPLETE` / `EPIC_LABS_HOTSPOT_CORRECT` / `EPIC_LABS_QUIZ_COMPLETE`。

## 迭代序列（方法 B，①↔② 专用）
从最小版起步，每轮加一个能力（两栈同 prompt、同模型）：
- R0 书页 + 1 个 drag-fill + 基础完成
- R1 + hotspot 星标
- R2 + quiz-single 星标
- R3 + 模态计分层（分数显示）
- R4 + 多关卡 + 翻页状态机
- R5 + 动画（完成撒花/过渡）+ localStorage 持久化

## 终态规格（方法 A，①③④ 单次生成用）
= B 的 R5 终态。三栈同 spec 单次生成 + 最多 2 轮修复。

## 验收
- 4 栈都能跑、实现上述功能点；
- 埋点事件按契约触发；
- 不依赖 EpicWeb 原始写法，UI 用各栈自带方式（①② Tailwind，③ MUI，④ AntD）。
