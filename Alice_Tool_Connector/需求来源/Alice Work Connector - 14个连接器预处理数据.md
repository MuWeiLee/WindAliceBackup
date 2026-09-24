# Alice Work Connector 14个连接器预处理数据

| 字段 | 内容 |
|---|---|
| 文档版本 | v0.1 |
| 日期 | 2026-08-25 |
| 数据用途 | 连接器管理后台首批连接器录入预处理 |
| 关联需求 | Alice Work Connector 连接器管理后台服务需求 |
| 数据状态 | 待业务确认 |

## 处理口径

- 连接器 ID 使用系统生成 ID 口径，本文件先用 `CON-20260825-0001` 这类占位 ID 预处理；当前前端原型中的 `id` 作为“原型Key”单独保留，便于后续映射和迁移。
- 连接器状态统一预设为“不公开”，待后台录入和业务确认后再公开。
- 连接器版本统一预设为 `v0.1.0`，作为首批后台登记版本。
- 连接器图片统一预设为“否”，先使用文字 Logo 或默认占位图；正式图片待品牌素材确认后补充。
- 连接器包图片统一预设为“否”，前端使用连接器包名称首字作为 Logo。
- 支持端统一预设为 Web、Desktop、Mobile `[待确认]`。
- 公司信息中存在品牌主体不确定的内容，使用 `[待确认]` 标记。
- 连接器包 ID 使用系统生成 ID 口径，本文件先用 `PKG-20260825-0001` 这类占位 ID 预处理；当前前端原型中的连接器包 `id` 作为“连接器包原型Key”单独保留。
- 连接器包关系根据当前原型中的连接器包配置预填，但关系字段使用系统生成 ID。

## 连接器主数据

| 连接器ID | 原型Key | 中文名称 | 英文名称 | 连接器图片 | 所属公司中文 | 所属公司英文 | 分类ID/分类 | 标签 | 支持端 | 连接器版本 | 连接器状态 | 关联连接器包ID |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CON-20260825-0001 | ima | ima 知识库 | ima Knowledge Base | 否 | 腾讯 | Tencent `[待确认]` | knowledge / 知识库 | 知识库；文件引用；内容总结；资料检索 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0002；PKG-20260825-0001 |
| CON-20260825-0002 | feishu | 飞书 | Feishu | 否 | 飞书 | Feishu `[待确认]` | docs / 文档协作 | 文档协作；项目资料；团队消息；日程待办 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0004 |
| CON-20260825-0003 | tencentdoc | 腾讯文档 | Tencent Docs | 否 | 腾讯 | Tencent | docs / 文档协作 | 在线文档；在线表格；协作编辑；资料整理 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0004；PKG-20260825-0001 |
| CON-20260825-0004 | kingsoft | 金山文档 | Kingsoft Docs | 否 | 金山办公 | Kingsoft Office | docs / 文档协作 | 在线文档；在线表格；WPS；资料整理 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0004 |
| CON-20260825-0005 | baidu | 百度网盘 | Baidu Netdisk | 否 | 百度 | Baidu | files / 文件资料 | 网盘文件；文件检索；文件总结；资料管理 | Web；Desktop；Mobile | v0.1.0 | 不公开 | 无 |
| CON-20260825-0006 | lexiang | 乐享知识库 | Lexiang Knowledge Base | 否 | 腾讯乐享 | Tencent Lexiang `[待确认]` | knowledge / 知识库 | 企业知识库；文档管理；知识沉淀；内容搜索 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0002 |
| CON-20260825-0007 | notion | Notion | Notion | 否 | Notion Labs, Inc. | Notion Labs, Inc. | knowledge / 知识库 | 页面；数据库；知识管理；项目记录 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0002 |
| CON-20260825-0008 | zsxq | 知识星球 | Zsxq | 否 | 知识星球 | Zsxq `[待确认]` | knowledge / 知识库 | 社群知识；内容检索；问答整理；社群运营 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0002 |
| CON-20260825-0009 | dingtalk | 钉钉 | DingTalk | 否 | 阿里巴巴 | Alibaba | communication / 沟通邮箱 | 工作消息；会议；日程；组织协作 | Web；Desktop；Mobile | v0.1.0 | 不公开 | 无 |
| CON-20260825-0010 | qqmail | QQ 邮箱 | QQ Mail | 否 | 腾讯 | Tencent | communication / 沟通邮箱 | 邮件查询；邮件总结；邮件起草；附件信息 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0003；PKG-20260825-0001 |
| CON-20260825-0011 | netease | 网易邮箱 | NetEase Mail | 否 | 网易 | NetEase | communication / 沟通邮箱 | 邮件查询；邮件总结；邮件起草；客户往来 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0003 |
| CON-20260825-0012 | wecom | 企业微信 | WeCom | 否 | 腾讯 | Tencent | communication / 沟通邮箱 | 企业沟通；群聊；客户沟通；会议待办 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0001 |
| CON-20260825-0013 | meeting | 腾讯会议 | Tencent Meeting | 否 | 腾讯 | Tencent | communication / 沟通邮箱 | 会议记录；会议纪要；待办提取；参会信息 | Web；Desktop；Mobile | v0.1.0 | 不公开 | PKG-20260825-0001 |
| CON-20260825-0014 | scan | 扫描全能王 | CamScanner | 否 | 合合信息 | INTSIG | files / 文件资料 | 扫描文档；OCR；图片识别；PDF 整理 | Web；Desktop；Mobile | v0.1.0 | 不公开 | 无 |

## 连接器简介与能力

| 连接器ID | 原型Key | 中文简介 | 英文简介 | 中文能力 | 英文能力 |
|---|---|---|---|---|---|
| CON-20260825-0001 | ima | 搜索、引用和总结 ima 知识库中的资料与文件，帮助用户快速定位内部知识内容。 | Search, cite, and summarize content from ima knowledge bases and files. | 支持知识库搜索、文件引用、内容总结、资料问答和知识库详情查看。 | Supports knowledge base search, file citation, content summarization, Q&A, and knowledge base detail lookup. |
| CON-20260825-0002 | feishu | 连接飞书文档、项目资料和团队协作内容，帮助用户整理工作上下文。 | Connect Feishu documents, project materials, and collaboration content to organize work context. | 支持读取和创建文档、同步项目资料、查询团队消息、整理会议与待办内容。 | Supports reading and creating documents, syncing project materials, querying team content, and organizing meetings and tasks. |
| CON-20260825-0003 | tencentdoc | 创建、编辑和读取腾讯文档中的在线文档、表格和协作资料。 | Create, edit, and read online documents, sheets, and collaboration materials in Tencent Docs. | 支持文档创建、表格编辑、在线资料读取、团队协作内容整理。 | Supports document creation, sheet editing, online content reading, and collaboration content organization. |
| CON-20260825-0004 | kingsoft | 创建、编辑和读取金山文档中的在线文档与表格，支持 WPS 协作资料整理。 | Create, edit, and read online documents and sheets in Kingsoft Docs. | 支持文档创建、表格编辑、文件读取、项目资料汇总和内容总结。 | Supports document creation, sheet editing, file reading, project material aggregation, and summarization. |
| CON-20260825-0005 | baidu | 查询、读取和总结百度网盘中的文件，帮助用户管理网盘资料。 | Search, read, and summarize files in Baidu Netdisk. | 支持网盘文件检索、文件夹浏览、文件内容总结、资料归类和关键词搜索。 | Supports file search, folder browsing, content summarization, material classification, and keyword search. |
| CON-20260825-0006 | lexiang | 搜索、创建和管理乐享知识库文档，帮助团队沉淀和复用内部知识。 | Search, create, and manage documents in Lexiang knowledge bases. | 支持知识库搜索、文档创建、文档管理、更新追踪和内容总结。 | Supports knowledge base search, document creation, document management, update tracking, and summarization. |
| CON-20260825-0007 | notion | 搜索、读取和管理 Notion 页面与数据库，帮助用户整理个人和团队知识。 | Search, read, and manage Notion pages and databases. | 支持页面搜索、数据库查询、内容读取、知识记录创建和项目数据整理。 | Supports page search, database query, content reading, knowledge record creation, and project data organization. |
| CON-20260825-0008 | zsxq | 查询知识星球内容并整理社群知识，帮助沉淀高价值讨论和问答。 | Query Zsxq content and organize community knowledge. | 支持帖子检索、问答整理、话题内容汇总、社群讨论总结。 | Supports post search, Q&A organization, topic summarization, and community discussion summaries. |
| CON-20260825-0009 | dingtalk | 查询钉钉工作消息、会议、文档和组织协作内容，帮助整理团队工作信息。 | Query DingTalk messages, meetings, documents, and organizational collaboration content. | 支持工作消息查询、会议安排查询、日程待办整理、文档资料同步。 | Supports work message search, meeting lookup, schedule and task organization, and document syncing. |
| CON-20260825-0010 | qqmail | 查询、总结和起草 QQ 邮箱邮件，帮助用户处理邮件往来和待办事项。 | Search, summarize, and draft emails in QQ Mail. | 支持邮件搜索、邮件总结、邮件起草、待办提取和附件信息整理。 | Supports email search, summarization, drafting, task extraction, and attachment information organization. |
| CON-20260825-0011 | netease | 查询、总结和起草网易邮箱邮件，帮助用户整理邮件沟通和客户往来。 | Search, summarize, and draft emails in NetEase Mail. | 支持邮件查询、往来总结、邮件起草、未读邮件摘要和风险事项提取。 | Supports email search, conversation summaries, drafting, unread email digests, and risk item extraction. |
| CON-20260825-0012 | wecom | 查询企业微信群聊、客户沟通、会议和组织协作内容，帮助整理企业工作上下文。 | Query WeCom chats, customer communication, meetings, and collaboration content. | 支持群聊查询、客户沟通总结、会议内容查找、项目待办整理。 | Supports chat search, customer communication summaries, meeting lookup, and project task organization. |
| CON-20260825-0013 | meeting | 查询腾讯会议记录，总结会议纪要并提取待办事项。 | Query Tencent Meeting records, summarize meeting notes, and extract action items. | 支持会议记录查询、会议纪要生成、参会信息整理、待办事项提取。 | Supports meeting record lookup, minutes generation, attendee information organization, and action item extraction. |
| CON-20260825-0014 | scan | 读取扫描文档、OCR 图片和 PDF 信息，帮助用户整理票据、合同和资料。 | Read scanned documents, OCR images, and PDF content to organize receipts, contracts, and materials. | 支持扫描文档读取、OCR 识别、图片表格提取、PDF 总结和关键信息整理。 | Supports scanned document reading, OCR, image table extraction, PDF summarization, and key information organization. |

## 示例问句

| 连接器ID | 原型Key | 示例问句1 | 示例问句2 | 示例问句3 |
|---|---|---|---|---|
| CON-20260825-0001 | ima | 在 ima 知识库中搜索“季度复盘”相关的资料 | 查看“产品手册”ima 知识库的详情和文件列表 | 引用 ima 知识库中关于 OpenAPI 的内容回答这个问题 |
| CON-20260825-0002 | feishu | 总结飞书项目群最近三天的讨论重点 | 新建一份飞书项目周报并填入本周进展 | 查询上周客户评审会议的待办事项 |
| CON-20260825-0003 | tencentdoc | 帮我新建一份会议纪要文档 | 把项目计划整理成腾讯表格 | 总结最近更新的团队文档 |
| CON-20260825-0004 | kingsoft | 查找金山文档里的路演材料 | 总结这个 WPS 表格里的任务进展 | 把访谈纪要整理成金山文档 |
| CON-20260825-0005 | baidu | 查找最近上传的研报文件 | 总结这个文件夹下的 PDF 内容 | 找出和新能源相关的文档 |
| CON-20260825-0006 | lexiang | 搜索乐享知识库里的投研流程 | 总结最近更新的制度文档 | 创建一条客户服务知识记录 |
| CON-20260825-0007 | notion | 搜索 Notion 里关于连接器服务的页面 | 总结项目数据库里的高优任务 | 创建一条新的知识记录 |
| CON-20260825-0008 | zsxq | 总结知识星球最近一周热门问答 | 查找关于产品增长的帖子 | 整理某个话题下的精华内容 |
| CON-20260825-0009 | dingtalk | 总结钉钉项目群今天的待办 | 查询明天的会议安排 | 把客户拜访计划同步到钉钉文档 |
| CON-20260825-0010 | qqmail | 帮我总结今天的重要邮件 | 起草一封客户回访邮件 | 提取邮件中的待办事项 |
| CON-20260825-0011 | netease | 查找客户最近一个月的往来邮件 | 总结未读邮件里的风险事项 | 写一封会议改期通知 |
| CON-20260825-0012 | wecom | 查询客户群最近讨论的关键问题 | 总结企业微信里的项目待办 | 查找上周销售会议内容 |
| CON-20260825-0013 | meeting | 总结最近一次会议纪要 | 查找上周的客户会议 | 提取会议中的待办事项 |
| CON-20260825-0014 | scan | 识别这份扫描合同的关键条款 | 把图片里的表格整理出来 | 总结扫描 PDF 的主要内容 |

## 分类预处理

| 分类ID | 分类中文名 | 分类英文名 | 状态 |
|---|---|---|---|
| knowledge | 知识库 | Knowledge Base | 启用 |
| docs | 文档协作 | Document Collaboration | 启用 |
| communication | 沟通邮箱 | Communication & Email | 启用 |
| files | 文件资料 | Files & Materials | 启用 |

## 连接器包主数据预处理

| 连接器包ID | 连接器包原型Key | 连接器包名称（中文） | 连接器包名称（英文） | 连接器包图片 | 连接器包简介（中文） | 连接器包简介（英文） | 连接器包状态 |
|---|---|---|---|---|---|---|---|
| PKG-20260825-0001 | wechat | 微信生态 | WeChat Ecosystem | 否 | 一次连接企业微信、腾讯会议、腾讯文档、QQ 邮箱和 ima 知识库，覆盖客户沟通、会议纪要与团队资料。 | Connect WeCom, Tencent Meeting, Tencent Docs, QQ Mail, and ima Knowledge Base for customer communication, meeting notes, and team materials. | 不公开 |
| PKG-20260825-0002 | knowledge | 知识库 | Knowledge Base | 否 | 把企业知识库、个人知识库和社群知识接入 Alice，支持搜索、引用、总结和问答。 | Connect enterprise, personal, and community knowledge sources to Alice for search, citation, summarization, and Q&A. | 不公开 |
| PKG-20260825-0003 | mail | 邮箱 | Mail | 否 | 连接常用邮箱，支持查询邮件、总结往来、起草回复和提取附件中的关键信息。 | Connect common mailboxes to search emails, summarize conversations, draft replies, and extract key attachment information. | 不公开 |
| PKG-20260825-0004 | docs | 文档协作 | Document Collaboration | 否 | 连接主流在线文档和表格，支持读取、创建、编辑和整理项目资料。 | Connect mainstream online documents and sheets to read, create, edit, and organize project materials. | 不公开 |

## 连接器包关系预处理

| 连接器包ID | 连接器包原型Key | 连接器包名称 | 包内连接器ID |
|---|---|---|---|
| PKG-20260825-0001 | wechat | 微信生态 | CON-20260825-0012；CON-20260825-0013；CON-20260825-0003；CON-20260825-0010；CON-20260825-0001 |
| PKG-20260825-0002 | knowledge | 知识库 | CON-20260825-0001；CON-20260825-0006；CON-20260825-0007；CON-20260825-0008 |
| PKG-20260825-0003 | mail | 邮箱 | CON-20260825-0010；CON-20260825-0011 |
| PKG-20260825-0004 | docs | 文档协作 | CON-20260825-0002；CON-20260825-0003；CON-20260825-0004 |

## 待确认项

| 项目 | 说明 |
|---|---|
| 公司主体 | ima、飞书、乐享知识库、知识星球的公司中英文主体需业务或法务确认 |
| 支持端 | 当前统一预设 Web、Desktop、Mobile，需要确认每个连接器实际支持端 |
| 连接器图片 | 当前预设无图片，需确认是否使用品牌 Logo、文字 Logo 或统一占位图 |
| 连接器英文名 | 部分中文产品是否采用官方英文名需确认 |
| 连接器包关系 | 当前依据原型预处理，需确认首批后台是否沿用这些连接器包；连接器包 ID 后续由系统正式生成 |
| 连接器状态 | 当前统一为“不公开”，完成录入与确认后再调整为“公开” |
