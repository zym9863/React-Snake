# React 贪吃蛇（Snake Game）

一个使用 React + TypeScript + Vite 构建的贪吃蛇小游戏。使用 pnpm 作为包管理器。

本版本文档包含玩法设计与使用说明，不修改现有代码；后续可按本文档的技术方案逐步实现。

## 快速开始

要求：已安装 Node.js（建议 18+）与 pnpm（建议 8+）。

安装依赖：
```bash
pnpm install
```

开发启动：
```bash
pnpm dev
```

构建生产包：
```bash
pnpm build
```

本地预览构建产物：
```bash
pnpm preview
```

## 玩法设计

- 棋盘：默认 20 x 20 网格。
- 蛇：以固定节奏移动；初始长度 3；头部朝向由玩家控制。
- 控制：方向键（← ↑ → ↓）或 WASD 改变方向；支持暂停/继续；支持重新开始。
- 食物：随机出现在未被蛇占据的格子；吃到后蛇增长 1 节，分数 +1。
- 碰撞规则：撞墙或撞到自身时游戏结束。
- 速度：默认中等速度，支持在控制面板中调节（慢/中/快）。
- 最高分：以 localStorage 持久化保存。
- 可选扩展（后续）：边缘穿越、特殊食物、关卡/加速、触控手势、声音效果等。

## 界面组成（规划）

- 游戏区域（GameBoard）
  - 渲染网格、蛇身、蛇头、食物。
  - 通过 CSS 设置尺寸、颜色和响应式自适应。
- 控制面板（ControlPanel）
  - 显示当前分数与最高分。
  - 按钮：开始/暂停、重置。
  - 速度选择器：慢/中/快。
- 全局容器（App）
  - 组合 GameBoard 与 ControlPanel。
  - 提供键盘焦点管理以确保方向键可用。

## 键位说明

- 方向：↑/W 上；↓/S 下；←/A 左；→/D 右
- 暂停/继续：Space（或点击“暂停/继续”按钮）
- 重新开始：R（或点击“重新开始”按钮）

注意：为保证键盘事件生效，首次进入页面时请点击游戏区域或任一控件以获取焦点。

## 技术方案（计划）

为便于后续实现与维护，这里先定义关键抽象与接口。

### 目录结构（计划新增）

- [`src/types.ts`](src/types.ts): 全局类型定义
- [`src/game/useSnakeGame.ts`](src/game/useSnakeGame.ts): 管理游戏循环与状态的 Hook
- [`src/components/GameBoard.tsx`](src/components/GameBoard.tsx): 棋盘与元素渲染
- [`src/components/ControlPanel.tsx`](src/components/ControlPanel.tsx): 控制区与分数显示
- 修改现有页面：
  - [`src/App.tsx`](src/App.tsx)
  - [`src/App.css`](src/App.css)

### 类型定义（计划）

```ts
// types.ts（计划）
export type Coord = { x: number; y: number };

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type Speed = 'slow' | 'medium' | 'fast';

export interface GameConfig {
  rows: number; // 20
  cols: number; // 20
  speed: Speed; // 'medium'
  wallIsDead: boolean; // true（撞墙即死）；可扩展为穿越模式
}

export interface GameState {
  snake: Coord[]; // 第 0 个为蛇头
  food: Coord;
  direction: Direction;
  pendingDirection?: Direction; // 防抖与避免反向立即生效
  score: number;
  highScore: number;
  isRunning: boolean; // 是否正在移动（非暂停）
  isGameOver: boolean;
}
```

### Hook 设计（计划）

[`src/game/useSnakeGame.ts`](src/game/useSnakeGame.ts)（计划）职责：
- 统一管理状态（蛇、方向、食物、分数、游戏进行状态）
- 计时驱动（`setInterval` 或 `requestAnimationFrame` + 累积计时）
- 键盘事件处理（方向、暂停、重置）
- 碰撞检测与食物生成
- 最高分读写（localStorage）

核心 API（计划）：
```ts
// useSnakeGame（计划）
function useSnakeGame(initial?: Partial<GameConfig>) {
  // 返回：
  return {
    state,              // GameState
    config,             // GameConfig
    start, pause, reset,
    setSpeed,           // (speed: Speed) => void
    handleKeyDown,      // (e: KeyboardEvent) => void
  };
}
```

速度与节奏（计划）：
- slow: 200ms/步
- medium: 120ms/步
- fast: 80ms/步

### 组件职责（计划）

- [`GameBoard.tsx`](src/components/GameBoard.tsx)
  - 接收棋盘行列数、蛇、食物，渲染网格
  - 通过 inline-style 或 CSS 变量控制格子尺寸
  - 对蛇头/蛇身/食物应用不同样式与 aria-label，提升可访问性

- [`ControlPanel.tsx`](src/components/ControlPanel.tsx)
  - 展示分数与最高分
  - 开始/暂停、重置按钮
  - 速度选择器（radio 或下拉）
  - 向上传递事件回调（start/pause/reset/setSpeed）

- [`App.tsx`](src/App.tsx)
  - 使用 `useSnakeGame`
  - 绑定 `onKeyDown` 或 document 级事件
  - 布局 GameBoard 与 ControlPanel

### 碰撞与移动规则（计划）

1. 每个 tick：
   - 若存在 `pendingDirection`，判断是否允许从当前方向切换（禁止 180° 反向），若允许则更新 `direction`。
   - 计算新头部坐标。
   - 若 `wallIsDead` 为 true：头部越界则游戏结束；否则进行边缘穿越（x/y 取模）。
   - 若新头部与蛇身（除尾部在吃不到食物时会移动）发生重叠，则游戏结束。
   - 若新头部等于食物坐标：分数 +1、蛇增长（不移除尾部）、生成新食物；更新最高分。
   - 否则：将新头部入队，并移除尾部，蛇前进。

2. 食物生成：
   - 在空白格随机挑选。
   - 若格子已满（极小概率在小网格高分时出现），可直接判胜或重置。

## 可配置参数（计划）

- 网格大小：默认 20 x 20，后续可在 ControlPanel 中暴露输入框或滑块。
- 速度：slow/medium/fast。
- 撞墙规则：true（默认）或穿越。

## 状态持久化（计划）

- highScore 存储于 localStorage：键名建议 `snake.highScore`。
- 可选：记录最后一次速度、网格大小偏好。

## 样式建议

- 高对比度颜色：蛇身（#16a34a）、蛇头（#15803d）、食物（#ef4444）、网格背景（#0f172a / #111827）。
- 响应式：棋盘最大宽高随容器自适应（min(90vmin, 640px)），格子尺寸通过 CSS Grid 自动计算。
- 动画：轻微过渡提升动效（避免过多 box-shadow 影响性能）。

## 无障碍与可用性

- 为主要区域设置 `role="application"` 或 `role="region"` 与 aria-label。
- 可见焦点样式，确保键盘可操作。
- 控件添加 `aria-pressed`、`aria-live="polite"` 显示分数变化。

## 后续实现步骤（建议）

1. 新建类型与 Hook 文件，完成核心逻辑与键盘控制。
2. 编写 GameBoard 渲染，先用简洁方块表示。
3. 添加 ControlPanel，贯通开始/暂停/重置/速度。
4. 完善样式、无障碍、移动端触控支持（选做）。
5. 增加单元测试（核心逻辑：移动、碰撞、食物生成）。

## 开源许可

MIT
