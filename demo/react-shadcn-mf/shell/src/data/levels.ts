// Shell 只保留关卡元数据（背景色、星数），不含星型配置
// 星型配置由各子应用自己持有
export interface LevelMeta { id: number; bg: string; starCount: number }

export const LEVEL_METAS: LevelMeta[] = [
  { id: 1, bg: 'linear-gradient(135deg,#fde68a,#fca5a5)', starCount: 2 },
  { id: 2, bg: 'linear-gradient(135deg,#bfdbfe,#a5f3fc)', starCount: 2 },
  { id: 3, bg: 'linear-gradient(135deg,#ddd6fe,#fbcfe8)', starCount: 3 },
]
