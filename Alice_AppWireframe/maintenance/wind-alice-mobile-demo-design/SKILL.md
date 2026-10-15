---
name: wind-alice-mobile-demo-design
description: Use when updating the Wind Alice mobile Demo prototype, adding module pages, adjusting page directories, Panel drawers, navigation bars, content cards, input bar behavior, or TabBar behavior. Preserve the fixed Demo/Component shell, phone frame, system status bar, shared UI components, and existing visual style.
---

# Wind Alice Mobile Demo Design

Use this skill when modifying the Wind Alice mobile UI reference prototype. The goal is to add or adjust product content while preserving the mobile framework and visual consistency.

## Target Files

Prototype entry:

```text
D:\万得Alice\Alice_Product_Management\05_设计框架\WindAliceApp\prototype\index.html
```

Styles and behavior:

```text
D:\万得Alice\Alice_Product_Management\05_设计框架\WindAliceApp\prototype\index.html
D:\万得Alice\Alice_Product_Management\05_设计框架\WindAliceApp\prototype\app.js
D:\万得Alice\Alice_Product_Management\05_设计框架\WindAliceApp\prototype\meeting-v113.js
```

All CSS must stay inside the `<style>` block in `prototype/index.html`. Do not create standalone stylesheet files.

## Non-Negotiable Layout Rules

Do not change the outer desktop shell layout:

```text
Top mode switch: Demo | Component

Demo page:
| 页面目录 | Demo | 状态 |

Component page:
| 组件目录 | Demo | 状态 |
```

Do not change:

- The three-column shell.
- The top `Demo / Component` switch.
- The simulated phone position and scale behavior.
- The fake phone frame.
- The phone status bar structure.
- The time, signal, Wi-Fi, and battery icon area.
- The bottom safe-area treatment.

## Mobile Device Rules

The prototype has one device mode only: a 375 x 812 mobile phone UI.

- Do not add device mode controls, alternate device layouts, desktop breakpoints, or alternate device classes.
- Keep the phone frame dimensions and scale behavior unchanged.
- Keep navigation, content, input, drawer, and TabBar behavior scoped to the single mobile layout.

## Visual Freeze Rules

Keep existing visual effects consistent across the product.

Do not modify existing shared styles unless the user explicitly asks for a visual redesign:

- Phone frame.
- Status bar.
- Top navigation bars.
- Panel drawer.
- Content card base styles.
- Bottom input bar.
- Bottom TabBar.
- Icons, icon sizes, and icon alignment.
- Existing hover, active, selected, and transition behavior.
- Existing spacing, typography, radius, shadow, border, and background tokens.

When adding new content, reuse existing classes and component patterns first. Add new CSS only when no existing pattern can represent the object correctly.

## Work Order

Before editing, inspect the current `PAGES` object and related helpers.

When adding or changing a page:

1. Identify the module.
2. Decide the page layer.
3. Choose the navigation bar type.
4. Decide whether the page uses `=` Panel.
5. Define Panel groups and object items.
6. Define content objects and card fields.
7. Decide bottom input context.
8. Decide TabBar visibility and active module.
9. Add or update the module FlowChart.
10. Update the left page directory.
11. Add or update click paths so the Demo is navigable.
12. Sync to the reference package and rebuild the zip.

## Module Rules

Use existing modules before inventing new ones:

| Module | Chinese name | Responsibility |
| --- | --- | --- |
| home | 市场 | Watchlist, hot topics, market overview, holdings, quotes |
| chat | 私人助理 | Alice / expert conversation and history |
| work | 协同工作 | Projects, project detail, group chats, project files |
| link | 拓客服务 | Client service and relationship-linked outputs |
| meeting | 会议 | Meetings, schedules, minutes, todos |
| files | 文件资料 | Folders, files, uploads, file details |
| automation | 自动任务 | Scheduled tasks, reminders, task runs, run results |
| tools | 工具市场 | Skills, experts, connectors |
| mine | 我的 | Profile, account actions, settings, unpinned module tiles |

If a module is not selected into the first four bottom tabs, surface it from `我的` as a tile.

## Page Directory Rules

When adding a page, update the left page directory according to module and importance.

Current directory order:

```text
1. 市场
2. 私人助理
3. 协同工作
4. 拓客服务
5. 会议
6. 文件资料
7. 自动任务
8. 工具市场
9. 我的
10. 其他
```

Keep page numbering stable and add new pages under the correct module. Do not place module pages under `其他` unless they are truly cross-module, such as notification center.

## Navigation Bar Types

Use the existing navigation bar types.

| Type | Use for | Shape |
| --- | --- | --- |
| `1-A` | First-level channel pages | `| Tab | Tab | Tab | ... | Action | Action |` |
| `1-B-1` | Private assistant start page | `| = | Alice | > | Voice | New chat | Notify |` |
| `1-B-2` | First-level object list pages | `| = | Page title | Action | Notify |` |
| `1-C1` | Private assistant conversation detail | `| = | Conversation title | Voice | New chat | Notify |` |
| `1-D` | First-level pages with sub tabs | `| = | Page title | Action | Notify |` plus sub tabs |
| `2-A-1` | Second-level object detail with tabs | `| = | Object title | > | Action | Notify |` plus sub tabs |
| `3-A` | Third-level object/detail/result pages | `| < | Page title | Action | Action |` |
| `3-B` | Third-level pages with sub tabs | `| < | Page title | Action |` plus sub tabs |
| `4-A` | Settings, editing, authorization flows | `| < | Page title |` |

Do not create a new navigation bar type unless the existing types cannot express the required page.

## Panel Rules

Panel is the directory opened by `=`.

Panel is not page content. It should contain only:

- Panel title.
- Optional top action.
- Groups or drawer headers.
- Object items.

Do not put metrics, long descriptions, charts, or page body content inside Panel.

Recommended Panel structures:

```text
Private assistant:
Chat
+ 新建对话
收藏对话
- Conversation
最近对话
- Conversation
```

```text
Work:
项目
+ 新建项目
Project name
- Group chat
- Group chat
```

```text
Automation:
自动任务
+ 新建任务
定时任务
- Task
提醒任务
- Reminder
```

```text
Tools:
工具市场
技能
- 我的技能
- 官方推荐
专家
- 我的专家
- 官方推荐
连接器
- 我的连接器
- 官方推荐
```

Panel object clicks must navigate to the correct page or switch the correct tab.

## FlowChart Rules

Each module should have an independent FlowChart configuration.

Use FlowChart to describe:

- Page-to-page navigation.
- Bottom input entry into conversation or group chat.
- Return destination.
- Bound context object.
- Active TabBar module.

Do not use FlowChart as page content. Render FlowChart in the right state panel only.

When adding pages, update the module flow data so the current page can show relevant flows in the right state panel. Flow nodes should be clickable and should navigate to the matching page. If a node points to a tabbed page, set the tab state before rendering the page.

Required Flow types for each module:

| Flow type | Required | Example |
| --- | --- | --- |
| Module page flow | Yes | `项目列表 -> 项目详情 -> 项目群聊` |
| Bottom input flow | Yes | `项目详情 -> 底部提问 -> 项目群聊 -> 返回项目详情` |
| Cross-module flow | When needed | `通知中心 -> 对应来源页面` |

## Content Rules

Use cards for object lists whenever possible.

Recommended object surfaces:

| Object | Recommended surface |
| --- | --- |
| Project | Project card |
| Group chat | Conversation/group chat card |
| File/folder | File card |
| Task | Task card |
| Task run history | Run history card |
| Skill/expert/connector | Tool market card |
| Stock | Quote row or market card |
| Profile feature | Tile card |

Do not introduce demo-only copy such as "this is mock data" or "for demo". Make content read like a real product.

## Bottom Input Rules

Pages at levels 1, 2, and 3 should show the bottom input by default.

The input must be scoped to the current context:

- Market pages: current market/watchlist/stock context.
- Chat pages: current conversation.
- Work pages: current project or group chat.
- File pages: current folder or file.
- Automation pages: current task or run result.
- Tools pages: current tool type or selected capability.
- Mine pages: current account/profile context.

Level 4 pages should hide the input by default.

## Bottom TabBar Rules

Pages at levels 1, 2, and 3 should show the bottom TabBar by default.

Level 4 pages must configure the TabBar explicitly. Keep it for settings or search pages when users still need module switching; hide it for focused flows, especially:

- Menu editing.
- Settings editing.
- Authorization flows.
- Full-screen configuration flows.

Keep TabBar active state tied to the source module:

- Market and stock quote: `home`.
- Private assistant pages: `chat`.
- Work pages: `work`.
- Link pages: `link`.
- Pages entered from Mine tiles: `mine`.

## Component Page Rules

The `Component` tab must also render components inside the simulated phone.

Component page requirements:

- Keep `| 组件目录 | Demo | 状态 |`.
- Show component examples inside the phone frame.
- Let navigation, TabBar, input, and content layer options have a selected state.
- Preserve interactive controls for tabs, dropdowns, and editable text.
- Allow contenteditable text without visible input borders when mocking page text.

## Sync and Validation

After editing the prototype:

1. Run `node --check prototype/app.js`.
2. Confirm `prototype/index.html` references only local files.
3. Open `prototype/index.html` and smoke-test both `Demo` and `Component`.
4. Check representative navigation, Panel, input, TabBar, empty, loading, and error states.

## Final Response

Report:

- What pages or components changed.
- Whether script validation passed.
- Whether the local, offline assets loaded correctly.
