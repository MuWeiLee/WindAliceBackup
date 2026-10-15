# Wind Alice 移动端 UI 参考原型

这是 Wind Alice App 移动端页面与组件的唯一参考入口。目录已按“原型、文档、维护规则”分层，避免多份 Demo 和交付包之间出现版本漂移。

## 快速开始

直接打开：

`prototype/index.html`

原型完全使用本地资源，无需联网。顶部可以在 `Demo` 与 `Component` 之间切换：

- `Demo`：查看业务页面、页面层级和交互状态。
- `Component`：查看并编辑导航栏、TabBar、输入框与内容层组合。

## 目录结构

```text
WindAliceApp/
├── README.md
├── prototype/
│   ├── index.html
│   ├── app.js
│   ├── meeting-v113.js
│   └── assets/
│       ├── lucide.min.js
│       └── sector_rotation_intensity_trend.png
├── docs/
│   ├── ui-reference-guide.md
│   └── requirement-guide.md
└── maintenance/
    └── wind-alice-mobile-demo-design/
        ├── SKILL.md
        └── agents/openai.yaml
```

## 文件职责

| 目录 | 用途 | 修改建议 |
| --- | --- | --- |
| `prototype/` | 唯一可运行 UI 原型 | 页面结构与全部样式改 `index.html`，通用交互改 `app.js`，会议交互改 `meeting-v113.js` |
| `docs/` | UI 参考和产品需求规则 | 页面层级、导航类型或模块规则变化时同步更新 |
| `maintenance/` | AI/自动化维护约束 | 仅在原型维护流程变化时更新 |

## 维护原则

1. 不再维护单文件副本或 ZIP 副本。
2. 全部 CSS 内嵌在 `prototype/index.html`；图片、图标和脚本使用本地资源，保持离线可运行。
3. 新页面优先复用现有页面壳、Panel、导航、输入框和 TabBar。
4. 产品结构规则写入 `docs/`，精确实现保留在 `prototype/`。
5. 对外分享时直接分享整个 `WindAliceApp` 目录；如需压缩包，在交付时临时生成，不纳入长期维护。
