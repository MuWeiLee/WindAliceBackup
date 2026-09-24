# Alice Work Connector — 归档版本 20260828

## 归档文件
| 文件 | 说明 |
|------|------|
| index.html | Work Connector 功能页面完整原型 |
| alice-cowork-visual-system.css | 共享视觉系统样式表 |

## 本次变更内容

### 1. 左侧栏（Rail）结构更新
对齐 Alice Work 原型的最新侧栏设计。

- **新增"我的首页"入口（market-top-tab）** — 带紫色渐变"送积分"标签
- **产品切换改为 top-tabs** — Chat / Work / Link，Work 为 active
- **底部新增主导航 rail-main-nav** — 技能·专家·连接器 / 定时与提醒 / 知识库
- **CSS 新增** — `.market-top-tab`、`.market-points`、`.top-tabs`、`.top-tab` 样式

### 2. 去除重复的"专家·技能·连接器"
- 删除上方 `rail-context` 中的 hover-pop（下拉式菜单）
- 保留下方 `rail-main-nav` 中的"技能·专家·连接器"

### 3. Hover 交互迁移到底部导航项
- `.hover-pop` 包裹底部第一个 `rail-main-item`
- hover 弹出 专家/技能/连接器 子菜单
- 菜单改为**向右飞出**（`.rail-nav-flyout`：`left:100%`）
- 保留 hover 桥接区域（`:before` 伪元素）

### 4. 布局修正
- `rail-main-nav` 添加 `margin-top:auto`，推至侧栏底部

### 5. 清理废弃 CSS
- 移除 `.rail-product-tabs`、`.rail-ability-menu`、`.rail-context`、`.rail-task`、`.rail-mini-title`

## 关联文件
- 源原型参考：`Alice_Work/archive/20260828/alice-cowork-prototype.html`
- 同步更新：`Alice_Link/archive/20260828/`
