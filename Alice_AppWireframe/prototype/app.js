// ── State ──
let page = 'home-watch';
let drawerOpen = false;
let embeddedChatOpen = false;
let aliceOpen = false;
let kb = 'hidden';
let workTab = 'dynamic';
let toolTab = 'skills';
let toolSearchQuery = '';
let toolSearchSubmittedQuery = '';
let toolSearchResultTab = 'all';
let automationTab = 'scheduled';
let marketTab = 'A股';
let taskTab = 'intro';
let notificationTab = 'interaction';
let currentRunIndex = 0;
let chatTarget = 'alice';
let projectMenuOpen = false;
let filesMenuOpen = false;
let filesViewMode = 'list';
let filesSortBy = 'time';
let filesSelectMode = false;
let appMode = 'demo';
let activeComponent = '1-A';
let selectedNavComponent = '1-A';
let selectedTabbarComponent = 'tabbar-main';
let selectedInputComponent = 'composer-input';
let selectedContentComponent = 'content-list';
let componentUi = {};
let currentProject = '信用债合规筛查';
let currentStock = {name:'昊华科技',code:'600378.SH',price:'47.57',chg:'+3.98%',up:true};
let draggingMenuIndex = null;
let contentScrollTop = 0;
let scrollChromeTimer = null;
let composerText = '';
let composerMenu = '';
let composerQuickMode = '快速问答';
let composerExpert = '';
let composerInputMode = 'voice';
let chatCarouselTimers = [];
let speechMuted = false;
let projectActionMenuOpen = false;
let projectChatIsNew = false;
let meetingActionMenuOpen = false;
let aiMeetingSheetOpen = false;
let panelObjectMenu = null;
let panelLongPressTimer = null;
let panelSuppressClick = false;
let panelPressPoint = null;
let panelReturnFocusKey = '';
const panelPinned = new Set();
const panelRenames = new Map();
const panelHidden = new Set();
const chatFavorites = new Set(['茅台近5年ROE变化分析','半导体板块异动原因']);

const SCROLL_STOP_DELAY = 180;
const INPUT_BAR_HEIGHT = 55;
const TAB_BAR_HEIGHT = 68;

const COMPONENT_SPECS = {
  '1-A':{name:'一级频道型',level:'一级',layout:'页面A / 页面B / 页面C / 功能 / 功能',used:'市场、自选、热议、持仓、我的、拓客服务',left:'无',right:'搜索、通知、设置等模块级功能',rule:'用于同一主模块内平级频道切换。'},
  '1-B-1':{name:'一级对话主页型',level:'一级',layout:'= / Alice / > / 播音(静音) / 通知',used:'聊天未开始对话',left:'对话 Panel',right:'播音/静音、通知',rule:'中间标题支持切换 Agent 或专家数字分身。'},
  '1-B-2':{name:'一级对象列表型',level:'一级',layout:'= / 页面名称 / 功能 / 功能',used:'工作项目列表、文件资料',left:'当前模块对象 Panel',right:'新建、上传、通知等模块操作',rule:'用于对象列表入口，Panel 管理对象目录。'},
  '1-C1':{name:'一级对话详情型',level:'一级',layout:'= / 对话标题 / 播音(静音) / 通知',used:'聊天已开始对话',left:'对话 Panel',right:'播音/静音、通知',rule:'对话详情仍在一级对话流内，不使用返回。'},
  '1-D':{name:'一级子 Tab 型',level:'一级',layout:'= / 页面名称 / 功能 / 功能 + 子Tab',used:'自动任务、工具市场',left:'当前模块 Panel',right:'新建、搜索、通知等模块操作',rule:'子 Tab 只切换当前页面数据域，不改变层级。'},
  '2-A-1':{name:'二级对象详情型',level:'二级',layout:'= / 对象标题 / > / 项目操作 / 通知 + 子Tab',used:'项目详情、任务详情',left:'当前模块 Panel',right:'项目操作（新建对话、添加文件）、通知等对象/模块操作',rule:'标题下拉用于快速切换同类对象。'},
  '3-A':{name:'三级详情型',level:'三级',layout:'< / 页面名称 / 功能 / 功能',used:'个股行情、通知中心、项目群聊、执行详情',left:'返回上一级',right:'收藏、搜索、设置、再次执行等',rule:'三级页面仍保留底部输入框和 TabBar。'},
  '3-B':{name:'三级子 Tab 型',level:'三级',layout:'< / 页面名称 / 功能 / 功能 + 子Tab',used:'我的内管理类兼容页',left:'返回上一级',right:'搜索、新建等',rule:'新主模块优先使用 1-D，3-B 用于较深管理页。'},
  '4-A':{name:'四级设置型',level:'四级',layout:'< / 页面名称',used:'设置',left:'返回上一级',right:'通常为空',rule:'四级默认不显示底部输入框，仍保留底部 TabBar。'},
  '4-B':{name:'四级搜索型',level:'四级',layout:'< / 可输入搜索框 / 清除 / 搜索',used:'工具市场搜索',left:'返回上一级',right:'搜索提交',rule:'用于模块内独立搜索页，搜索框承载搜索词或搜索标的。'},
  'tabbar-main':{name:'底部主 TabBar',level:'组件',layout:'Tab 1 / Tab 2 / Tab 3 / Tab 4 / 我的',used:'所有页面底部模块入口',left:'无',right:'无',rule:'前四个 Tab 可由用户配置，第五个固定为“我的”。'},
  'tabbar-hidden':{name:'隐藏 TabBar',level:'组件',layout:'不显示底部 TabBar',used:'极少数沉浸式或临时态页面',left:'无',right:'无',rule:'默认不建议隐藏，除非页面明确不属于常规 App 流。'},
  'composer-input':{name:'底部输入框',level:'组件',layout:'附件 / 语音或输入 / 键盘或语音切换；键盘态显示快速问答、金融专家、技能',used:'一级、二级、三级页面',left:'添加附件',right:'键盘/语音切换',rule:'Pill 浮于内容层渐变背景上；快速问答与专家可替换，技能选中后写入对话框。'},
  'composer-hidden':{name:'隐藏输入框',level:'组件',layout:'不显示底部输入框',used:'四级设置页或纯阅读临时页面',left:'无',right:'无',rule:'一、二、三级默认显示；四级默认隐藏。'},
  'content-list':{name:'行情列表',level:'组件',layout:'表头 / 名称+代码 / 迷你走势 / 最新价 / 涨跌幅',used:'自选、持仓、行情类列表页',left:'无',right:'无',rule:'列表行复用四列结构与 spark 迷你走势，点击行进入对象详情。'},
  'content-index':{name:'指数卡片',level:'组件',layout:'名称 / 最新价 / 涨跌 / 迷你走势',used:'市场指数区、板块指数卡',left:'无',right:'无',rule:'卡片等宽横排，红涨绿跌，点击进入对应行情。'},
  'content-heat':{name:'热力图',level:'组件',layout:'色块 / 名称 / 涨跌幅',used:'市场热度区、板块强度总览',left:'无',right:'无',rule:'色块红涨绿跌，色块大小表达强度。'},
  'content-sector':{name:'板块列表',level:'组件',layout:'板块名 / 描述 / 成交额 / 涨跌幅',used:'热门板块、板块排序列表',left:'无',right:'无',rule:'列表行数值右对齐，涨跌幅标色。'},
  'content-hot':{name:'热议卡片',level:'组件',layout:'排名 / 标题 / 摘要 / 标签组',used:'热议信息流、话题列表',left:'无',right:'无',rule:'卡片承载话题对象，标签展示关联指数与资金。'},
  'content-bubble':{name:'对话气泡',level:'组件',layout:'用户气泡右 / Alice 气泡左 / 时间',used:'对话详情、执行结果聊天流',left:'无',right:'无',rule:'用户气泡蓝底靠右，Alice 白底靠左带头像。'},
  'content-card':{name:'项目/任务卡片',level:'组件',layout:'标题 / 摘要 / Meta 行',used:'项目列表、自动任务、执行记录',left:'无',right:'无',rule:'通用对象卡片：标题 + 摘要 + 状态或 Meta。'},
  'content-form':{name:'内容表单',level:'组件',layout:'标签 / 输入项 / 说明 / 操作按钮',used:'任务说明、配置编辑页',left:'无',right:'无',rule:'标签与输入控件垂直排列，底部放主要操作。'}
};

const COMPONENT_DEFAULT_TEXT = {
  '1-A':{title:'',tabs:'自选，热议，市场，持仓',subTabs:'',actions:'搜索，通知',placeholder:'输入任务或对话…'},
  '1-B-1':{title:'Alice',tabs:'',subTabs:'',actions:'播音/静音，通知',placeholder:'输入任务或对话…'},
  '1-B-2':{title:'项目列表',tabs:'',subTabs:'',actions:'新建对话，通知',placeholder:'输入任务或对话…'},
  '1-C1':{title:'对话标题',tabs:'',subTabs:'',actions:'播音/静音，通知',placeholder:'继续提问…'},
  '1-D':{title:'自动任务',tabs:'',subTabs:'定时任务，提醒任务',actions:'新建任务，通知',placeholder:'输入任务或对话…'},
  '2-A-1':{title:'项目标题',tabs:'',subTabs:'动态，群聊，文件',actions:'项目操作，通知',placeholder:'输入任务或对话…'},
  '3-A':{title:'股票名称 [代码]',tabs:'',subTabs:'',actions:'收藏，搜索',placeholder:'输入任务或对话…'},
  '3-B':{title:'工具',tabs:'',subTabs:'技能，专家，连接器',actions:'搜索',placeholder:'输入任务或对话…'},
  '4-A':{title:'设置',tabs:'',subTabs:'',actions:'',placeholder:'输入任务或对话…'},
  '4-B':{title:'',tabs:'',subTabs:'',actions:'搜索',placeholder:'搜索词、搜索标的'},
  'tabbar-main':{title:'',tabs:'市场，聊天，工作，拓客服务，我的',subTabs:'',actions:'',placeholder:'输入任务或对话…'},
  'tabbar-hidden':{title:'',tabs:'',subTabs:'',actions:'',placeholder:'输入任务或对话…'},
  'composer-input':{title:'页面名称',tabs:'',subTabs:'',actions:'搜索，通知',placeholder:'输入任务或对话…'},
  'composer-hidden':{title:'页面名称',tabs:'',subTabs:'',actions:'搜索，通知',placeholder:'输入任务或对话…'}
};

let componentDrafts = JSON.parse(JSON.stringify(COMPONENT_DEFAULT_TEXT));

const WORK_PROJECTS = [
  {name:'信用债合规筛查',meta:'已处理 142 / 380 支债券'},
  {name:'Q3持仓归因分析',meta:'依赖：行情数据拉取完成后执行'},
  {name:'A股消费因子回测',meta:'完成于 09:14 · 耗时 3m 42s'},
  {name:'半导体板块舆情汇总',meta:'完成于 昨天 17:30'}
];
const WORK_PROJECT_COLORS = ['#A5CAFA','#FFD580','#6EE7B7','#6EE7B7'];

const MENU_ITEMS = [
  '市场',
  '聊天',
  '工作',
  '拓客服务',
  '会议',
  '文件资料',
  '自动任务',
  '市场工具'
];

const CHAT_TRENDING_ITEMS = [
  {
    title:'GLM-5.3 上架 Amazon Bedrock',
    desc:'智谱与 AWS 开启收入分成，海外商业化通道进一步打开。',
    icon:'sparkles'
  },
  {
    title:'DeepSeek 开源昇腾基础组件',
    desc:'国产算力工具链与核心库加速完善，生态迁移成本有望下降。',
    icon:'cpu'
  },
  {
    title:'PCB 供应链涨价周期开启',
    desc:'AI 服务器需求持续爆发，核心材料与高阶 PCB 供应全面趋紧。',
    icon:'circuit-board'
  }
];

const CHAT_FEATURED_CASES = [
  {
    title:'2026 年上半年商品期货市场复盘',
    desc:'贵金属与工业金属领涨，农产品分化明显。',
    icon:'chart-candlestick'
  },
  {
    title:'2026 年上半年 ETF 市场复盘',
    desc:'ETF 规模持续扩张，被动投资成为主流趋势。',
    icon:'chart-no-axes-combined'
  },
  {
    title:'2026 年上半年债券市场复盘',
    desc:'全球降息周期下的债市走势与资产配置策略。',
    icon:'landmark'
  }
];

let FILE_ITEMS = [
  {name:'信用债合规资料',type:'folder',count:'24 项',time:'今天 10:32',sortTime:5},
  {name:'市场热议素材库',type:'folder',count:'18 项',time:'昨天 17:30',sortTime:4},
  {name:'客户路演资料',type:'folder',count:'9 项',time:'周一 09:12',sortTime:3},
  {name:'板块轮动强度趋势.png',type:'image',count:'1.8 MB',time:'09-08 08:40',sortTime:2},
  {name:'合规扫描结果_v3.xlsx',type:'sheet',count:'2.4 MB',time:'09-07 18:20',sortTime:1}
];

// ── 自动任务数据 ──
const AUTOMATION_SCHEDULED = [
  {title:'每日持仓更新 & 3W3C 工作计划',prompt:'每天收盘后更新当前持仓、关键波动和风险提示，并同步生成 3W3C 工作计划的当日进展与次日行动。',frequency:'每天',time:'17:30',hasNew:true,enabled:true},
  {title:'每周市场解读周报',prompt:'每周五收盘后汇总主要指数、行业轮动、资金流向和重点事件，形成适合客户沟通的市场解读周报初稿。',frequency:'每周',time:'周五 18:00',hasNew:true,enabled:true},
  {title:'每日市场早报汇总',prompt:'每日开盘前整合隔夜海外市场、宏观数据、重要公告和今日关注事项，输出早报摘要与机会提示。',frequency:'每天',time:'08:30',hasNew:false,enabled:true},
  {title:'A股盘后异动复盘',prompt:'盘后扫描 A 股涨跌幅、成交额、龙虎榜和公告催化，提取需要跟进的异动个股与板块线索。',frequency:'每天',time:'16:45',hasNew:false,enabled:false},
  {title:'自选股新闻与公告巡检',prompt:'定时检查自选股公告、新闻、互动平台和研报更新，标记可能影响持仓判断的新信息。',frequency:'每天',time:'12:00',hasNew:true,enabled:true},
  {title:'客户服务记录周归档',prompt:'每周日归档客户沟通记录、待办事项和已发送材料，整理下周需要主动跟进的服务清单。',frequency:'每周',time:'周日 20:00',hasNew:false,enabled:false}
];

const AUTOMATION_REMINDERS = [
  {title:'有研新材',code:'600206',prompt:'日涨幅超过 5% 时，生成近 1 小时新闻总结，并提取公告、研报和资金异动线索。',condition:'日涨幅超 5%',hasNew:true,enabled:true},
  {title:'双环传动',code:'002472',prompt:'5 分钟跌幅超过 3% 时，分析资金流向变化、盘口成交和板块联动情况。',condition:'5分钟跌幅超 3%',hasNew:true,enabled:true},
  {title:'上证指数',code:'000001.SH',prompt:'日跌幅超过 1.5% 时，汇总权重板块贡献、北向资金变化和宏观消息影响。',condition:'日跌幅超 1.5%',hasNew:false,enabled:true},
  {title:'创业板指',code:'399006.SZ',prompt:'5 分钟涨幅超过 1% 时，识别主要拉动行业、成交放大方向和市场情绪变化。',condition:'5分钟涨幅超 1%',hasNew:false,enabled:false},
  {title:'中际旭创',code:'300308',prompt:'日涨幅超过 6% 时，生成 CPO 板块近 1 小时新闻总结，并比较核心标的涨跌幅。',condition:'日涨幅超 6%',hasNew:true,enabled:true},
  {title:'沪深300ETF',code:'510300',prompt:'成交额较前一小时放大 80% 时，分析资金申赎、指数权重和大盘风格变化。',condition:'成交额放大超 80%',hasNew:false,enabled:false}
];

const AUTOMATION_RUN_HISTORY = [
  {date:'今天 17:30',title:'每日持仓更新 & 3W3C 工作计划',status:'成功',summary:'执行已完成。本次未触发任何异常告警，3W3C 工作计划已根据今日收盘数据自动更新。',steps:['读取上下文（持仓、模板、上次结果）','调用 Wind 行情数据接口（iFinD）','计算当日盈亏与波动','生成 3W3C 工作总结','写入文档库并推送通知'],tools:['Wind 行情接口 · 取持仓收盘数据','skill · 三表建模与盈亏归因','知识库 · 写入工作总结 docx'],holdings:[{name:'立新能源',code:'001258.SZ',close:'12.45',day:'+1.22%',pnl:'+8.6%',up:true},{name:'星网锐捷',code:'002396.SZ',close:'28.10',day:'-0.35%',pnl:'+3.2%',up:true},{name:'双环传动',code:'002422.SZ',close:'32.78',day:'+2.18%',pnl:'+12.4%',up:true},{name:'中际旭创',code:'300308.SZ',close:'186.50',day:'-1.06%',pnl:'-2.1%',up:false}],w3c:{What:['持仓监控日报已生成并归档。','立新能源、双环传动表现符合预期，未触发告警。','中际旭创短期回撤，已记录观察。'],Why:['光伏板块情绪回暖，立新能源放量上行。','传动板块受新能源车销量催化，双环传动突破前高。','光模块板块回调消化前期涨幅，中际旭创承压。'],Watch:['立新能源能否站稳 12.5 元，量能是否延续。','双环传动突破后回踩 32 元支撑的承接力度。','中际旭创在 180 元一线的资金回流情况。'],Warning:['沪指若失守 3200 点，需降低整体仓位。','关注美联储议息会议对外资流向的扰动。']},artifacts:[{name:'每日持仓更新 2026-09-08.docx',meta:'12.4 KB · 已写入企业知识库'},{name:'持仓监控看板',meta:'已更新至自选股'}]},
  {date:'昨天 17:30',title:'每日持仓更新 & 3W3C 工作计划',status:'成功',summary:'执行已完成。立新能源放量突破，双环传动承压，3W3C 已记录次日观察。',steps:['读取上下文','调用 Wind 行情数据接口','计算当日盈亏与波动','生成 3W3C 工作总结','写入文档库并推送通知'],tools:['Wind 行情接口','skill · 三表建模与盈亏归因','知识库 · 写入 docx'],holdings:[{name:'立新能源',code:'001258.SZ',close:'12.30',day:'+2.50%',pnl:'+7.2%',up:true},{name:'星网锐捷',code:'002396.SZ',close:'28.20',day:'+0.35%',pnl:'+3.5%',up:true},{name:'双环传动',code:'002422.SZ',close:'32.08',day:'-0.18%',pnl:'+10.8%',up:false},{name:'中际旭创',code:'300308.SZ',close:'188.50',day:'+0.86%',pnl:'-1.1%',up:true}],w3c:{What:['持仓日报已归档。','立新能源放量突破，关注后续持续性。'],Why:['光伏板块情绪修复。'],Watch:['立新能源能否站稳 12 元。'],Warning:['沪指 3250 点支撑。']},artifacts:[{name:'每日持仓更新 2026-09-07.docx',meta:'12.1 KB · 已写入企业知识库'}]},
  {date:'09-06 17:30',title:'每日持仓更新 & 3W3C 工作计划',status:'成功',summary:'本次未触发任何告警，3W3C 已更新。',steps:['读取上下文','调用 Wind 行情','计算盈亏','生成 3W3C 总结','写入文档库'],tools:['Wind 行情','skill · 三表建模','知识库 · docx'],holdings:[{name:'立新能源',code:'001258.SZ',close:'12.00',day:'+1.20%',pnl:'+6.5%',up:true}],w3c:{What:['日报归档完成。'],Why:['光伏板块企稳。'],Watch:['立新能源 12 元压力位。'],Warning:['美联储议息扰动。']},artifacts:[{name:'每日持仓更新 2026-09-06.docx',meta:'11.8 KB'}]}
];

const STOCKS = {
  '600378.SH':{name:'昊华科技',code:'600378.SH',price:'47.57',chg:'+3.98%',up:true},
  '002428.SZ':{name:'云南锗业',code:'002428.SZ',price:'92',chg:'+5.64%',up:true},
  '002396.SZ':{name:'星网锐捷',code:'002396.SZ',price:'38.14',chg:'+3.05%',up:true},
  '002138.SZ':{name:'顺络电子',code:'002138.SZ',price:'48.94',chg:'+10%',up:true},
  '000636.SZ':{name:'风华高科',code:'000636.SZ',price:'50.45',chg:'+4.21%',up:true},
  '002472.SZ':{name:'双环传动',code:'002472.SZ',price:'37.62',chg:'-1.13%',up:false},
  '605111.SH':{name:'新洁能',code:'605111.SH',price:'55.15',chg:'+2.21%',up:true},
  '600460.SH':{name:'士兰微',code:'600460.SH',price:'30.96',chg:'+2.04%',up:true},
  '000779.SZ':{name:'甘咨询',code:'000779.SZ',price:'10.33',chg:'-2.55%',up:false},
  '688256.SH':{name:'寒武纪',code:'688256.SH',price:'1328.00',chg:'-3.54%',up:false},
  '688041.SH':{name:'海光信息',code:'688041.SH',price:'215.68',chg:'-3.85%',up:false},
  '603019.SH':{name:'中科曙光',code:'603019.SH',price:'83.52',chg:'-1.09%',up:false},
  '002230.SZ':{name:'科大讯飞',code:'002230.SZ',price:'54.36',chg:'+0.05%',up:true},
  '688234.SH':{name:'天岳先进',code:'688234.SH',price:'69.30',chg:'-4.23%',up:false},
  '002436.SZ':{name:'兴森科技',code:'002436.SZ',price:'19.88',chg:'+2.16%',up:true},
  '603228.SH':{name:'景旺电子',code:'603228.SH',price:'47.26',chg:'+0.68%',up:true},
  '002916.SZ':{name:'深南电路',code:'002916.SZ',price:'168.40',chg:'+1.92%',up:true},
  '600519.SH':{name:'贵州茅台',code:'600519.SH',price:'1476.80',chg:'+1.86%',up:true},
  '600196.SH':{name:'复星医药',code:'600196.SH',price:'28.62',chg:'+2.69%',up:true},
  '300347.SZ':{name:'泰格医药',code:'300347.SZ',price:'59.88',chg:'+3.42%',up:true},
  '601888.SH':{name:'中国中免',code:'601888.SH',price:'74.15',chg:'+1.00%',up:true},
  '00700.HK':{name:'腾讯控股',code:'00700.HK',price:'658.50',chg:'-0.26%',up:false}
};

// ── Page definitions ──
function scheduledCardsHtml(){
  return `<div class="at-list">
    ${AUTOMATION_SCHEDULED.map((t,i)=>`
      <div class="at-card" data-page="automation-task-detail">
        <div class="at-top">
          <div class="at-title">${t.title}</div>
          <div class="at-hist${t.hasNew?' has-new':''}" title="执行历史" data-page="automation-task-detail"><i data-lucide="history"></i></div>
        </div>
        <div class="at-prompt">${t.prompt}</div>
        <div class="at-foot">
          <div class="at-meta">
            <span class="at-meta-chip">${t.frequency}</span>
            <span class="at-meta-chip">${t.time}</span>
          </div>
          <div class="at-del" title="删除"><i data-lucide="trash-2"></i></div>
          <div class="at-switch${t.enabled?' on':''}"></div>
        </div>
      </div>
    `).join('')}
  </div>`;
}
function reminderCardsHtml(){
  return `<div class="at-list">
    ${AUTOMATION_REMINDERS.map((t,i)=>`
      <div class="at-card" data-page="automation-task-detail">
        <div class="at-top">
          <div class="at-title">${t.title}<span class="at-code-tag">${t.code}</span></div>
          <div class="at-hist${t.hasNew?' has-new':''}" title="执行历史" data-page="automation-task-detail"><i data-lucide="history"></i></div>
        </div>
        <div class="at-prompt">${t.prompt}</div>
        <div class="at-foot">
          <div class="at-meta">
            <span class="at-meta-chip warn">${t.condition}</span>
          </div>
          <div class="at-del" title="删除"><i data-lucide="trash-2"></i></div>
          <div class="at-switch${t.enabled?' on':''}"></div>
        </div>
      </div>
    `).join('')}
  </div>`;
}
function getCurrentRun(){
  return AUTOMATION_RUN_HISTORY[currentRunIndex] || AUTOMATION_RUN_HISTORY[0];
}
function runHistoryCardsHtml(){
  return `<div class="run-list">
    ${AUTOMATION_RUN_HISTORY.map((run,i)=>`
      <div class="run-card" data-run-index="${i}">
        <div class="run-card-top">
          <div class="run-date">${run.date}</div>
          <div class="run-status">${run.status}</div>
        </div>
        <div class="run-title">${run.title}</div>
        <div class="run-summary">${run.summary}</div>
        <div class="run-meta-row">
          <span><i data-lucide="list-checks"></i>${run.steps ? run.steps.length : 0} 步</span>
          <span><i data-lucide="file-text"></i>${run.artifacts ? run.artifacts.length : 0} 份产物</span>
          <span><i data-lucide="chevron-right"></i>查看结果</span>
        </div>
      </div>
    `).join('')}
  </div>`;
}
function renderExecRun(run,showActions){
  const holdingsHtml=run.holdings?`
    <div class="exec-section">
      <div class="exec-section-h">持仓监控</div>
      <div class="exec-hold-tbl">
        <div class="h">标的</div><div class="h">收盘</div><div class="h">盈亏</div>
        ${run.holdings.map(h=>`
          <div class="c">${h.name}<br><span style="font-size:10px;color:#9CA8BC">${h.code}</span></div>
          <div class="c r">${h.close}</div>
          <div class="c r ${h.up?'up':'dn'}">${h.pnl}</div>
        `).join('')}
      </div>
    </div>`:'';
  const w3cHtml=run.w3c?`
    <div class="exec-w3c">
      <div class="exec-w3c-card"><div class="exec-w3c-h">What · 发生了什么</div><ul class="exec-w3c-list">${run.w3c.What.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="exec-w3c-card"><div class="exec-w3c-h">Why · 为什么</div><ul class="exec-w3c-list">${run.w3c.Why.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="exec-w3c-card"><div class="exec-w3c-h">Watch · 观察什么</div><ul class="exec-w3c-list">${run.w3c.Watch.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="exec-w3c-card warn"><div class="exec-w3c-h">Warning · 警示信号</div><ul class="exec-w3c-list">${run.w3c.Warning.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    </div>`:'';
  const artifactsHtml=run.artifacts?`
    <div class="exec-section">
      <div class="exec-section-h">产物清单</div>
      <div class="exec-artifacts">
        ${run.artifacts.map(a=>`
          <div class="exec-artifact">
            <div class="exec-artifact-ico">📄</div>
            <div class="exec-artifact-main">
              <div class="exec-artifact-name">${a.name}</div>
              <div class="exec-artifact-meta">${a.meta}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`:'';
  const stepsHtml=run.steps?`
    <div class="exec-section">
      <div class="exec-section-h">思考步骤</div>
      <ol class="exec-steps">${run.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      <div class="exec-tools">${run.tools.map(t=>`<span class="exec-tool"><i data-lucide="wrench"></i>${t}</span>`).join('')}</div>
    </div>`:'';
  const actionsHtml=showActions?`
    <div class="exec-actions">
      <div class="exec-act" title="复制"><i data-lucide="copy"></i></div>
      <div class="exec-act" title="赞"><i data-lucide="thumbs-up"></i></div>
      <div class="exec-act" title="踩"><i data-lucide="thumbs-down"></i></div>
      <div class="exec-act" title="下载"><i data-lucide="download"></i></div>
      <div class="exec-act" title="分享"><i data-lucide="share-2"></i></div>
    </div>`:'';
  return `
    <div class="exec-user-bubble">
      <div class="bubble">${run.title}</div>
    </div>
    <div class="exec-alice">
      <div class="exec-alice-ava">A</div>
      <div class="exec-alice-body">
        <div class="exec-meta"><strong>${run.date}</strong><span class="sep">·</span><span>${run.status}</span></div>
        <div class="exec-alice-name">Alice</div>
        <div class="exec-summary">${run.summary}</div>
        ${stepsHtml}
        ${holdingsHtml}
        ${w3cHtml}
        ${artifactsHtml}
        ${actionsHtml}
      </div>
    </div>
  `;
}
const TOOL_MARKET_ITEMS = {
  skills:[
    {icon:'line-chart',name:'个股分析',status:'已安装',tone:'ok',desc:'整合行情、公告与财务数据，生成个股研究线索。',meta:['我的技能','本周 86 次','投研分析']},
    {icon:'layers',name:'行业分析',status:'已安装',tone:'ok',desc:'跟踪产业链、板块轮动和核心公司表现。',meta:['我的技能','本周 54 次','行业研究']},
    {icon:'file-text',name:'宏观财经报告',status:'可更新',tone:'warn',desc:'生成宏观事件、政策变化和资产影响摘要。',meta:['官方推荐','新版本','宏观策略']}
  ],
  experts:[
    {icon:'user-round-check',name:'会议专家',status:'已添加',tone:'ok',desc:'提取会议纪要、待办和关键决策，支持会后追踪。',meta:['我的专家','Agent','协作']},
    {icon:'candlestick-chart',name:'个股研究专家',status:'已添加',tone:'ok',desc:'围绕公司基本面、行情和新闻事件形成研究判断。',meta:['我的专家','Agent','股票']},
    {icon:'landmark',name:'固收分析专家',status:'推荐',tone:'',desc:'分析利率、信用利差、久期和债券组合风险。',meta:['官方推荐','固收','信用债']}
  ],
  connectors:[
    {icon:'video',name:'腾讯会议',status:'已连接',tone:'ok',desc:'查询会议记录、总结会议纪要，提取会议待办。',meta:['我的连接器','个人授权','318 次调用']},
    {icon:'database',name:'ima知识库',status:'已连接',tone:'ok',desc:'连接知识库资料和文件能力，支持检索、总结和引用。',meta:['我的连接器','机构内','286 次调用']},
    {icon:'message-square-warning',name:'企业微信',status:'需处理',tone:'warn',desc:'连接消息、通讯录和客户沟通内容，当前授权需要处理。',meta:['我的连接器','企业授权','重新授权']},
    {icon:'folder-cloud',name:'百度网盘',status:'连接',tone:'',desc:'连接云盘文件，支持文件搜索、分类浏览和内容总结。',meta:['官方推荐','文件资料','个人授权']}
  ]
};
const COMPOSER_QUICK_MODES = ['快速问答','Agent模式','深度研究'];
const COMPOSER_EXPERTS = [
  {name:'会议专家',icon:'notebook-tabs'},
  {name:'市场监测专家',icon:'radar'},
  {name:'个股研究专家',icon:'candlestick-chart'},
  {name:'固收分析专家',icon:'landmark'}
];
function toolMarketCardsHtml(){
  const items = TOOL_MARKET_ITEMS[toolTab] || TOOL_MARKET_ITEMS.skills;
  return toolMarketCardsFromItems(items);
}

function toolMarketCardsFromItems(items){
  return `<div class="tool-market-list">
    ${items.map(item=>`
      <div class="tool-market-card">
        <div class="tool-market-ico"><i data-lucide="${item.icon}"></i></div>
        <div class="tool-market-main">
          <div class="tool-market-top">
            <div class="tool-market-name">${item.name}</div>
            <div class="tool-market-status ${item.tone}">${item.status}</div>
          </div>
          <div class="tool-market-desc">${item.desc}</div>
          <div class="tool-market-meta">${item.meta.map(m=>`<span>${m}</span>`).join('')}</div>
        </div>
      </div>
    `).join('')}
  </div>`;
}

function allToolMarketItems(){
  return Object.entries(TOOL_MARKET_ITEMS).flatMap(([type,items])=>
    items.map(item=>Object.assign({}, item, {type, meta:[TOOL_TABS[type], ...item.meta]}))
  );
}

const TOOL_SEARCH_TABS = [
  {key:'all',label:'全部'},
  {key:'experts',label:'专家'},
  {key:'skills',label:'技能'},
  {key:'connectors',label:'连接器'}
];

function toolSearchResultsHtml(){
  const submitted = toolSearchSubmittedQuery.trim();
  if(!submitted){
    return `
      <div class="tool-search-idle">
        <i data-lucide="search"></i>
        <div class="tool-search-idle-title">输入搜索词后查看结果</div>
        <div class="tool-search-idle-desc">支持搜索技能、专家、连接器名称和标签。</div>
      </div>
    `;
  }
  const query = submitted.toLowerCase();
  const source = allToolMarketItems();
  const matched = source.filter(item=>[item.name,item.status,item.desc,...item.meta].join(' ').toLowerCase().includes(query));
  const countByTab = {
    all: matched.length,
    experts: matched.filter(item=>item.type==='experts').length,
    skills: matched.filter(item=>item.type==='skills').length,
    connectors: matched.filter(item=>item.type==='connectors').length
  };
  const activeTab = TOOL_SEARCH_TABS.some(tab=>tab.key===toolSearchResultTab) ? toolSearchResultTab : 'all';
  const results = activeTab==='all' ? matched : matched.filter(item=>item.type===activeTab);
  const activeLabel = TOOL_SEARCH_TABS.find(tab=>tab.key===activeTab)?.label || '全部';
  return `
    <div class="tool-search-head">
      <div class="tool-search-title">“${escapeHtml(submitted)}”</div>
      <div class="tool-search-query">共 ${matched.length} 个结果</div>
    </div>
    <div class="tool-search-tabs">
      ${TOOL_SEARCH_TABS.map(tab=>`
        <button class="tool-search-tab${tab.key===activeTab?' active':''}" data-tool-search-tab="${tab.key}">
          <span>${tab.label}</span><b>${countByTab[tab.key]}</b>
        </button>
      `).join('')}
    </div>
    ${results.length?toolMarketCardsFromItems(results):`
      <div class="tool-search-empty">
        <i data-lucide="search-x"></i>
        <div>${activeLabel}中暂无匹配结果</div>
      </div>
    `}
  `;
}

const PAGE_FLOW_MODULE = {
  'home-watch':'market','home-market':'market','home-hot':'market','home-portfolio':'market','stock-quote':'market',
  'chat-main':'chat','chat-detail':'chat',
  'work-dashboard':'work','work-detail':'work','work-group-chat':'work',
  'my-link':'link',
  'meeting-home':'meeting','meeting-all':'meeting','meeting-upload':'meeting','meeting-detail':'meeting',
  'files-home':'files','file-view':'files',
  'automation-home':'automation','automation-task-detail':'automation','automation-run-detail':'automation',
  'tools-home':'tools','tools-search':'tools','mine-tools':'tools',
  'mine':'mine','settings':'mine','menu-edit':'mine',
  'notification-center':'other'
};
const FLOW_CHARTS = {
  market:{
    title:'市场 Flow',
    flows:[
      {name:'行情浏览',steps:[['自选','home-watch'],['个股行情','stock-quote'],['返回自选','home-watch']],context:'证券上下文',tab:'市场'},
      {name:'单券提问',steps:[['个股行情','stock-quote'],['底部提问','stock-quote'],['抽屉内继续提问','stock-quote']],context:'当前证券 + 聊天记录',tab:'市场'}
    ]
  },
  chat:{
    title:'聊天 Flow',
    flows:[
      {name:'开始对话',steps:[['聊天','chat-main'],['点击历史对话','chat-detail'],['继续对话','chat-detail']],context:'当前对话',tab:'聊天'},
      {name:'切换对话对象',steps:[['Alice','chat-main'],['切换 Agent','chat-main'],['新建对话','chat-detail']],context:'Agent / 专家数字分身',tab:'聊天'}
    ]
  },
  work:{
    title:'工作 Flow',
    flows:[
      {name:'进入项目',steps:[['项目列表','work-dashboard'],['点击项目','work-detail'],['项目群聊','work-group-chat'],['返回项目','work-detail']],context:'当前项目',tab:'工作'},
      {name:'项目文件查看',steps:[['项目详情 / 文件','work-detail','files'],['查看文件','file-view'],['返回项目文件','work-detail','files']],context:'当前项目 + 当前文件',tab:'工作'},
      {name:'项目列表提问',steps:[['项目列表','work-dashboard'],['底部提问','chat-detail'],['沉淀为项目','work-detail']],context:'工作模块，新建项目对话过程',tab:'工作'},
      {name:'项目详情提问',steps:[['项目详情','work-detail'],['底部提问','work-group-chat'],['返回项目','work-detail']],context:'当前项目，发起项目群聊',tab:'工作'}
    ]
  },
  link:{
    title:'拓客服务 Flow',
    flows:[
      {name:'服务入口',steps:[['拓客服务','my-link'],['选择服务对象','my-link'],['生成服务材料','chat-detail']],context:'客户服务场景',tab:'拓客服务'}
    ]
  },
  meeting:{
    title:'会议 Flow',
    flows:[
      {name:'参会列表',steps:[['我的参会','meeting-home'],['点击会议','meeting-detail'],['返回列表','meeting-home']],context:'会议日程、预约和收藏',tab:'我的'},
      {name:'会议资料',steps:[['会议详情','meeting-detail'],['录音转记','meeting-detail','transcript'],['边际变化','meeting-detail','change']],context:'当前会议纪要、转写和回放',tab:'我的'},
      {name:'侧边栏切换',steps:[['我的参会','meeting-home'],['全部会议','meeting-all'],['录音上传','meeting-upload']],context:'会议抽屉和对象筛选',tab:'我的'}
    ]
  },
  files:{
    title:'文件资料 Flow',
    flows:[
      {name:'文件查看',steps:[['文件夹','files-home'],['点击文件','file-view'],['返回文件夹','files-home']],context:'当前文件夹 / 文件',tab:'我的'},
      {name:'文件提问',steps:[['文件详情','file-view'],['底部提问','file-view'],['抽屉内继续提问','file-view']],context:'当前文件内容 + 聊天记录',tab:'我的'}
    ]
  },
  automation:{
    title:'自动任务 Flow',
    flows:[
      {name:'任务配置',steps:[['自动任务','automation-home'],['任务详情','automation-task-detail'],['执行记录','automation-task-detail','records']],context:'当前任务',tab:'我的'},
      {name:'执行结果',steps:[['执行记录','automation-task-detail','records'],['任务结果','automation-run-detail'],['返回任务详情','automation-task-detail']],context:'单次执行结果',tab:'我的'}
    ]
  },
  tools:{
    title:'工具市场 Flow',
    flows:[
      {name:'能力浏览',steps:[['工具市场','tools-home'],['技能','tools-home','skills'],['专家','tools-home','experts'],['连接器','tools-home','connectors']],context:'当前工具类型',tab:'我的'},
      {name:'市场搜索',steps:[['工具市场','tools-home'],['搜索','tools-search'],['返回工具市场','tools-home']],context:'工具市场搜索词 / 搜索标的',tab:'我的'},
      {name:'Panel 切换',steps:[['工具市场','tools-home'],['我的连接器','tools-home','connectors'],['官方推荐','tools-home','connectors']],context:'工具对象来源范围',tab:'我的'}
    ]
  },
  mine:{
    title:'我的 Flow',
    flows:[
      {name:'瓷片入口',steps:[['我的','mine'],['编辑瓷片区','menu-edit'],['返回我的','mine']],context:'个人模块配置',tab:'我的'},
      {name:'账号设置',steps:[['我的','mine'],['设置','settings'],['返回我的','mine']],context:'账号和系统设置',tab:'我的'}
    ]
  },
  other:{
    title:'通用 Flow',
    flows:[
      {name:'通知中心',steps:[['任意页面','notification-center'],['查看通知','notification-center'],['返回来源页','mine']],context:'通知来源上下文',tab:'保持来源'}
    ]
  }
};

const ACTIONS = {
  voice:{title:'语音',icon:'mic'},
  newChat:{title:'新建对话',icon:'plus'},
  projectAdd:{title:'添加项目内容',icon:'plus',action:'toggle-project-actions'},
  notify:{title:'通知',icon:'bell',page:'notification-center'},
  star:{title:'收藏',icon:'star'},
  search:{title:'搜索',icon:'search'},
  toolSearch:{title:'搜索',icon:'search',page:'tools-search'},
  settings:{title:'设置',icon:'settings'},
  more:{title:'更多',icon:'more-horizontal'},
  newTask:{title:'新建任务',icon:'plus'},
  upload:{title:'上传',icon:'upload',action:'files-upload'},
  newFolder:{title:'新建文件夹',icon:'folder-plus',action:'files-new-folder'},
  filesMenu:{title:'更多',icon:'more-horizontal',action:'files-menu'},
  runAgain:{title:'再次执行',icon:'rotate-cw'},
  runNow:{title:'立即执行',icon:'play'},
  add:{title:'新建',icon:'plus'}
};
const MARKET_TABS = ['自选','热议','市场','持仓'];
const MARKET_PAGES = {自选:'home-watch',热议:'home-hot',市场:'home-market',持仓:'home-portfolio'};
const MARKET_SUB_TABS = ['全球','A股','港股','美股','基金','银行理财','黄金','商品','货币','外汇','宏观'];
const TOOL_TABS = {skills:'技能',experts:'专家',connectors:'连接器'};
const AUTOMATION_TABS = {scheduled:'定时任务',reminders:'提醒任务'};
const TASK_TABS = {intro:'任务说明',records:'执行记录'};
const WORK_TABS = {dynamic:'动态',group:'群聊',files:'文件'};

// ── 会议模块：数据模型 ──
const M_M_TODAY='2026-10-07';
const M_CATS=['业绩发布','宏观研究','策略研究','金融工程','行业研究','公司研究','财经节目','产品发布','债券研究','产品介推','商品研究','网络资源'];
const M_INDS=['宏观','股票','电子','半导体','通信','计算机','电力设备','有色金属','煤炭','机械','医药生物','食品饮料','量化','利率债','信用债','商品期货','基金','金融科技','海外','科技','综合'];
const M_MEETS=[
  ['m1','招商证券 | 宏观周周谈：流动性退潮回涌','招商证券','宏观周周谈','2026-10-07','20:00','21:00','宏观研究',['宏观'],'live',true],
  ['m2','华金策略 | 聚焦一刻：A股节后和10月展望','华金证券','聚焦一刻','2026-10-07','20:00','21:00','策略研究',['股票'],'live',true],
  ['m3','听首席说——中信建投期货周度商品策略会','中信建投期货','听首席说','2026-10-07','20:00','21:00','商品研究',['商品期货'],'live',true],
  ['m4','方正证券 | 2026年10月十大金股电话会议','方正证券','方正证券','2026-10-07','21:00','22:00','行业研究',['股票'],'upcoming',true],
  ['m5','中金公司 | 三季报前瞻：电子与半导体','中金公司','中金公司','2026-10-08','20:00','21:00','行业研究',['电子','半导体'],'upcoming',true],
  ['m6','宁德时代 | 2026年三季度业绩说明会','宁德时代','上证路演','2026-10-09','15:00','16:00','业绩发布',['电力设备'],'upcoming',true],
  ['m7','华泰金工 | 因子拥挤度与10月风格切换','华泰证券','华泰金工','2026-10-09','19:30','20:30','金融工程',['量化'],'upcoming',true],
  ['m8','中信固收 | 四季度利率债展望','中信证券','中信固收','2026-10-09','20:00','21:00','债券研究',['利率债'],'upcoming',true],
  ['m9','广发医药 | 创新药出海专题闭门会','广发证券','广发医药','2026-10-10','10:00','11:00','公司研究',['医药生物'],'upcoming',false],
  ['m10','Wind | Alice Market 新功能发布会','Wind','Wind','2026-10-11','14:00','15:00','产品发布',['金融科技'],'upcoming',true],
  ['m11','财经夜读 | 节后资金流向复盘','财经频道','财经夜读','2026-10-10','21:00','21:40','财经节目',['综合'],'upcoming',true],
  ['m12','易方达基金 | 科创50ETF联接产品介绍','易方达基金','易方达基金','2026-10-11','15:00','16:00','产品介推',['基金'],'upcoming',true],
  ['m13','陆家嘴财经早餐 26年10月7日','财经频道','陆家嘴财经早餐','2026-10-07','07:30','07:50','财经节目',['其他'],'ended',true],
  ['m14','兴业策略 | 节后第一课：A股四季度配置','兴业证券','兴业策略','2026-10-06','20:00','21:00','策略研究',['股票'],'ended',true],
  ['m15','长江电子 | AI 算力链 9月跟踪','长江证券','长江电子','2026-10-06','19:00','20:00','行业研究',['电子','通信'],'ended',true],
  ['m16','Meta Connect 2026','网络公开','Meta','2026-10-04','01:00','02:30','网络资源',['海外','科技'],'ended',true],
  ['m17','美联储主席新闻发布会（中文同传）','网络公开','美联储','2026-10-03','02:30','03:30','网络资源',['海外','宏观'],'ended',true],
  ['m18','某有色上市公司 2026 半年度业绩说明会','上证路演','上证路演','2026-10-06','15:00','16:00','业绩发布',['有色金属'],'ended',true]
];
const M_MEETINGS=M_MEETS.map(r=>({id:r[0],title:r[1],org:r[2],col:r[3],date:r[4],start:r[5],end:r[6],cat:r[7],inds:r[8],status:r[9],perm:!!r[10]}));
const mById=id=>M_MEETINGS.find(m=>m.id===id);
let M_RES=new Set(['m1','m5','m6']);
let M_FAVS=new Set(['m2','m7','m16']);
let M_AI=[
  {id:'a1',mid:'m8',title:'中信固收 | 四季度利率债展望',platform:'平台会议',date:'2026-10-09',start:'20:00',end:'21:00',status:'scheduled'},
  {id:'a2',title:'万得AI选股能力查询',platform:'腾讯会议',date:'2026-10-08',start:'10:00',end:'11:00',status:'scheduled'},
  {id:'a3',title:'智能参会_20261007_2010',platform:'腾讯会议',date:'2026-10-07',start:'20:10',end:'21:10',status:'running'},
  {id:'a4',title:'机构客户季度复盘会',platform:'腾讯会议',date:'2026-10-06',start:'14:00',end:'15:10',status:'done'}
];
let M_UP=[
  {id:'u1',title:'Wind模块精讲【AI】Alice Market',file:'Wind模块精讲【AI】Alice Market.mp3',size:'48.6 MB',dur:'45:00',date:'2026-10-06',start:'16:20',status:'done'},
  {id:'u2',title:'投研晨会_1007',file:'投研晨会_1007.m4a',size:'31.2 MB',dur:'28:14',date:'2026-10-07',start:'09:40',status:'processing',pct:62},
  {id:'u3',title:'海外策略电话会',file:'海外策略电话会.wav',size:'126.4 MB',dur:'58:32',date:'2026-10-05',start:'18:30',status:'failed',error:'音频文件损坏，无法完成声纹识别'}
];
const MEETING_DETAIL_VARIANTS={
  'platform-upcoming':{source:'platform',id:'m5',label:'未开始'},
  'platform-restricted':{source:'platform',id:'m9',label:'需申请权限'},
  'platform-live':{source:'platform',id:'m1',label:'直播中'},
  'platform-ended':{source:'platform',id:'m13',label:'已结束'},
  'ai-scheduled':{source:'ai',id:'a2',label:'待参会'},
  'ai-running':{source:'ai',id:'a3',label:'听会中'},
  'ai-done':{source:'ai',id:'a4',label:'纪要已生成'},
  'upload-processing':{source:'upload',id:'u2',label:'转写中'},
  'upload-done':{source:'upload',id:'u1',label:'纪要已生成'},
  'upload-failed':{source:'upload',id:'u3',label:'处理失败'}
};
// 会议模块筛选状态
let mtStatus='all', mtInd='all', mtTime='all', meetCat='宏观研究';
let skStatus='all', skSrc='all', skTime='all';
let mnSrc='all', mnTime='all';
let fvStatus='all', fvTime='all';
let meetPinned=new Set(['宏观研究','策略研究']);
let calOpen=false, calFor='mtTime', calStart='', calEnd='', calQuick='', calScrollTop=0, currentMeet=null, meetingFrom='meeting-schedule';
let meetingFilterOpen=false, meetingFilterKey='', meetingFilterDraft='all';
let meetingDetailVariant='platform-upcoming';
let currentMeetingDetailItem=null;

const WATCH_STOCK_ROWS = [
  ['昊华科技','600378.SH','47.57','+3.98%',true,'up'],
  ['云南锗业','002428.SZ','92','+5.64%',true,'up'],
  ['星网锐捷','002396.SZ','38.14','+3.05%',true,'up'],
  ['顺络电子','002138.SZ','48.94','+10% ',true,'jump'],
  ['风华高科','000636.SZ','50.45','+4.21%',true,'up'],
  ['双环传动','002472.SZ','37.62','-1.13%',false,'flat'],
  ['新洁能','605111.SH','55.15','+2.21%',true,'up'],
  ['士兰微','600460.SH','30.96','+2.04%',true,'up'],
  ['甘咨询','000779.SZ','10.33','-2.55%',false,'down'],
  ['寒武纪','688256.SH','1328.00','-3.54%',false,'down'],
  ['海光信息','688041.SH','215.68','-3.85%',false,'down'],
  ['中科曙光','603019.SH','83.52','-1.09%',false,'flat'],
  ['科大讯飞','002230.SZ','54.36','+0.05%',true,'flat'],
  ['天岳先进','688234.SH','69.30','-4.23%',false,'down'],
  ['兴森科技','002436.SZ','19.88','+2.16%',true,'up'],
  ['景旺电子','603228.SH','47.26','+0.68%',true,'up'],
  ['深南电路','002916.SZ','168.40','+1.92%',true,'up'],
  ['贵州茅台','600519.SH','1476.80','+1.86%',true,'up'],
  ['复星医药','600196.SH','28.62','+2.69%',true,'jump'],
  ['泰格医药','300347.SZ','59.88','+3.42%',true,'up'],
  ['中国中免','601888.SH','74.15','+1.00%',true,'up'],
  ['腾讯控股','00700.HK','658.50','-0.26%',false,'flat']
];
const MARKET_INDEX_ROWS = [
  ['万得全A','6,457.30','+69.20','+1.08%'],
  ['上证指数','3,932.70','+2.58','+0.07%'],
  ['深证成指','13,774.91','+257.94','+1.91%']
];
const MARKET_HEAT_ROWS = [
  ['光模块(CPO)指数','7.23%',true,'big'],['电路板指数','6.34%',true,''],['光通信指数','6.23%',true,''],
  ['光电路交换机(OCS)指数','6.84%',true,''],['光芯片指数','5.60%',true,''],['金融科技指数','-2.01%',false,'big'],
  ['保险精选指数','-2.45%',false,''],['炒股软件指数','-2.45%',false,''],['黄金珠宝指数','-2.31%',false,''],['煤炭开采精选指数','-2.31%',false,'']
];
const MARKET_SECTOR_ROWS = [
  ['光模块(CPO)指数','光模块板块逆势走强，主力聚焦高速光模块核心标的。','1869.62亿','+7.23%'],
  ['光电路交换机(OCS)指数','资金结构分化凸显，中线仍看好光模块技术迭代。','1087.51亿','+6.84%'],
  ['覆铜板指数','AI高端材料稀缺性提升，上游材料配置价值强化。','412.48亿','+6.72%']
];
const HOT_ITEMS = [
  ['GLM-5.3上架Amazon Bedrock，智谱与AWS开启收入分成','10月6日，亚马逊云科技旗下大模型服务平台Amazon Bedrock宣布接入智谱GLM-5.3，AWS将基于模型调用量与智谱进行收入分成。此举标志着智谱在海外市场打开收入分成通道。除AWS外，智谱近期已与多家海外云厂商落地类似分成模式；国内方面，智谱已与阿里云百炼平台等头部云厂商签署分成协议，华为云已上架GLM-5.3并达成类似合作意向，由此形成贯通国内外的分成体系。该模式将模型调用量直接转化为分成收入，为智谱拓展了新的商业化路径。',[['人工智能指数','-1.01%',false],['寒武纪','-3.54%',false],['海光信息','-3.85%',false],['中科曙光','-1.09%',false]]],
  ['DeepSeek开源昇腾基础组件，国产算力生态建设提速','DeepSeek正式开源面向华为昇腾算力平台的基础设施组件，涵盖TileLang高级语言编译工具、计算库、分布式通信库，与此前面向英伟达平台的开源组件一一对应。DeepSeek训练中使用的每一个TileLang算子在昇腾上均有对应的高性能实现。双方共同推进基于昇腾950的128卡超节点方案，满足超低时延推理和大规模训练需求。此次开源从工具链和核心库层面为昇腾硬件铺设软件通路，系统性降低CUDA生态迁移成本，提升国产算力应用能力。',[['DeepSeek指数','-0.78%',false],['杰华特','-7.75%',false],['寒武纪','-3.54%',false],['科大讯飞','+0.05%',true]]],
  ['碳化硅产业链供需紧平衡确立，衬底涨价并向全链条蔓延','碳化硅行业正经历从产能出清到供需紧平衡的范式转换，上游衬底、外延到下游芯片器件及设备环节头部厂商均已满产。海外巨头英飞凌、安森美上调AI电源业务指引，国内头部厂商AI相关业务增长近1.5倍，叠加800V高压平台在新能源汽车领域规模化放量，预计明年行业需求翻倍增长。衬底环节已出现实质性涨价，外延及设备环节启动提价程序，瀚天天成获得近1亿美元大额订单且要求年内交付。上游新建产能审批趋严、核心设备交付周期拉长，结构性短缺有望在2025年进一步加剧。二季度以来，新洁能、天岳先进、天科合达及晶盛机电等龙头业绩环比显著增长，碳化硅热沉产业化进程超预期，Coherent等国际大厂已送样验证。',[['SST指数','-0.34%',false],['天岳先进','-4.23%',false],['新洁能','-3.78%',false],['晶盛机电','-6.25%',false]]],
  ['算力需求持续爆发！PCB供应链缺口难补，产业链涨价周期开启','自2025年下半年以来，AI服务器与高速网络需求快速增长，导致PCB、IC载板及核心材料供应全面趋紧。短缺从低CTE玻璃纤维布、HVLP4铜箔等先进材料蔓延至CCL、高阶PCB、ABF载板及制程设备。截至2026年第二季度，供应仍维持紧绌状态，部分中低阶材料出现涨价。新产能预计2027-2029年陆续上线，但客户认证与良率爬坡需时，短期内难以填补缺口，PCB供应链紧绌状态预计持续至2027年。2026年上半年台湾PCB材料产业生产总值达新台币2716亿元，年增38.6%；设备产业生产总值达新台币460.8亿元，年增27.8%。',[['覆铜板指数','-3.34%',false],['景旺电子','+0.68%',true],['奥士康','+1.34%',true],['金禄电子','-8.40%',false]]],
  ['10月普通电子布再提价，供需缺口延续至28年上半年','10月5日，国内龙头再度落地普通电子布提价，G75电子纱上调3000元/吨至25800-26000元/吨，7628布上调1.5元/米至13-13.3元/米，涨幅与9月持平。织布机与后处理设备硬约束叠加纱端扩产不足，缺口明确且紧缺有望延续至28年上半年，普通布量价仍是PCB链弹性最大的兑现主线。三季报与后续细纱薄布汇总将进一步验证盈利上修。关注中国巨石、中材科技、国际复材（普通电子布份额与涨价弹性最大），宏和科技、生益科技、铜冠铜箔、联瑞新材（载板及CCL链条传导受益）。',[['电子布指数','-2.14%',false],['中国巨石','-0.71%',false],['中材科技','-1.20%',false],['国际复材','-2.71%',false]]],
  ['复星医药等间接布局光遗传学赛道，诺奖催化研发关注','2026年诺贝尔生理学或医学奖授予光遗传学三位奠基者，引发市场对该技术赛道关注。国内方面，星明优健、健达九州、中眸医疗等医药创业公司在光遗传学领域已有深度布局；复星医药、海特生物、昭衍新药、三博脑科等上市公司通过直接或间接投资上述创业公司，提前切入该赛道。此次诺奖授予标志着光遗传学技术获得国际学术界最高认可，有望提升行业研发热度与产业化预期，相关提前布局的上市公司在基因治疗、眼科疾病等应用领域的战略卡位受到关注。',[['基因检测指数','+2.20%',true],['复星医药','+2.69%',true],['海特生物','+2.45%',true],['昭衍新药','+10.00%',true]]],
  ['白酒双节动销下滑超15%，次高端承压行业加速分化','中秋国庆双节期间，白酒终端动销同比下滑超15%，剔除库存转移效应后实际消费萎缩幅度更大。需求端核心矛盾从场景约束转向消费意愿与能力双重衰退，商务宴请与高端礼赠场景显著收缩，300-800元次高端价格带成为重灾区。茅台飞天批价稳定在1730元附近，五粮液通过控量挺价策略批价企稳于770元上方，国窖1573因坚持高价位策略导致份额流失。茅台1935在600-700元价位带确立主导地位，与800元价格带的五粮液、国窖形成双寡头结构。地产酒中今世缘凭借大众价位带刚性需求稳住基本盘，迎驾贡酒通过To C营销加速向300元以上高端价位带升级，洋河面临中高端单品缺乏场景支撑的困境。行业已进入淘汰赛阶段，具备渠道利润保护能力、品牌护城河深厚且库存健康的企业将获得结构性机会。',[['白酒指数','+2.77%',true],['贵州茅台','+1.86%',true],['五 粮 液','+1.88%',true],['今世缘','+3.54%',true]]],
  ['AI眼镜向显示交互演进，高折射镜片材料壁垒构筑结构性机会','AI眼镜行业正从音频交互向显示交互演进，当前非显示类产品仍占九成以上份额，行业处于0-1渗透初期。HUD解决方案引入使光学组件成为核心体验载体，针对近视人群的处方定制需求成为大众化普及的关键瓶颈。高折射率材料如M2174等高端树脂供应授权受限，国内仅康耐特等少数厂商获得授权，形成显著进入壁垒。海外市场中Meta预计2025年Ray-Ban Meta系列出货量突破700万台，核心供应商依视路深度受益；国内康耐特与明月镜片分别绑定全球科技巨头与国内头部互联网企业。康耐特作为国内首家拥有专用AI镜片生产线的代工厂，2026年上半年相关业务实现爆发式增长。传统眼镜11亿双年销量基数提供巨大替换空间，掌握高折射材料集成能力、具备波导匹配技术的头部企业将获取超额收益。',[['AI穿戴设备指数','-0.89%',false],['旗天科技','-4.48%',false],['明月镜片','-1.09%',false],['欧菲光','+0.15%',true]]],
  ['抗IL-15抗体白癜风Ib期数据公布，F-VASI50应答率42%','10月5日，抗IL-15抗体白癜风Ib期24周概念验证数据公布，单次皮下注射后血清游离IL-15降至定量限以下，抑制效果维持80-90天，支持季度给药方案。疗效方面，面部VASI改善50%（F-VASI50）应答率达42%，F-VASI75应答率21%，与口服JAK抑制剂乌帕替尼二期数据相当，且在给药便利性与安全性上形成差异化优势；75%患者感知到面部皮肤改善。药物半衰期38天，400天随访显示停药后IL-15水平反弹未伴随不良事件。二期试验将采用无缝设计开展剂量范围探索，入组标准与行业主流三期研究一致。该靶点机制与斑秃、特应性皮炎及乳糜泻相关，乳糜泻IIa期顶线数据预计下半年公布。',[['创新药指数','+3.42%',true],['泰格医药','+3.42%',true],['药明康德','+4.16%',true],['康龙化成','+4.63%',true]]],
  ['港股AI Agent与互联网标的估值重构，腾讯Hunyuan多轨布局领先','当前港股市场南向资金参与度较低，流动性承压，但AI Agent领域正从概念验证迈向基础设施交付。腾讯凭借Hunyuan AI 2.0及微信生态协同，在代码生成、视频转化及云原生游戏开发中确立多轨布局优势，通过开放系统权限与支付集成构建高粘性个人生产力护城河。网龙通过合资公司切入AI驱动的短剧标准化制作，设定激进业绩对赌目标；CFG科技作为大模型基础设施交付代表，估值锚点从纯概念向场景工程交付能力转移。汇量科技新一代AI基础设施发布，标志从IAA向高价值IAP业务转型，D28产品对SLG和RPG品类的解锁预计2026年带来实质利润释放。赤子城科技上调全年业绩指引，Sugo与TOP产品月环比强劲增长。快手Kelin 4.0大模型将视频生成时长扩展至2分钟，直接契合短剧商业化需求。',[['腾讯平台指数','-0.26%',false],['科大讯飞','+0.05%',true],['昆仑万维','-2.12%',false],['中科曙光','-1.09%',false]]],
  ['国庆前三天海南离岛免税销售增8.85%，客流回升带动龙头Q4利润弹性','10月1-3日，海南离岛免税购物金额3.58亿元，同比增长8.85%，购物人次同比增长12.90%，件数同比增长8.02%。人次增速显著快于金额增速，显示客流回流与转化效率提升，旺季修复斜率明显好于暑期个位数平台。量增主导下，叠加口岸机场业务回正与毛利率持续改善，龙头渠道价值与利润弹性有望在Q4进一步兑现。中国中免凭借海南市场主导地位及毛利率修复弹性，上海机场、白云机场受益于口岸免税增量贡献，王府井具备免税牌照协同潜力。',[['免税店指数','+0.70%',true],['中国中免','+1.00%',true],['上海机场','+0.89%',true],['白云机场','+1.97%',true]]]
];
const PORTFOLIO_ROWS = [
  ['宁德时代','300股','¥54,750','+8.2%',true],
  ['比亚迪','120股','¥32,208','+3.1%',true],
  ['贵州茅台','20股','¥35,040','-1.8%',false],
  ['招商银行','500股','¥19,060','-0.3%',false]
];
const CHAT_DRAWER_GROUPS = [
  ['收藏对话',['茅台近5年ROE变化分析','半导体板块异动原因']],
  ['最近对话',['A股消费因子回测','新能源车渗透率研报','公募Q3持仓对比']]
];
const MINE_TILES = [
  ['会议','日程、纪要、待办','calendar-days','meeting-home'],
  ['文件资料','文件夹与资料库','folder-open','files-home'],
  ['自动任务','定时与提醒任务','alarm-clock','automation-home'],
  ['工具市场','技能、专家、连接器','wrench','tools-home'],
  ['编辑瓷片区','配置常用入口','sliders-horizontal','menu-edit']
];
const MINE_ROWS = ['充值/加油包','记忆管理','微信Claw Bot','API密钥'];
const LINK_ROWS = [['👨‍💼','我的专家'],['🏠','我的主页']];
const FILE_DRAWER_GROUPS = [['常用文件夹',['信用债合规资料','市场热议素材库','客户路演资料']]];
const TOOL_DRAWER_GROUPS = [['技能',['我的技能','官方推荐']],['专家',['我的专家','官方推荐']],['连接器',['我的连接器','官方推荐']]];
const TASK_DRAWER_ITEMS = ['每日市场早报','持仓汇总分析','个股到价提醒'];
const MINE_DRAWER_ITEMS = ['🔧 工具','📁 文件','⚡ 自动任务'];
const LINK_DRAWER_ITEMS = ['我的专家','我的主页','服务记录'];
const WORK_CHAT_DRAWER_ITEMS = ['💬 任务启动讨论','💬 数据验证与核对','💬 优先级调整确认','💬 复核债券处理'];
const WORK_DRAWER_PROJECTS = [
  {name:'信用债合规筛查',chats:['任务启动讨论','数据验证与核对','优先级调整确认']},
  {name:'Q3持仓归因分析',chats:['归因口径确认','行情数据拉取']},
  {name:'A股消费因子回测',chats:['回测结果讨论','报告生成']},
  {name:'半导体板块舆情汇总',chats:['素材收集','摘要确认']}
];
const MINE_FOLDER_ROWS = [['本地文件夹','12 项'],['云端文件夹','8 项']];
const NOTIFICATION_TABS = {
  interaction:'互动通知',
  task:'任务通知',
  system:'系统通知'
};
const NOTIFICATION_ITEMS = [
  {type:'interaction',status:'unread',title:'Alice 已完成「板块轮动强度趋势分析」',time:'刚刚'},
  {type:'interaction',status:'unread',title:'张先生发送了新消息',time:'10:24'},
  {type:'interaction',status:'read',title:'「ETF专题路演」会议纪要已生成',time:'昨天'},
  {type:'task',status:'unread',title:'贵州茅台到价提醒已触发',time:'10:12'},
  {type:'task',status:'read',title:'2026-09-09 每日持仓更新 & 3W3C工作计划',time:'9/9'},
  {type:'task',status:'read',title:'「信用债合规筛查」项目运行完成',time:'9/8'},
  {type:'system',status:'unread',title:'积分余额不足，请及时充值',time:'09:42'},
  {type:'system',status:'read',title:'9月服务工坊活动已上线',time:'昨天'},
  {type:'system',status:'read',title:'连接器授权即将过期',time:'9/12'}
];
const MINE_AUTOMATION_ROWS = {
  scheduled:[['每日市场早报','运行中'],['持仓汇总分析','已启用'],['周度行业复盘','每周五']],
  reminders:[['个股到价提醒','已开启'],['指数涨幅提醒','已开启'],['项目截止提醒','明天']]
};
const SETTINGS_GROUPS = [
  ['账号设置','账号安全'],
  ['通用设置','通知设置','授权信息'],
  ['隐私政策','服务协议','个人信息收集清单','第三方信息共享清单','关于','帮助与反馈',['版本号','v26.09.01']],
  [['退出登录','logout-row'],['- 注销账号 -','delete-row']]
];
const STOCK_QUOTE_CELLS = [['总市值','268.4亿'],['换手率','4.12%'],['量比','1.48'],['市盈率','32.6'],['主力净流入','2.18亿','up'],['所属板块','光模块']];
const STOCK_RELATED_ROWS = [
  ['异动原因','光模块板块走强，资金聚焦高速光模块核心标的。','强势'],
  ['Alice 提醒','短线涨幅较高，关注成交额能否持续放大。','关注']
];

function actions(...keys){return keys.map(k=>typeof k==='string'?ACTIONS[k]:k)}
function speechAction(){return {title:speechMuted?'静音':'播音',icon:speechMuted?'volume-x':'volume-2',action:'toggle-speech'}}
function state(lbl,items){return {lbl,items}}
function stateItems(map,sk){return Object.entries(map).map(([sv,t])=>({t,sk,sv}))}
function drawerState(){return state('抽屉',[{t:'关闭',sk:'drawer',sv:'close'},{t:'打开',sk:'drawer',sv:'open'}])}
function kbState(){return state('键盘状态',[{t:'键盘收起',sk:'kb',sv:'hidden'},{t:'键盘弹出',sk:'kb',sv:'show'}])}
function marketMainState(){return state('市场主 Tab',MARKET_TABS.map(t=>({t,pg:MARKET_PAGES[t]})))}
function embeddedChatState(){return state('嵌入式对话详情',embeddedChatStateItems())}
function chatTargetState(){return state('对话对象',[{t:'Alice',sk:'chatTarget',sv:'alice'},{t:'金融专家数字人',sk:'chatTarget',sv:'expert'}])}
function aliceMenuState(){return state('Alice 选单',[{t:'收起',sk:'alice',sv:'close'},{t:'展开',sk:'alice',sv:'open'}])}
function filesMenuState(){return state('更多菜单',[{t:'收起',sk:'filesMenu',sv:'close'},{t:'展开',sk:'filesMenu',sv:'open'}])}
function tabState(lbl,map,sk){return state(lbl,stateItems(map,sk))}
function pageBase(o){return Object.assign({drawer:null,states:[],sec:false,ibar:false,tbar:true},o)}
function marketPage(homeActive, ihint, chatScope, content, extraStates=[]){
  return pageBase({level:1,navType:'1-A',tba:'home',nav:'home',homeTabs:MARKET_TABS,homeActive,ihint,embeddedChat:()=>marketEmbeddedChat(typeof chatScope==='function'?chatScope():chatScope),content,
    states:[marketMainState(),...extraStates,embeddedChatState()]});
}
function detailPage(o){return pageBase(Object.assign({level:3,navType:'3-A',nav:'back'},o))}
function drawerConfig(title,body,action){return action?{title,action,body}:{title,body}}
function chatDrawer(full=false, withAction=false){return drawerConfig('聊天',()=>chatDrawerBody(full),withAction?{label:'+ 新建对话',action:'new-chat'}:undefined)}
const PAGES = {

'login':pageBase({level:0,navType:'none',tba:null,hideInput:true,tbar:false,loginChrome:true,
  content(){return `
    <div class="login-screen">
      <div class="login-logo">✦</div>
      <div class="login-brand">万得 AI</div>
      <div class="login-subtitle">开启智能对话新体验</div>

      <div class="login-phone-row">
        <div class="login-phone-number">135****4790</div>
        <button class="login-switch" type="button">更换</button>
      </div>

      <button class="login-primary" type="button">本机号码一键登录</button>

      <div class="login-divider"><span>其他登录方式</span></div>

      <div class="login-methods">
        <button class="login-method" type="button">
          <i data-lucide="lock-keyhole"></i>
          <span>密码</span>
        </button>
        <button class="login-method" type="button">
          <i data-lucide="smartphone"></i>
          <span>验证码</span>
        </button>
        <button class="login-method wechat" type="button" data-action="wc-login" data-wc="wechat">
          <i data-lucide="message-circle"></i>
          <span>微信登录</span>
        </button>
      </div>

      <label class="login-agreement">
        <span class="login-check"></span>
        <span>我已阅读并同意<b>《中国移动认证服务条款》</b>和<b>用户协议、隐私协议</b>并使用本机号码登录</span>
      </label>
    </div>
  `},
  drawer:null,
  states:[state('登录页面',[{t:'登录页面',pg:'login'}])]
}),

'home-watch':marketPage('自选','问 Alice 自选行情…','自选行情',()=>`
  <div class="stock-head"><span>名称</span><span>两日图</span><span>最新价 ↓</span><span>涨跌幅 ↓</span></div>
  <div class="stock-list">${WATCH_STOCK_ROWS.map(r=>stockRow(...r)).join('')}</div>
`),

'home-market':marketPage('市场','问 Alice 市场行情…',()=>`${marketTab}市场`,()=>`
  ${marketSubTabs()}
  <div class="idx-grid">${MARKET_INDEX_ROWS.map(r=>indexCard(...r)).join('')}</div>
  <div class="market-line">
    <div class="market-line-title">上证指数走势</div>
    <svg class="line-svg" viewBox="0 0 320 118" preserveAspectRatio="none">
      <path d="M0 58 H320" stroke="#DDE3EE" stroke-width="1"/>
      <path d="M0 20 H320 M0 92 H320 M80 0 V118 M210 0 V118" stroke="#EEF1F6" stroke-width="1"/>
      <path d="M3 28 L8 18 L14 46 L20 31 L26 66 L34 72 L43 41 L52 50 L61 88 L70 74 L80 80 L92 72 L104 66 L116 76 L128 83 L140 104 L154 92 L166 98 L178 94 L190 74 L202 88 L214 76 L226 45 L238 39 L250 43 L262 58 L274 66 L286 59 L298 52 L310 55 L317 53" fill="none" stroke="#5B84F1" stroke-width="2.2"/>
      <circle cx="317" cy="53" r="3.5" fill="#5B84F1"/>
    </svg>
  </div>
  <div class="mstats"><span>沪深成交额：<strong>1.96万亿</strong></span><span>预测：<strong>1.96万亿</strong></span><span>减868.13亿</span></div>
  <div class="heat">${MARKET_HEAT_ROWS.map(r=>heatTile(...r)).join('')}</div>
  <div class="shd">热门板块</div>
  <div class="sector-list">${MARKET_SECTOR_ROWS.map(r=>sectorRow(...r)).join('')}</div>
`,[state('市场子 Tab',MARKET_SUB_TABS.map(t=>({t,sk:'marketTab',sv:t})))]),

'home-hot':marketPage('热议','问 Alice 热议事件…','热议事件',()=>HOT_ITEMS.map((r,i)=>hotItem(i+1,...r)).join('')),

'home-portfolio':marketPage('持仓','问 Alice 持仓情况…','持仓情况',()=>`
  <div class="ph"><div class="phl">总市值</div><div class="phv">¥ 328,540.00</div><div class="phs">今日盈亏 +4,820.00（+1.49%）</div></div>
  <div class="shd">持仓明细</div>
  ${PORTFOLIO_ROWS.map(r=>sr(...r)).join('')}
`),

'chat-main':{level:1,navType:'1-B-1',tba:'chat',nav:'chat-main',title:'Alice',titleNext:true,navActions:()=>[speechAction(),ACTIONS.notify],ibar:true,ihint:'输入任务或对话…',tbar:true,sec:false,
  content(){return `
    <div class="cg-wrap">
      <div class="cg-greeting">
        <div class="cg-logo">✦</div>
        <div>
          <div class="cg-title">你好，我是 Alice</div>
          <div class="cg-sub">${chatTarget==='alice'?'今天有什么可以帮你？':'金融专家为您服务'}</div>
        </div>
      </div>
      <section class="chat-home-section">
        <div class="chat-section-head">
          <h2 class="chat-section-title">今日热搜</h2>
        </div>
        <div class="chat-trending-scroll">
          ${CHAT_TRENDING_ITEMS.map(chatTrendingCard).join('')}
        </div>
      </section>
      <section class="chat-home-section">
        <div class="chat-section-head">
          <h2 class="chat-section-title">精选案例</h2>
          <button class="chat-refresh" type="button"><i data-lucide="refresh-cw"></i>换一批</button>
        </div>
        <div class="chat-case-list">
          ${CHAT_FEATURED_CASES.map(chatFeaturedCard).join('')}
        </div>
      </section>
    </div>
  `},
  drawer:chatDrawer(true,true),
  states:[chatTargetState(),drawerState(),aliceMenuState(),kbState()]
},

'chat-detail':{level:1,navType:'1-C1',tba:'chat',nav:'title',title:'茅台ROE变化分析',navActions:()=>[speechAction(),ACTIONS.notify],ibar:true,ihint:'继续提问…',tbar:true,sec:false,
  content(){return `
    <div class="bubble-area">
      <div class="brow a"><div class="bava">✦</div><div class="bbody"><div class="bubble">已为您整理贵州茅台近5年ROE变化趋势，以下是核心数据：</div></div></div>
      <div class="brow a" style="margin-top:-8px"><div style="width:30px;flex-shrink:0"></div><div class="bbody">
        <div class="bubble" style="background:#F8F9FB;font-size:12px;color:#374151;line-height:1.8">
          2020：31.2%<br>2021：33.5%（+2.3pp）<br>2022：30.1%（-3.4pp）<br>2023：34.8%（+4.7pp）<br>2024E：36.2%（预测）
        </div>
        <div class="btime">10:14</div>
      </div></div>
      <div class="brow u"><div class="bbody"><div class="bubble">能给出具体的投资建议吗？</div><div class="btime">10:15</div></div></div>
      <div class="brow a"><div class="bava">✦</div><div class="bbody">
        <div class="bubble">基于ROE趋势分析，贵州茅台整体盈利能力稳健，2024年预测ROE创近5年新高。建议关注：①高端白酒需求韧性；②渠道改革进展；③PB估值历史分位（当前约7.2x，处于中位偏高）。</div>
        <div class="btime">10:15</div>
      </div></div>
    </div>
  `},
  drawer:chatDrawer(false,true),
  states:[drawerState(),kbState()]
},

'work-dashboard':{level:1,navType:'1-B-2',tba:'work',nav:'title',title:'项目列表',titleNext:false,navActions:actions('notify'),ibar:false,tbar:true,sec:false,
  content(){return `
    <div class="shd">项目</div>
    ${workProjectCards()}
  `},
  drawer:drawerConfig('项目',workDrawerBody,'+ 新建项目'),
  states:[drawerState()]
},

'work-detail':{level:2,navType:'2-A-1',tba:'work',nav:'title',title:()=>currentProject,projectSwitch:true,navActions:actions('projectAdd','notify'),ibar:false,tbar:true,sec:true,secTabs:WORK_TABS,
  content(){
    if(workTab==='dynamic') return `
      <div class="shd">最新动态</div>
      <div class="act-item"><div class="act-hd"><span class="act-ico">🤖</span><span class="act-who">Alice</span><span class="act-time">10:32</span></div><div class="act-body">已完成第3批债券扫描，发现2支需人工复核，结果已写入文件。</div></div>
      <div class="act-item"><div class="act-hd"><span class="act-ico">⚙</span><span class="act-who">系统</span><span class="act-time">10:18</span></div><div class="act-body">任务进度更新：142/380（37.4%），预计剩余时间 28 分钟。</div></div>
      <div class="act-item"><div class="act-hd"><span class="act-ico">👤</span><span class="act-who">张伟</span><span class="act-time">09:45</span></div><div class="act-body">已批准启动任务，优先处理 AA+ 以上评级标的。</div></div>
      <div class="act-item"><div class="act-hd"><span class="act-ico">🤖</span><span class="act-who">Alice</span><span class="act-time">09:40</span></div><div class="act-body">任务已启动，共识别380支目标债券，已加载合规规则集 v2.3。</div></div>
    `;
    if(workTab==='group') return `
      <div class="shd">项目群聊</div>
      <div class="grp-list">
        ${groupCard('优先级调整确认','Alice：已更新扫描优先级，AA+及以上标的将在第一批次完成。','10:35','张伟、Alice、固收组','2')}
        ${groupCard('数据验证与核对','李娜：第三批行情数据已经回填，等待合规规则复跑。','10:18','李娜、Alice、数据组','')}
        ${groupCard('任务启动讨论','张伟：优先处理 AA+ 以上评级标的。','09:45','张伟、王磊、Alice','')}
        ${groupCard('复核债券处理','Alice：2支需人工复核债券已单独标记。','昨天','法务、固收组、Alice','')}
      </div>
    `;
    return `
      <div class="shd">项目文件</div>
      <div class="fi"><div class="fi-ico">📊</div><div><div class="fi-n">合规扫描结果_v3.xlsx</div><div class="fi-s">2.4 MB · 今天 10:32</div></div><div class="fi-a">›</div></div>
      <div class="fi"><div class="fi-ico">📄</div><div><div class="fi-n">合规规则集_v2.3.pdf</div><div class="fi-s">1.1 MB · 昨天</div></div><div class="fi-a">›</div></div>
      <div class="fi"><div class="fi-ico">📋</div><div><div class="fi-n">任务说明书.docx</div><div class="fi-s">340 KB · 3天前</div></div><div class="fi-a">›</div></div>
    `;
  },
  drawer:drawerConfig('项目',workDrawerBody,'+ 新建项目'),
  states:[tabState('次级 Tab',WORK_TABS,'workTab'),drawerState()]
},

'work-group-chat':{level:3,navType:'3-A',tba:'work',nav:'back',title:()=>projectChatIsNew?'新建对话':'优先级调整确认',backPage:'work-detail',navActions:actions('voice','newChat','notify'),ibar:true,ihint:'输入消息…',tbar:true,sec:false,
  content(){return `
    ${projectChatIsNew?`<div class="project-chat-empty"><div class="cg-logo">✦</div><div class="cg-title">开始项目对话</div><div class="cg-sub">围绕「${currentProject}」发起新的讨论</div></div>`:`
    <div class="bubble-area">
      <div class="brow a"><div class="bava" style="font-size:12px">张</div><div class="bbody"><div class="bubble">优先处理AA+以上，有问题随时在这里告诉我</div><div class="btime">09:45</div></div></div>
      <div class="brow a"><div class="bava">✦</div><div class="bbody"><div class="bubble">收到，已更新扫描优先级，AA+及以上标的将在第一批次完成。</div><div class="btime">09:46</div></div></div>
      <div class="brow u"><div class="bbody"><div class="bubble">这批标的中有没有涉及城投的？</div><div class="btime">10:02</div></div></div>
      <div class="brow a"><div class="bava">✦</div><div class="bbody"><div class="bubble">有，共发现17支城投相关债券，已单独标记，建议重点关注条款第4条的表述差异。</div><div class="btime">10:03</div></div></div>
    </div>`}
  `},
  drawer:drawerConfig('信用债合规筛查',workChatDrawerBody),
  states:[drawerState(),kbState()]
},

'mine':{level:1,navType:'1-A',tba:'mine',nav:'mine',homeTabs:['我的'],homeActive:'我的',navActions:actions('settings','notify'),ibar:false,tbar:true,sec:false,
  content(){return `
    <div class="mine-info">
      <div class="mine-profile">
        <div class="mine-avatar">张</div>
        <div>
          <div class="mine-name">张伟</div>
        </div>
        <span class="mrow-chev" style="margin-left:auto">›</span>
      </div>
      <div class="mine-points">
        <div><div class="mine-points-l">剩余积分</div></div>
        <div class="mine-points-v">8,260</div>
      </div>
    </div>
    <div class="tile-grid">${MINE_TILES.map(r=>tileCard(...r)).join('')}</div>
    <div class="mgrp">${plainRows(MINE_ROWS)}</div>
  `},
  drawer:drawerConfig('功能',drawerItems(MINE_DRAWER_ITEMS)),
  states:[state('我的主 Tab',[{t:'我的',pg:'mine'}]),drawerState()]
},

'my-link':{level:1,navType:'1-A',tba:'link',nav:'mine',homeTabs:['拓客服务','服务记录'],homeActive:'拓客服务',navActions:actions('settings','notify'),ibar:false,tbar:true,sec:false,
  content(){return `
    <div class="mhero"><div class="mava">🔗</div><div><div class="mname">我的 Link</div><div class="msub">对外主页、数字人和服务记录</div></div></div>
    <div class="mgrp">${chevronRows(LINK_ROWS)}</div>
  `},
  drawer:drawerConfig('Link',drawerItems(LINK_DRAWER_ITEMS)),
  states:[state('拓客服务主 Tab',[{t:'拓客服务',pg:'my-link'}])]
},

'meeting-home':{level:1,navType:'1-B-2',tba:'mine',nav:'meeting',title(){return meetCat},navActions:actions('notify'),ibar:false,tbar:true,sec:false,
  content(){return meetingPlatformHtml()},
  get drawer(){return meetingDrawer()},
  states:[meetingStates(),drawerState()]
},

'meeting-schedule':{level:1,navType:'1-B-2',tba:'mine',nav:'meeting',title:'我的日程',navActions:actions('notify'),ibar:false,tbar:true,sec:false,
  content(){return meetingScheduleHtml()},
  get drawer(){return meetingDrawer()},
  states:[meetingStates(),drawerState()]
},

'meeting-minutes':{level:1,navType:'1-B-2',tba:'mine',nav:'meeting',title:'我的纪要',navActions:actions('notify'),ibar:false,tbar:true,sec:false,
  content(){return meetingMinutesHtml()},
  get drawer(){return meetingDrawer()},
  states:[meetingStates(),drawerState()]
},

'meeting-favs':{level:1,navType:'1-B-2',tba:'mine',nav:'meeting',title:'我的收藏',navActions:actions('notify'),ibar:false,tbar:true,sec:false,
  content(){return meetingFavsHtml()},
  get drawer(){return meetingDrawer()},
  states:[meetingStates(),drawerState()]
},

'meeting-detail':detailPage({tba:'mine',nav:'meeting-detail',backPage:()=>meetingFrom,navActions:actions('notify'),ibar:true,ihint:'向会议专家追问…',tbar:true,sec:false,
  title(){return meetingDetailContext().title},
  content(){return meetingDetailHtml()},
  get drawer(){return meetingDrawer()},
  states:[meetingPlatformDetailStates(),meetingAiDetailStates(),meetingUploadDetailStates()]
}),

'files-home':{level:1,navType:'1-B-2',tba:'mine',nav:'files',title:'文件夹',navActions:actions('upload','newFolder','filesMenu'),ibar:false,tbar:true,sec:false,
  content(){return filesHomeHtml()},
  drawer:drawerConfig('文件夹',fileDrawerBody,'+ 新建文件夹'),
  states:[drawerState(),filesMenuState()]
},

'file-view':detailPage({tba:'mine',title:'板块轮动强度趋势.png',backPage:'files-home',navActions:actions('star','more'),ibar:true,ihint:'向 Alice 提问这个文件…',tbar:false,embeddedChat:documentEmbeddedChat,
  content(){return `
    <div class="fv-content">
      <img class="fv-img" alt="板块轮动强度趋势" src="assets/sector_rotation_intensity_trend.png"/>
    </div>
  `},
  drawer:null,
  states:[embeddedChatState()]
}),

'automation-home':{level:1,navType:'1-D',tba:'mine',nav:'automation',title:'自动任务',navActions:actions('newTask','notify'),ibar:false,tbar:true,sec:true,secTabs:AUTOMATION_TABS,tabState:'automationTab',
  content(){return automationTab==='scheduled'?scheduledCardsHtml():reminderCardsHtml()},
  drawer:drawerConfig('自动任务',automationDrawerBody,'+ 新建任务'),
  states:[tabState('子 Tab',AUTOMATION_TABS,'automationTab'),drawerState()]
},

'automation-task-detail':{level:2,navType:'2-A-1',tba:'mine',nav:'task',title:'每日市场早报',titleNext:true,navActions:actions('runNow','notify'),ibar:false,tbar:true,sec:true,secTabs:TASK_TABS,tabState:'taskTab',
  content(){return taskTab==='intro'?`
    <div class="td-form">
      <div class="td-field">
        <div class="td-label">任务名称</div>
        <input class="td-input" value="每日市场早报汇总"/>
      </div>
      <div class="td-field">
        <div class="td-label">任务内容 <span class="hint">输入 / 可选技能</span></div>
        <div class="td-textarea-wrap">
          <textarea class="td-textarea">每日开盘前整合隔夜海外市场、宏观数据、重要公告和今日关注事项，输出早报摘要与机会提示。</textarea>
          <div class="td-counter">52 / 2000</div>
        </div>
      </div>
      <div class="td-field">
        <div class="td-label">频次</div>
        <select class="td-select"><option>每天</option><option>工作日</option><option>每周</option></select>
      </div>
      <div class="td-field">
        <div class="td-label">执行时间</div>
        <input class="td-input" type="time" value="08:30"/>
      </div>
    </div>
    <div class="td-actions">
      <div class="td-btn">保存修改</div>
      <div class="td-btn primary">立即执行</div>
    </div>
  `:runHistoryCardsHtml()},
  drawer:drawerConfig('自动任务',automationDrawerBody,'+ 新建任务'),
  states:[tabState('子 Tab',TASK_TABS,'taskTab'),drawerState()]
},

'automation-run-detail':detailPage({tba:'mine',title(){const run=getCurrentRun();return `${run.date} ${run.title}`},backPage:'automation-task-detail',navActions:actions('runAgain','notify'),ibar:true,ihint:'向 Alice 提问这次执行…',
  content(){return `
    <div class="exec-thread">
      ${renderExecRun(getCurrentRun(),true)}
    </div>
  `},
  drawer:null,
}),

'tools-home':{level:1,navType:'1-D',tba:'mine',nav:'tools',title:'工具市场',navActions:actions('toolSearch','notify'),ibar:false,tbar:true,sec:true,secTabs:TOOL_TABS,tabState:'toolTab',
  content(){return PAGES['mine-tools'].content()},
  drawer:drawerConfig('工具市场',toolDrawerGroups()),
  states:[tabState('子 Tab',TOOL_TABS,'toolTab'),drawerState()]
},

'tools-search':pageBase({level:4,navType:'4-B',tba:'mine',nav:'tools-search',backPage:'tools-home',hideInput:true,tbar:true,
  content(){return toolSearchResultsHtml()},
  drawer:null,
  states:[state('搜索页',[{t:'返回工具市场',pg:'tools-home'}])]
}),

'mine-files':detailPage({tba:'mine',title:'文件夹',backPage:'mine',navAction:'新建文件夹',
  content(){return `
    <div class="shd">文件夹</div>
    ${l3Rows(MINE_FOLDER_ROWS)}
  `},
  drawer:null,
}),

'mine-automatic':detailPage({navType:'3-B',tba:'mine',title:'自动任务',backPage:'mine',navActions:actions('search','add'),sec:true,secTabs:AUTOMATION_TABS,tabState:'automationTab',
  content(){return `
    <div class="shd">${automationTab==='scheduled'?'定时任务':'提醒任务'}</div>
    ${l3Rows(MINE_AUTOMATION_ROWS[automationTab])}
  `},
  drawer:null,
  states:[tabState('子 Tab',AUTOMATION_TABS,'automationTab')]
}),

'mine-tools':detailPage({navType:'3-B',tba:'mine',title:'工具',backPage:'mine',navActions:actions('toolSearch'),sec:true,secTabs:TOOL_TABS,tabState:'toolTab',
  content(){return toolMarketCardsHtml()},
  drawer:null,
  states:[tabState('子 Tab',TOOL_TABS,'toolTab')]
}),

'notification-center':detailPage({tba:'mine',title:'消息通知',backPage:'mine',navActions:actions('settings'),
  content(){return notificationCenterHtml()},
  drawer:null,
}),

'settings':pageBase({level:4,navType:'4-A',tba:'mine',nav:'back',title:'设置',backPage:'mine',navActions:[],
  content(){return SETTINGS_GROUPS.map(settingsGroup).join('')},
  drawer:null,
}),

'stock-quote':detailPage({tba:'home',title:()=>`${currentStock.name} [${currentStock.code}]`,backPage:'home-watch',navActions:actions('star','search'),ihint:'问 Alice 这只证券…',embeddedChat:stockEmbeddedChat,
  content(){return `
    <div class="quote-hero">
      <div class="quote-price ${currentStock.up?'up':'dn'}">${currentStock.price}</div>
      <div class="quote-change ${currentStock.up?'up':'dn'}">${currentStock.chg}　成交额 42.6亿</div>
      <div class="quote-meta"><span>今开 45.92</span><span>最高 48.10</span><span>最低 45.60</span></div>
    </div>
    <div class="quote-grid">${quoteCells()}</div>
    <div class="quote-chart">
      <div class="quote-chart-title">分时走势</div>
      <svg viewBox="0 0 320 150" preserveAspectRatio="none">
        <path d="M0 75 H320 M0 30 H320 M0 120 H320" stroke="#EEF1F6" stroke-width="1"/>
        <path d="M4 92 L16 88 L28 96 L40 72 L52 76 L64 68 L76 82 L88 64 L100 58 L112 62 L124 50 L136 54 L148 46 L160 49 L172 40 L184 44 L196 35 L208 39 L220 31 L232 33 L244 26 L256 30 L268 24 L280 27 L292 21 L304 25 L316 22" fill="none" stroke="#EF1B2D" stroke-width="2.2"/>
        <path d="M4 92 L16 88 L28 96 L40 72 L52 76 L64 68 L76 82 L88 64 L100 58 L112 62 L124 50 L136 54 L148 46 L160 49 L172 40 L184 44 L196 35 L208 39 L220 31 L232 33 L244 26 L256 30 L268 24 L280 27 L292 21 L304 25 L316 22 L316 150 L4 150 Z" fill="rgba(239,27,45,.08)"/>
      </svg>
    </div>
    <div class="shd">相关信息</div>
    <div class="sector-list">${relatedRows()}</div>
  `},
  drawer:null,
  states:[embeddedChatState()]
}),

'menu-edit':pageBase({level:4,navType:'4-A',tba:'mine',nav:'back',title:'菜单编辑',backPage:'mine',navActions:[],tbar:false,
  content(){return `
    <div class="menu-edit-note">拖拽调整模块顺序。前 4 个会显示在底部 Tab，其余会进入“我的”的瓷片区。</div>
    <div class="menu-sort" id="menu-sort">
      ${MENU_ITEMS.map((name,i)=>menuSortItem(name,i)).join('')}
    </div>
  `},
  drawer:null,
}),

};

// ── Content helpers ──
function mc(tag,cat,txt,time){return`<div class="mc"><div class="mtag">${tag}</div><div class="mtitle">${txt}</div><div class="mmeta"><span>${cat}</span><span>${time}</span></div></div>`}
function l3Rows(rows){return`<div class="l3g">${rows.map(r=>`<div class="l3r"><span class="l3lbl">${r[0]}</span><span class="l3val">${r[1]}</span></div>`).join('')}</div>`}
function notificationCenterHtml(){
  const tabs=Object.entries(NOTIFICATION_TABS).map(([key,label])=>`<button class="notif-tab${notificationTab===key?' active':''}" type="button" data-notification-tab="${key}">${label}</button>`).join('');
  const items=NOTIFICATION_ITEMS.filter(item=>item.type===notificationTab);
  const rows=items.length?items.map(notificationRow).join(''):'<div class="notif-empty">暂无通知</div>';
  return`
    <div class="notif-page">
      <div class="notif-tabs">
        <div class="notif-tab-strip">${tabs}</div>
        <button class="notif-read-all" type="button" data-action="notifications-read-all">全部已读</button>
      </div>
      <div class="notif-list">${rows}</div>
    </div>
  `
}
function notificationRow(item){
  return`<div class="notif-row${item.status==='unread'?' unread':''}">
    <span class="notif-dot"></span>
    <span class="notif-title">${item.title}</span>
    <span class="notif-time">${item.time}</span>
  </div>`
}
function chevronRows(rows){return rows.map(r=>`<div class="mrow"><span class="mrow-ico">${r[0]}</span><span class="mrow-lbl">${r[1]}</span><span class="mrow-chev">›</span></div>`).join('')}
function plainRows(rows){return rows.map(r=>`<div class="mrow"><span class="mrow-lbl">${r}</span><span class="mrow-chev">›</span></div>`).join('')}
function settingsGroup(rows,i){return`<div class="mgrp"${i?' style="margin-top:8px"':''}>${rows.map(r=>Array.isArray(r)?(r[1]&&String(r[1]).includes('row')?`<div class="mrow ${r[1]}"><span>${r[0]}</span></div>`:`<div class="mrow"><span class="mrow-lbl">${r[0]}</span><span class="l3val">${r[1]}</span></div>`):`<div class="mrow"><span class="mrow-lbl">${r}</span><span class="mrow-chev">›</span></div>`).join('')}</div>`}
function drawerGroups(groups,attrs=''){return groups.map(([label,items])=>`<div class="dr-sl">${label}</div>${items.map(t=>`<div class="dr-it"${attrs}>${t}</div>`).join('')}`).join('')}
function drawerItems(items,attrs=''){return items.map(t=>`<div class="dr-it"${attrs}>${t}</div>`).join('')}
function toolDrawerGroups(){return TOOL_DRAWER_GROUPS.map(([label,items],i)=>`<div class="dr-sl">${label}</div>${items.map(t=>`<div class="dr-it" data-tool-tab="${Object.keys(TOOL_TABS)[i]}">${t}</div>`).join('')}`).join('')}
function quoteCells(){return STOCK_QUOTE_CELLS.map(([label,val,cls])=>`<div class="quote-cell"><div class="quote-label">${label}</div><div class="quote-val ${cls||''}">${val}</div></div>`).join('')}

// ── 会议模块：工具与渲染 ──
const mStLabel=s=>s==='live'?'直播中':s==='ended'?'已结束':'未开始';
const mStChip=s=>s==='live'?'<span class="mm-chip live">直播中</span>':s==='ended'?'<span class="mm-chip gray">已结束</span>':'<span class="mm-chip acc">未开始</span>';
const mDays=d=>Math.round((Date.parse(d)-Date.parse(M_M_TODAY))/864e5);
function mTimeOk(date,sel){
  if(sel==='all') return true;
  if(sel==='d3') return mDays(date)>=0&&mDays(date)<=2;
  if(sel==='d7') return mDays(date)>=0&&mDays(date)<=6;
  if(sel==='d30') return mDays(date)>=0&&mDays(date)<=29;
  if(sel.startsWith('range:')){
    const [,start,end]=sel.split(':');
    return date>=start&&date<=(end||start);
  }
  return date===sel;
}
const mDateShort=date=>date?`${Number(date.slice(5,7))}月${Number(date.slice(8))}日`:'';
const mTimeLabel=sel=>sel==='d3'?'近3天':sel==='d7'?'近7天':sel==='d30'?'近1个月':sel.startsWith('range:')?(()=>{
  const [,start,end]=sel.split(':');
  return start===end?mDateShort(start):`${mDateShort(start)}-${mDateShort(end)}`;
})():(sel.startsWith('20')?mDateShort(sel):sel==='all'?'时间':'');
function mFilterSelect(key,value,label,options,{calendar=false}={}){
  const selected=options.find(([v])=>v===value);
  const display=value==='all'?label:calendar?mTimeLabel(value):(selected?.[1]||label);
  return `<button type="button" class="mm-select-wrap${value!=='all'?' selected':''}" data-mfilter-open="${key}" aria-label="${label}：${display}" aria-haspopup="dialog">
    <span class="mm-select">${display}</span>
    <i data-lucide="chevron-down" aria-hidden="true"></i>
  </button>`;
}
const mStatusOptions=[['upcoming','未开始'],['live','直播中'],['ended','已结束']];
const mTimeOptions=[['d3','近3天'],['d7','近7天'],['d30','近1个月']];
const mIndustryOptions=M_INDS.map(i=>[i,i]);
const mSourceOptions=[['res','平台会议'],['ai','AI参会'],['up','上传录音']];
const mMinutesSourceOptions=[['replay','平台会议'],['ai','AI参会'],['up','上传录音']];
function meetingFilterValue(key){
  return {mtStatus,mtInd,mtTime,skStatus,skSrc,skTime,mnSrc,mnTime,fvStatus,fvTime}[key]??'all';
}
function meetingFilterConfig(key){
  const configs={
    mtStatus:{label:'状态',options:mStatusOptions},
    mtInd:{label:'行业',options:mIndustryOptions},
    mtTime:{label:'时间',options:mTimeOptions,calendar:true},
    skStatus:{label:'状态',options:mStatusOptions},
    skSrc:{label:'来源',options:mSourceOptions},
    skTime:{label:'时间',options:mTimeOptions,calendar:true},
    mnSrc:{label:'来源',options:mMinutesSourceOptions},
    mnTime:{label:'时间',options:mTimeOptions,calendar:true},
    fvStatus:{label:'状态',options:mStatusOptions},
    fvTime:{label:'时间',options:mTimeOptions,calendar:true}
  };
  return configs[key];
}
function renderMeetingFilterSheet(){
  const sheet=document.getElementById('meetingFilterSheet');
  const title=document.getElementById('meetingFilterTitle');
  const optionsEl=document.getElementById('meetingFilterOptions');
  if(!sheet||!title||!optionsEl) return;
  const cfg=meetingFilterConfig(meetingFilterKey);
  const visible=meetingFilterOpen&&page.startsWith('meeting')&&!!cfg&&!aiMeetingSheetOpen&&!calOpen;
  sheet.classList.toggle('open',visible);
  if(!cfg) return;
  title.textContent=cfg.label;
  const options=cfg.options;
  optionsEl.innerHTML=options.map(([value,text])=>`<button type="button" class="meeting-filter-option${meetingFilterDraft===value?' selected':''}" data-mact="pickfilter" data-arg="${value}">
    <span>${text}</span><i data-lucide="${meetingFilterDraft===value?'circle-check-big':'circle'}"></i>
  </button>`).join('');
}
function mMonthHtml(baseDate,offset){
  const first=new Date(baseDate.getFullYear(),baseDate.getMonth()+offset,1);
  const y=first.getFullYear(),m=first.getMonth()+1;
  const daysIn=new Date(y,m,0).getDate();
  const blanks=first.getDay();
  let days='';
  for(let i=0;i<blanks+daysIn;i++){
    const d=i-blanks+1;
    if(d<1){days+='<span class="mcal-day blank"></span>';continue}
    const date=`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isStart=date===calStart,isEnd=date===calEnd,isRange=calStart&&calEnd&&date>calStart&&date<calEnd;
    days+=`<button class="mcal-day${date===M_M_TODAY?' today':''}${isRange?' in-range':''}${isStart?' range-start':''}${isEnd?' range-end':''}" data-mact="pickday" data-arg="${date}" aria-label="${date}">${d}</button>`;
  }
  return `<section class="mcal-month" data-month="${y}-${String(m).padStart(2,'0')}">
    <h3>${y}年${m}月</h3>
    <div class="mcal-body">
      ${days}
    </div>
  </section>`;
}
function renderCalGrid(){
  const el=document.getElementById('mcalGrid');
  const range=document.getElementById('mcalRange');
  if(!el) return;
  const base=new Date(`${M_M_TODAY}T00:00:00`);
  el.innerHTML=`<div class="mcal-scroll">${Array.from({length:12},(_,i)=>mMonthHtml(base,i)).join('')}</div>`;
  const scroll=el.querySelector('.mcal-scroll');
  if(scroll) scroll.scrollTop=calScrollTop;
  if(range) range.innerHTML=`<div><span>起始时间</span><b>${calStart?mDateShort(calStart):'请选择'}</b></div><i data-lucide="arrow-right"></i><div><span>结束时间</span><b>${calEnd?mDateShort(calEnd):'请选择'}</b></div>`;
  document.querySelectorAll('[data-mact="pickquick"]').forEach(button=>button.classList.toggle('selected',button.dataset.arg===calQuick));
}
function mmCard(m){
  const live=m.status==='live';
  const status=!m.perm?'<span class="mm-chip warn">需权限</span>':mStChip(m.status);
  const acts=!m.perm?`<button class="mm-btn" data-mact="noperm">申请权限</button>`
    :live?`<button class="mm-btn pri" data-mact="open" data-id="${m.id}">进入直播</button>`
    :m.status==='ended'?`<button class="mm-btn" data-mact="open" data-id="${m.id}">查看纪要</button>`
    :`<button class="mm-btn${M_RES.has(m.id)?' gray':''}" data-mact="res" data-id="${m.id}">${M_RES.has(m.id)?'取消预约':'预约'}</button><button class="mm-btn" data-mact="ailisten" data-id="${m.id}">AI听会</button>`;
  return `<article class="mm-card" data-mact="open" data-id="${m.id}">
    <div class="mm-card-head">${status}<div class="mm-title">${escapeHtml(m.title)}</div></div>
    <div class="mm-card-meta"><span>${m.date} ${m.start}-${m.end}</span><span>${escapeHtml(m.org)}</span><span>${escapeHtml(m.cat)}</span></div>
    <div class="mm-card-foot">
      <div class="mm-acts">${acts}</div>
      <button class="mm-fav${M_FAVS.has(m.id)?' on':''}" type="button" data-mact="fav" data-id="${m.id}" aria-label="${M_FAVS.has(m.id)?'取消收藏':'收藏'}"><i data-lucide="star"></i><span>${M_FAVS.has(m.id)?'已收藏':'收藏'}</span></button>
    </div>
  </article>`;
}
function meetingDrawer(){
  const upcoming=M_MEETINGS.filter(m=>m.status!=='ended').slice(0,3);
  const recent=M_MEETINGS.filter(m=>m.status==='ended').slice(0,3);
  const cats=[...meetPinned,...M_CATS.filter(c=>!meetPinned.has(c))];
  const catIt=c=>panelObjectRow({type:'meeting-category',id:c,className:'dr-it mm-cat',attrs:`data-mact="cat" data-cat="${escapeAttr(c)}"`});
  const meetIt=m=>panelObjectRow({type:'meeting-event',id:m.id,label:m.title,className:'dr-it',attrs:`data-mact="open" data-id="${escapeAttr(m.id)}"`,prefix:m.status==='live'?'● ':''});
  return drawerConfig('会议',
    `<div class="dr-sl">我的参会</div>
     <div class="dr-it" data-page="meeting-schedule">我的日程</div>
     <div class="dr-it" data-page="meeting-minutes">我的纪要</div>
     <div class="dr-it" data-page="meeting-favs">我的收藏</div>
     <div class="dr-sl">即将开始</div>
     ${upcoming.map(meetIt).join('')}
     <div class="dr-sl">最近纪要</div>
     ${recent.map(meetIt).join('')}
     <div class="dr-sl">平台会议</div>
     ${cats.map(catIt).join('')}`
    ,{label:'+ 添加会议',action:'open-ai-meeting'});
}
function meetingStates(){
  return state('会议页面',[
    {t:'我的日程',pg:'meeting-schedule'},
    {t:'我的纪要',pg:'meeting-minutes'},
    {t:'我的收藏',pg:'meeting-favs'},
    {t:'平台会议',pg:'meeting-home'}
  ]);
}
function meetingPlatformDetailStates(){
  return state('平台会议',[
    {t:'未开始',sk:'meetingDetailVariant',sv:'platform-upcoming'},
    {t:'需申请权限',sk:'meetingDetailVariant',sv:'platform-restricted'},
    {t:'直播中',sk:'meetingDetailVariant',sv:'platform-live'},
    {t:'已结束',sk:'meetingDetailVariant',sv:'platform-ended'}
  ]);
}
function meetingAiDetailStates(){
  return state('AI参会',[
    {t:'待参会',sk:'meetingDetailVariant',sv:'ai-scheduled'},
    {t:'听会中',sk:'meetingDetailVariant',sv:'ai-running'},
    {t:'纪要已生成',sk:'meetingDetailVariant',sv:'ai-done'}
  ]);
}
function meetingUploadDetailStates(){
  return state('上传录音',[
    {t:'转写中',sk:'meetingDetailVariant',sv:'upload-processing'},
    {t:'纪要已生成',sk:'meetingDetailVariant',sv:'upload-done'},
    {t:'处理失败',sk:'meetingDetailVariant',sv:'upload-failed'}
  ]);
}
function mEmpty(txt){return `<div class="mm-empty">${txt}</div>`}
const mmFilter=(list,{ind,status})=>list.filter(m=>(!ind||ind==='all'||m.inds.includes(ind))&&(!status||status==='all'||m.status===status));
function meetingPlatformHtml(){
  const list=M_MEETINGS.filter(m=>m.cat===meetCat&&mTimeOk(m.date,mtTime)).filter(m=>mtStatus==='all'||m.status===mtStatus).filter(m=>mtInd==='all'||m.inds.includes(mtInd));
  return `<div class="mm-filter-grid">
      ${mFilterSelect('mtStatus',mtStatus,'状态',mStatusOptions)}
      ${mFilterSelect('mtInd',mtInd,'行业',mIndustryOptions)}
      ${mFilterSelect('mtTime',mtTime,'时间',mTimeOptions,{calendar:true})}
    </div>
    <div class="mm-list">${list.map(mmCard).join('')||mEmpty('没有符合条件的会议')}</div>`;
}
function meetingScheduleHtml(){
  const res=M_MEETINGS.filter(m=>M_RES.has(m.id));
  const ai=M_AI.filter(a=>a.status!=='done');
  const up=M_UP.filter(u=>u.status==='processing');
  const todayRes=res.filter(m=>m.date===M_M_TODAY).length;
  const todayAI=ai.filter(a=>a.date===M_M_TODAY).length;
  const todayNote=res.filter(m=>m.status==='ended'&&m.date===M_M_TODAY).length;
  const week=res.filter(m=>{const d=mDays(m.date);return d>0&&d<=7}).length;
  const stats=[['今日预约',todayRes],['今日 AI 参会',todayAI],['今日纪要',todayNote],['未来 7 日预约',week]];
  const statHtml=stats.map(([l,v])=>`<div class="mm-stat"><b>${v}</b><span>${l}</span></div>`).join('');
  let items=[
    ...res.map(m=>({kind:'res',m,key:m.id})),
    ...ai.map(a=>({kind:'ai',a,key:a.id})),
    ...up.map(u=>({kind:'up',u,key:u.id}))
  ];
  items=items.filter(it=>skStatus==='all'||(it.kind==='res'&&it.m.status===skStatus));
  items=items.filter(it=>{const d=it.kind==='res'?it.m.date:it.kind==='ai'?it.a.date:it.u.date;return mTimeOk(d,skTime)});
  items=items.filter(it=>skSrc==='all'||it.kind===skSrc);
  return `<div class="mm-stats">${statHtml}</div>
    <div class="mm-filter-grid">
      ${mFilterSelect('skStatus',skStatus,'状态',mStatusOptions)}
      ${mFilterSelect('skSrc',skSrc,'来源',mSourceOptions)}
      ${mFilterSelect('skTime',skTime,'时间',mTimeOptions,{calendar:true})}
    </div>
    <div class="mm-list">${items.map(it=>{
      if(it.kind==='res') return mmCard(it.m);
      if(it.kind==='ai') return `<article class="mm-card"><div class="mm-top"><div class="mm-title">🤖 ${escapeHtml(it.a.title)}</div>${it.a.status==='running'?'<span class="mm-chip live">听会中</span>':'<span class="mm-chip acc">AI参会</span>'}</div>
        <div class="mm-meta">${it.a.date} ${it.a.start}-${it.a.end} · ${it.a.platform}</div><div class="mm-acts"><button class="mm-btn" data-mact="openai" data-id="${it.a.id}">查看任务</button></div></article>`;
      return `<article class="mm-card"><div class="mm-top"><div class="mm-title">🎙 ${escapeHtml(it.u.title)}</div><span class="mm-chip warn">转写中 ${it.u.pct}%</span></div><div class="mm-meta">${it.u.date} ${it.u.start} · ${it.u.size}</div><div class="mm-acts"><button class="mm-btn" data-mact="openai" data-id="${it.u.id}">查看进度</button></div></article>`;
    }).join('')||mEmpty('暂无日程')}</div>`;
}
function meetingMinutesHtml(){
  const replay=M_MEETINGS.filter(m=>m.status==='ended').map(m=>({kind:'replay',m}));
  const ais=M_AI.filter(a=>a.status==='done').map(a=>({kind:'ai',m:a}));
  const ups=M_UP.filter(u=>u.status==='done').map(u=>({kind:'up',m:u}));
  const all=[...replay,...ais,...ups];
  let items=mnSrc==='replay'?replay:mnSrc==='ai'?ais:mnSrc==='up'?ups:all;
  items=items.filter(it=>{const d=it.m.date;return mTimeOk(d,mnTime)});
  return `<div class="mm-filter-grid two">
      ${mFilterSelect('mnSrc',mnSrc,'来源',mMinutesSourceOptions)}
      ${mFilterSelect('mnTime',mnTime,'时间',mTimeOptions,{calendar:true})}
    </div>
    <div class="mm-list">${items.map(it=>{
      const m=it.m;
      const title=it.kind==='replay'?m.title:it.kind==='ai'?'🤖 '+m.title:'🎙 '+m.title;
      const chip=it.kind==='ai'?'<span class="mm-chip ok">AI听会</span>':it.kind==='up'?'<span class="mm-chip warn">上传录音</span>':'';
      const meta=it.kind==='replay'?`${m.date} ${m.start||''} · ${m.org||''}`:it.kind==='ai'?`${m.date} ${m.start||''} · ${m.platform||''}`:`${m.date} ${m.start||''} · ${m.size||''}`;
      return `<article class="mm-card"><div class="mm-top"><div class="mm-title">${escapeHtml(title)}</div>${chip}</div>
      <div class="mm-meta">${escapeHtml(meta)}</div><div class="mm-acts">${it.kind==='replay'?`<button class="mm-btn" data-mact="open" data-id="${m.id}">查看纪要</button>`:'<button class="mm-btn" data-mact="openai" data-id="'+m.id+'">查看纪要</button>'}</div></article>`;
    }).join('')||mEmpty('暂无纪要')}</div>`;
}
function meetingFavsHtml(){
  const list=[...M_FAVS].map(mById).filter(m=>m&&(fvStatus==='all'||m.status===fvStatus)&&mTimeOk(m.date,fvTime));
  return `<div class="mm-filter-grid two">
      ${mFilterSelect('fvStatus',fvStatus,'状态',mStatusOptions)}
      ${mFilterSelect('fvTime',fvTime,'时间',mTimeOptions,{calendar:true})}
    </div>
    <div class="mm-list">${list.map(mmCard).join('')||mEmpty('还没有收藏的会议')}</div>`;
}
function meetingDetailContext(){
  const cfg=MEETING_DETAIL_VARIANTS[meetingDetailVariant]||MEETING_DETAIL_VARIANTS['platform-upcoming'];
  const prefix=cfg.source==='platform'?'m':cfg.source==='ai'?'a':'u';
  const current=currentMeetingDetailItem&&currentMeetingDetailItem.id?.startsWith(prefix)?currentMeetingDetailItem:null;
  const item=current||(cfg.source==='platform'?mById(cfg.id):cfg.source==='ai'?M_AI.find(x=>x.id===cfg.id):M_UP.find(x=>x.id===cfg.id));
  return {cfg,item,title:item?.title||'会议详情'};
}
function meetingDetailChip(label,cls){
  return `<span class="mm-chip ${cls}">${label}</span>`;
}
function meetingDetailSummary(){
  return `<div class="mm-dbox">
    <div class="mm-summary-line"><b>核心结论</b><span>盈利修复斜率弱于三季度，配置上以红利为底仓，成长方向优先关注订单与业绩能见度。</span></div>
    <div class="mm-summary-line"><b>市场判断</b><span>短期仍处在风格切换窗口，电子、通信和有色方向的景气度更明确。</span></div>
  </div>`;
}
function meetingActionItems(){
  return `<div class="mm-dbox mm-todos">
    <label><input type="checkbox"><span>核验会议中提到的核心经营数据</span></label>
    <label><input type="checkbox"><span>将重点结论同步到项目群聊</span></label>
    <label><input type="checkbox"><span>下周跟踪订单和价格变化</span></label>
  </div>`;
}
function meetingPlatformDetailHtml(m,cfg){
  const restricted=meetingDetailVariant==='platform-restricted'||!m.perm;
  const live=meetingDetailVariant==='platform-live'||m.status==='live';
  const ended=meetingDetailVariant==='platform-ended'||m.status==='ended';
  const status=restricted?meetingDetailChip('需权限','warn'):live?meetingDetailChip('直播中','live'):ended?meetingDetailChip('已结束','gray'):meetingDetailChip('未开始','acc');
  const acts=restricted
    ? '<button class="mm-btn pri" data-mact="noperm">申请权限</button>'
    :live
      ? '<button class="mm-btn pri">进入直播</button><button class="mm-btn">开启 AI 同听</button>'
      :ended
        ? '<button class="mm-btn pri">查看完整纪要</button><button class="mm-btn">播放回放</button>'
        : `<button class="mm-btn${M_RES.has(m.id)?' gray':''}" data-mact="res" data-id="${m.id}">${M_RES.has(m.id)?'取消预约':'预约'}</button><button class="mm-btn" data-mact="ailisten" data-id="${m.id}">AI听会</button>`;
  return `<div class="mm-detail">
    <div class="mm-detail-source"><i data-lucide="radio-tower"></i>平台会议</div>
    <div class="mm-dhead"><div class="mm-dtitle">${escapeHtml(m.title)}</div>${status}<button class="mm-star${M_FAVS.has(m.id)?' on':''}" data-mact="fav" data-id="${m.id}">${M_FAVS.has(m.id)?'★':'☆'}</button></div>
    <div class="mm-dmeta">${m.date} ${m.start}-${m.end} · ${escapeHtml(m.org)} · ${escapeHtml(m.cat)}</div>
    <div class="mm-tags">${m.inds.map(i=>`<span class="mm-tag">${i}</span>`).join('')}</div>
    <div class="mm-acts">${acts}</div>
    ${restricted?`<div class="shd">权限说明</div><div class="mm-dbox">本场会议仅面向受邀机构。提交申请后，主办方将审核您的机构身份并通过消息通知结果。</div>`:''}
    ${!restricted&&!live&&!ended?`<div class="shd">会议议程</div><div class="mm-dbox mm-agenda"><span>20:00　主持人开场</span><span>20:10　主题分享</span><span>20:45　投资者问答</span></div><div class="shd">主讲嘉宾</div><div class="mm-dbox">首席分析师 陈远 · ${escapeHtml(m.org)}</div>`:''}
    ${live?`<div class="shd">实时转写 ${meetingDetailChip('同步中','live')}</div><div class="mm-dbox"><div class="mm-spk">主持人：欢迎参加本次会议，今天首先讨论四季度市场的主要变量。</div><div class="mm-spk">分析师：增量资金当前主要集中在电子、通信和有色方向。</div></div><div class="shd">当前议题</div><div class="mm-dbox">行业景气验证与四季度配置节奏</div>`:''}
    ${ended?`<div class="shd">会议摘要</div>${meetingDetailSummary()}<div class="shd">会后待办</div>${meetingActionItems()}`:''}
  </div>`;
}
function meetingAiDetailHtml(a){
  const running=meetingDetailVariant==='ai-running';
  const done=meetingDetailVariant==='ai-done';
  const status=running?meetingDetailChip('听会中','live'):done?meetingDetailChip('纪要已生成','ok'):meetingDetailChip('待参会','acc');
  const acts=running
    ? '<button class="mm-btn pri">查看实时转写</button><button class="mm-btn">停止听会</button>'
    :done
      ? '<button class="mm-btn pri">查看完整纪要</button><button class="mm-btn">导出</button>'
      : '<button class="mm-btn pri">编辑任务</button><button class="mm-btn gray">取消 AI 参会</button>';
  return `<div class="mm-detail">
    <div class="mm-detail-source ai"><i data-lucide="bot"></i>AI参会</div>
    <div class="mm-dhead"><div class="mm-dtitle">${escapeHtml(a.title)}</div>${status}</div>
    <div class="mm-dmeta">${a.date} ${a.start}-${a.end} · ${escapeHtml(a.platform)}</div>
    <div class="mm-acts">${acts}</div>
    ${!running&&!done?`<div class="shd">参会任务</div><div class="mm-dbox mm-info-grid"><b>会议平台</b><span>${escapeHtml(a.platform)}</span><b>入会时间</b><span>${a.date} ${a.start}</span><b>任务目标</b><span>自动参会、转写并生成结构化纪要</span><b>完成通知</b><span>App 消息通知</span></div><div class="mm-detail-note"><i data-lucide="circle-check"></i>Alice 将在会议开始前 2 分钟尝试入会</div>`:''}
    ${running?`<div class="shd">AI 听会状态</div><div class="mm-dbox"><div class="mm-progress-head"><span>已听会 38 分钟</span><b>进行中</b></div><div class="mm-progress"><i style="width:58%"></i></div></div><div class="shd">实时转写</div><div class="mm-dbox"><div class="mm-spk">嘉宾：今年客户需求结构发生了明显变化，增量主要来自海外市场。</div><div class="mm-spk">Alice 标记：海外收入与毛利率变化值得会后重点核验。</div></div>`:''}
    ${done?`<div class="shd">AI 会议摘要</div>${meetingDetailSummary()}<div class="shd">Alice 提取的待办</div>${meetingActionItems()}<div class="shd">转写记录</div><div class="mm-dbox">共 68 分钟 · 12,486 字 · 已识别 4 位发言人</div>`:''}
  </div>`;
}
function meetingUploadDetailHtml(u){
  const failed=meetingDetailVariant==='upload-failed';
  const done=meetingDetailVariant==='upload-done';
  const status=failed?meetingDetailChip('处理失败','danger'):done?meetingDetailChip('纪要已生成','ok'):meetingDetailChip(`转写中 ${u.pct||0}%`,'warn');
  const acts=failed
    ? '<button class="mm-btn pri">重新处理</button><button class="mm-btn">更换文件</button>'
    :done
      ? '<button class="mm-btn pri">查看完整纪要</button><button class="mm-btn">播放录音</button>'
      : '<button class="mm-btn pri">查看转写进度</button><button class="mm-btn gray">取消处理</button>';
  return `<div class="mm-detail">
    <div class="mm-detail-source upload"><i data-lucide="audio-lines"></i>上传录音</div>
    <div class="mm-dhead"><div class="mm-dtitle">${escapeHtml(u.title)}</div>${status}</div>
    <div class="mm-dmeta">${u.date} ${u.start} · ${escapeHtml(u.file)} · ${u.size}</div>
    <div class="mm-acts">${acts}</div>
    ${!failed&&!done?`<div class="shd">处理进度</div><div class="mm-dbox"><div class="mm-progress-head"><span>正在识别发言人并生成章节</span><b>${u.pct||0}%</b></div><div class="mm-progress"><i style="width:${u.pct||0}%"></i></div><div class="mm-process-steps"><span class="done">上传完成</span><span class="done">音频转写</span><span>生成纪要</span></div></div><div class="shd">文件信息</div><div class="mm-dbox mm-info-grid"><b>音频时长</b><span>${u.dur}</span><b>文件大小</b><span>${u.size}</span><b>预计完成</b><span>约 8 分钟后</span></div>`:''}
    ${done?`<div class="shd">录音摘要</div>${meetingDetailSummary()}<div class="shd">提取的待办</div>${meetingActionItems()}<div class="shd">原始录音</div><div class="mm-dbox">${escapeHtml(u.file)} · ${u.dur} · 支持按转写段落定位播放</div>`:''}
    ${failed?`<div class="shd">失败原因</div><div class="mm-dbox mm-error-box"><b>${escapeHtml(u.error||'录音处理失败')}</b><span>建议检查文件是否完整，或转换为 MP3、M4A 格式后重新上传。</span></div><div class="shd">文件信息</div><div class="mm-dbox mm-info-grid"><b>文件名称</b><span>${escapeHtml(u.file)}</span><b>文件大小</b><span>${u.size}</span><b>上传时间</b><span>${u.date} ${u.start}</span></div>`:''}
  </div>`;
}
function meetingDetailHtml(){
  const {cfg,item}=meetingDetailContext();
  if(cfg.source==='ai') return meetingAiDetailHtml(item);
  if(cfg.source==='upload') return meetingUploadDetailHtml(item);
  return meetingPlatformDetailHtml(item,cfg);
}
function relatedRows(){return STOCK_RELATED_ROWS.map(([name,desc,tag])=>`<div class="sector-row"><div><div class="sector-name">${name}</div><div class="sector-desc">${desc}</div></div><div class="sector-num"></div><div class="sector-chg">${tag}</div></div>`).join('')}
function workProjectCards(){return WORK_PROJECTS.map((p,i)=>wc(p.name,'',p.meta,WORK_PROJECT_COLORS[i],'work-detail',p.name)).join('')}
function chatTrendingCard(item){
  const actions=[
    ['zap','快速解读'],
    ['list-tree','事件脉络'],
    ['target','影响标的']
  ];
  return`<article class="chat-trending-card" data-trending-prompt="${item.title}">
    <div class="chat-card-head">
      <div class="chat-trending-icon"><i data-lucide="${item.icon}"></i></div>
      <h3>${item.title}</h3>
      <span class="chat-trending-arrow">↘</span>
    </div>
    <p>${item.desc}</p>
    <div class="chat-quick-actions">${actions.map(([icon,label])=>`<button type="button" data-page="chat-detail"><i data-lucide="${icon}"></i>${label}</button>`).join('')}</div>
  </article>`
}
function chatFeaturedCard(item){
  return`<article class="chat-case-card" data-page="chat-detail">
    <div class="chat-card-head">
      <div class="chat-case-icon"><i data-lucide="${item.icon}"></i></div>
      <h3>${item.title}</h3>
      <i class="chat-card-arrow" data-lucide="arrow-right"></i>
    </div>
    <p>${item.desc}</p>
  </article>`
}
function hotItem(rank,title,desc,tags){
  return`<div class="hot-card"><div class="hot-head"><div class="hot-rank r${rank}">${rank}</div><div class="hot-title">${title}</div></div><div class="hot-desc">${desc}</div><div class="hot-tags">${tags.map(t=>`<span class="tag-chip">${t[0]} <span class="${t[2]?'up':'dn'}">${t[1]}</span></span>`).join('')}</div></div>`
}
function indexCard(name,price,amount,chg){
  return`<div class="idx-card"><div class="idx-name">${name}</div><div class="idx-main"><div><div class="idx-price">${price}</div><div class="idx-change">${amount}　${chg}</div></div>${sparkSvg('idx')}</div></div>`
}
function heatTile(name,val,up,size){
  return`<div class="heat-tile ${up?'pos':'neg'} ${size||''}"><div>${name}</div><div class="heat-val ${up?'up':'dn'}">${val}</div></div>`
}
function sectorRow(name,desc,amount,chg){
  return`<div class="sector-row"><div><div class="sector-name">${name}</div><div class="sector-desc">${desc}</div></div><div class="sector-num">${amount}</div><div class="sector-chg">${chg}</div></div>`
}
function marketSubTabs(){
  return`<div class="market-subtabs">${MARKET_SUB_TABS.map(t=>`<div class="market-subtab${t===marketTab?' active':''}" data-market-tab="${t}">${t}</div>`).join('')}</div>`
}
function stockRow(name,code,price,chg,up,shape){
  return`<div class="stock-row" data-page="stock-quote" data-stock="${code}"><div><div class="stock-name">${name}</div><div class="stock-code">${code}</div></div>${sparkSvg(shape,'mini-chart')}<div class="stock-price ${up?'up':'dn'}">${price}</div><div class="stock-change ${up?'up':'dn'}">${chg}</div></div>`
}
function sparkSvg(shape,cls='spark'){
  const paths={
    up:'M2 8 L8 17 L14 15 L20 21 L27 24 L34 23 L41 19 L48 17 L55 14 L62 13 L70 10 L78 11',
    down:'M2 8 L9 10 L16 9 L23 14 L30 12 L37 18 L44 17 L52 20 L60 21 L69 24 L78 23',
    flat:'M2 11 L10 12 L18 12 L26 13 L35 12 L44 13 L53 12 L62 14 L70 15 L78 14',
    jump:'M2 22 L18 22 L20 7 L36 7 L38 18 L52 18 L55 9 L78 9',
    idx:'M2 22 L10 14 L18 19 L26 12 L34 16 L42 15 L50 18 L58 12 L66 13 L74 10 L82 12 L94 11'
  };
  return`<svg class="${cls}" viewBox="0 0 96 32" preserveAspectRatio="none"><path d="${paths[shape]||paths.up}" fill="none" stroke="${shape==='down'||shape==='flat'?'#8BA3BE':'#EF1B2D'}" stroke-width="1.6"/><path d="${paths[shape]||paths.up} L96 32 L0 32 Z" fill="${shape==='down'||shape==='flat'?'rgba(16,152,116,.08)':'rgba(239,27,45,.08)'}"/></svg>`
}
function sr(n,code,p,chg,up){return`<div class="sr"><div class="sn"><div class="sm">${n}</div><div class="sc">${code}</div></div><div><div class="sv ${up?'up':'dn'}">${p}</div><div class="sg2 ${up?'up':'dn'}">${chg}</div></div></div>`}
function wc(t,st,m,col,pageTarget,projectName){
  const target=pageTarget?` data-page="${pageTarget}"`:'';
  const project=projectName?` data-project="${projectName}"`:'';
  return`<div class="wc" style="border-left-color:${col}"${target}${project}><div class="wst" style="color:${col}">${st}</div><div class="wt">${t}</div><div class="wm">${m}</div></div>`
}
function groupCard(title,msg,time,meta,badge){
  return`<div class="grp-card" data-page="work-group-chat" data-project-chat="existing"><div class="grp-ava"><i data-lucide="messages-square"></i></div><div class="grp-main"><div class="grp-top"><div class="grp-title">${title}</div><div class="grp-time">${time}</div></div><div class="grp-msg">${msg}</div><div class="grp-meta">${meta}</div></div>${badge?`<div class="grp-badge">${badge}</div>`:''}</div>`
}
function panelKey(type,id){return `${type}:${id}`}
function panelName(type,id,fallback=id){return panelRenames.get(panelKey(type,id))||fallback}
function panelIsPinned(type,id){
  return type==='meeting-category'?meetPinned.has(id):panelPinned.has(panelKey(type,id));
}
function panelOrdered(type,items,idOf=item=>item){
  return [...items].sort((a,b)=>Number(panelIsPinned(type,idOf(b)))-Number(panelIsPinned(type,idOf(a))));
}
function panelObjectRow({type,id,label=id,className='dr-it',attrs='',prefix=''}) {
  const key=panelKey(type,id);
  if(panelHidden.has(key)) return '';
  const name=panelName(type,id,label);
  const pinned=panelIsPinned(type,id);
  return `<div class="${className} panel-object${pinned?' is-pinned':''}" tabindex="0" role="button"
    data-panel-object data-panel-type="${escapeAttr(type)}" data-panel-id="${escapeAttr(id)}" data-panel-label="${escapeAttr(name)}"
    aria-label="${escapeAttr(name)}，长按或右键查看更多操作" title="长按或右键查看更多操作" ${attrs}>
    <span class="panel-object-name">${prefix}${escapeHtml(name)}</span>
    ${pinned?'<i class="panel-object-pin" data-lucide="pin" aria-label="已置顶"></i>':''}
  </div>`;
}
function chatDrawerBody(full=false){
  const conversations=CHAT_DRAWER_GROUPS.flatMap(([,items])=>items);
  if(full) conversations.push('信用债评级筛查');
  const section=(label,items)=>`<div class="dr-sl">${label}</div>${items.map(id=>panelObjectRow({type:'chat',id,className:'dr-it',attrs:'data-page="chat-detail"',prefix:'💬 '})).join('')}`;
  const favorites=conversations.filter(id=>chatFavorites.has(id));
  const recent=conversations.filter(id=>!chatFavorites.has(id));
  return section('收藏对话',favorites)+section('最近对话',recent);
}
function workDrawerBody(){
  return panelOrdered('project',WORK_DRAWER_PROJECTS,p=>p.name).map(project=>{
    if(panelHidden.has(panelKey('project',project.name))) return '';
    const projectRow=panelObjectRow({type:'project',id:project.name,className:'dr-project',attrs:`data-project="${escapeAttr(project.name)}" data-page="work-detail"`});
    const chats=panelOrdered('work-chat',project.chats,id=>`${project.name}/${id}`).map(chat=>panelObjectRow({
      type:'work-chat',id:`${project.name}/${chat}`,label:chat,className:'dr-conv',
      attrs:`data-project="${escapeAttr(project.name)}" data-page="work-group-chat"`
    })).join('');
    return projectRow+chats;
  }).join('');
}
function workChatDrawerBody(){
  return `<div class="dr-sl">群聊历史</div>${panelOrdered('work-chat',WORK_CHAT_DRAWER_ITEMS,id=>id.replace(/^💬 /,'')).map(raw=>{
    const id=raw.replace(/^💬 /,'');
    return panelObjectRow({type:'work-chat',id,label:id,className:'dr-it',prefix:'💬 '});
  }).join('')}`;
}
function fileDrawerBody(){
  return FILE_DRAWER_GROUPS.map(([label,items])=>`<div class="dr-sl">${label}</div>${panelOrdered('file-folder',items).map(id=>
    panelObjectRow({type:'file-folder',id,className:'dr-it',attrs:'data-page="mine-files"',prefix:'📁 '})
  ).join('')}`).join('');
}
function automationDrawerBody(){
  const group=(label,items)=>`<div class="dr-sl">${label}</div>${panelOrdered('automation',items,t=>t.title).map(t=>{
    const status=t.enabled?'运行中':'已停用';
    return panelObjectRow({type:'automation',id:t.title,className:'dr-it panel-automation',attrs:'data-page="automation-task-detail"',prefix:`<span class="panel-status ${t.enabled?'on':'off'}">${status}</span>`});
  }).join('')}`;
  return group('定时任务',AUTOMATION_SCHEDULED)+group('提醒任务',AUTOMATION_REMINDERS);
}
function projectMenu(){
  if(!projectMenuOpen) return '';
  const items=WORK_PROJECTS.map(p=>`<div class="project-option${p.name===currentProject?' active':''}" data-project="${p.name}"><span class="project-dot"></span><div class="project-option-main"><div class="project-option-title">${p.name}</div><div class="project-option-meta">${p.meta}</div></div></div>`).join('');
  return`<div class="project-menu">${items}</div>`;
}
function pr(ico,txt,pageTarget){
  const target=pageTarget?` data-page="${pageTarget}"`:'';
  return`<div class="prompt"${target}><span class="p-ico">${ico}</span><span class="p-txt">${txt}</span></div>`
}
function tileCard(title,desc,icon,page){
  const extra=title.includes('编辑')?' edit':'';
  return `<div class="tile-card${extra}" data-page="${page}"><div class="tile-top"><div class="tile-title">${title}</div><div class="tile-ico"><i data-lucide="${icon}"></i></div></div><div class="tile-desc">${desc}</div></div>`
}
function filesHomeHtml(){
  const items=[...FILE_ITEMS].sort((a,b)=>{
    if(filesSortBy==='title') return a.name.localeCompare(b.name,'zh-Hans-CN');
    if(filesSortBy==='type') return a.type.localeCompare(b.type);
    return b.sortTime-a.sortTime;
  });
  return `
    <div class="file-cards ${filesViewMode==='image'?'image':'list'}">
      ${items.map((item,i)=>fileCard(item,i)).join('')}
    </div>
  `
}
function fileCard(item,index){
  const icon=item.type==='folder'?'folder':item.type==='image'?'image':item.type==='sheet'?'table':'file-text';
  const target=item.type==='folder'?'mine-files':'file-view';
  return `<div class="file-card" data-page="${target}">
    ${filesSelectMode?`<div class="file-check${index===0?' selected':''}">${index===0?'✓':''}</div>`:''}
    <div class="file-ico"><i data-lucide="${icon}"></i></div>
    <div class="file-main">
      <div class="file-name">${item.name}</div>
      <div class="file-meta">${item.count} · ${item.time}</div>
      <div class="file-extra"><span class="file-pill">${fileTypeName(item.type)}</span></div>
    </div>
    ${filesViewMode==='list'?'<span class="mrow-chev">›</span>':''}
  </div>`
}
function fileTypeName(type){
  return type==='folder'?'文件夹':type==='image'?'图像':type==='sheet'?'表格':'文件';
}
function menuSortItem(name,index){
  const isTab=index<4;
  const badge=isTab?`底部 Tab ${index+1}`:'我的瓷片区';
  return `<div class="menu-sort-item" draggable="true" data-menu-index="${index}">
    <div class="menu-sort-handle"><i data-lucide="grip-vertical"></i></div>
    <div class="menu-sort-main"><div class="menu-sort-name">${name}</div><div class="menu-sort-desc">拖拽排序</div></div>
    <div class="menu-sort-badge${isTab?'':' tile'}">${badge}</div>
  </div>`
}

// ── Nav rendering ──
function renderStatusBar(p){
  const phone=document.getElementById('phone');
  const time=document.querySelector('#phone .sb-t');
  const icons=document.querySelector('#phone .sb-i');
  const isLogin=!!p.loginChrome;
  phone.classList.toggle('login-phone',isLogin);
  time.textContent=p.statusTime||'9:41';
  icons.innerHTML=p.statusHtml||'<i data-lucide="signal-high"></i><i data-lucide="wifi"></i><i data-lucide="battery-full"></i>';
}

function renderNav(p){
  const el=document.getElementById('tnav');
  el.classList.toggle('hidden',p.navType==='none');
  if(p.navType==='none'){
    el.innerHTML='';
    return;
  }
  const bell=`<div class="nbtn" title="通知" data-page="notification-center"><i data-lucide="bell"></i></div>`;
  const actionIcon = p.navAction && p.navAction.includes('新建') ? 'plus' : 'more-horizontal';
  const action = `<div class="nbtn" title="${p.navAction||'功能'}"><i data-lucide="${actionIcon}"></i></div>`;
  const navActions = typeof p.navActions === 'function' ? p.navActions() : p.navActions;
  const customActions = navActions
    ? navActions.map(a=>`<div class="nbtn" title="${a.title}" aria-label="${a.title}"${a.page?` data-page="${a.page}"`:''}${a.action?` data-action="${a.action}"`:''}><i data-lucide="${a.icon}"></i></div>`).join('')
    : '';
  const title = typeof p.title === 'function' ? p.title() : (p.title || '');
  const next = p.titleNext ? '<span class="nalice-a"> ›</span>' : '';
  const rightActions = customActions || `${action}${bell}`;
  const filesMenu = navActions && navActions.some(a=>a.action==='files-menu') ? filesMenuHtml() : '';
  const projectActionsMenu = navActions && navActions.some(a=>a.action==='toggle-project-actions') ? projectActionMenuHtml() : '';
  const meetingActionsMenu = navActions && navActions.some(a=>a.action==='toggle-meeting-actions') ? meetingActionMenuHtml() : '';

  if(p.navType==='1-A'){
    const tabs=p.homeTabs.map((t,i)=>`${i>0?'<div class="htab-sep"></div>':''}<div class="htab${t===p.homeActive?' active':''}" data-htab="${t}">${t}</div>`).join('');
    el.innerHTML=`<div class="htabs">${tabs}</div><div class="nrg">${customActions||`<div class="nbtn" title="搜索"><i data-lucide="search"></i></div>${bell}`}</div>`;
  } else if(p.navType==='1-B'||p.navType==='1-B-1'||p.navType==='1-B-2'||p.navType==='1-D'){
    const navTitle = p.nav==='chat-main' ? (chatTarget==='alice'?'Alice':'专家数字人') : title;
    const titleAction = p.nav==='chat-main' ? 'data-action="toggle-alice"' : '';
    el.innerHTML=`<div class="nbtn" data-action="open-drawer">=</div><div class="nctr"><div class="nalice" ${titleAction}><span class="nalice-n">${navTitle}</span>${next}</div></div><div class="nrg">${rightActions}</div>${filesMenu}${meetingActionsMenu}`;
  } else if(p.navType==='1-C1'){
    el.innerHTML=`<div class="nbtn" data-action="open-drawer">=</div><div class="nctr"><div class="ntitle">${title}</div></div><div class="nrg">${rightActions}</div>`;
  } else if(p.navType==='1-C2'){
    el.innerHTML=`<div class="nbtn" data-action="open-drawer">=</div><div class="nctr"><div class="nprj-ico" data-page="work-detail">${p.prefixAction||'返回项目'}</div><div class="ntitle">${title}</div></div><div class="nrg">${action}${bell}</div>`;
  } else if(p.navType==='2-A'||p.navType==='2-A-1'){
    const titleBlock = p.projectSwitch
      ? `<div class="project-title" data-action="toggle-project-menu"><div class="ntitle">${title}</div><i data-lucide="chevron-down"></i></div>`
      : p.titleNext
        ? `<div class="project-title"><div class="ntitle">${title}</div><i data-lucide="chevron-down"></i></div>`
        : `<div class="ntitle">${title}</div>`;
    el.innerHTML=`<div class="nbtn" data-action="open-drawer">=</div><div class="nctr">${titleBlock}</div>${p.projectSwitch?projectMenu():''}<div class="nrg">${rightActions}</div>${projectActionsMenu}`;
  } else if(p.navType==='4-B'){
    el.innerHTML=`<div class="nbtn back" data-backpage="${p.backPage}" data-action="go-back">‹</div><div class="nctr nav-search-center"><label class="nav-search-box"><input class="nav-search-input" data-tool-search-input value="${escapeAttr(toolSearchQuery)}" placeholder="搜索词、搜索标的" autofocus><button class="nav-search-clear" type="button" data-action="clear-tool-search">×</button></label></div><button class="nav-search-submit" data-action="submit-tool-search">搜索</button>`;
  } else if(p.navType==='3-A'||p.navType==='3-B'||p.navType==='4-A'){
    const actions = p.navActions ? customActions : `${action}${bell}`;
    const bp=typeof p.backPage==='function'?p.backPage():p.backPage;
    const backBtn=p.hideTopBack?'<div class="nbtn ghost"></div>':`<div class="nbtn back" data-backpage="${bp}" data-action="go-back">‹</div>`;
    el.innerHTML=`${backBtn}<div class="nctr"><div class="ntitle">${title}</div></div><div class="nrg">${actions}</div>`;
  }
}

// ── Files menu ──
function floatingActionMenu({maskAction,className='',groups=[]}){
  const groupHtml=groups.map(group=>{
    const label=group.label?`<div class="fm-label">${group.label}</div>`:'';
    const items=group.items.map(item=>`<div class="fm-item${item.active?' active':''}" data-action="${item.action}"><span>${item.label}</span>${item.icon?`<i data-lucide="${item.icon}"></i>`:''}</div>`).join('');
    return `<div class="fm-group">${label}${items}</div>`;
  }).join('');
  return `<div class="fm-mask" data-action="${maskAction}"></div><div class="files-menu${className?` ${className}`:''}">${groupHtml}</div>`;
}
function filesMenuHtml(){
  if(!filesMenuOpen) return '';
  const option=(label,active,action)=>({label,active,action,icon:active?'check':''});
  return floatingActionMenu({
    maskAction:'close-files-menu',
    groups:[
      {label:'操作',items:[option('选择',filesSelectMode,'files-select')]},
      {label:'展示方式',items:[
        option('列表',filesViewMode==='list','files-view-list'),
        option('图像',filesViewMode==='image','files-view-image')
      ]},
      {label:'排序方式',items:[
        option('标题',filesSortBy==='title','files-sort-title'),
        option('时间',filesSortBy==='time','files-sort-time'),
        option('类型',filesSortBy==='type','files-sort-type')
      ]}
    ]
  });
}

function projectActionMenuHtml(){
  if(!projectActionMenuOpen) return '';
  return floatingActionMenu({
    maskAction:'close-project-actions',
    className:'project-action-menu',
    groups:[{items:[
      {label:'新建对话',action:'project-new-chat',icon:'message-circle-plus'},
      {label:'添加文件',action:'project-add-file',icon:'file-plus-2'}
    ]}]
  });
}

function meetingActionMenuHtml(){
  if(!meetingActionMenuOpen) return '';
  return floatingActionMenu({
    maskAction:'close-meeting-actions',
    className:'meeting-action-menu',
    groups:[{items:[
      {label:'AI听会',action:'open-ai-meeting',icon:'bot'},
      {label:'上传录音',action:'upload-meeting-recording',icon:'audio-lines'}
    ]}]
  });
}

// ── Secondary nav ──
function renderSecNav(p){
  const sn=document.getElementById('snav');
  if(p.sec){
    sn.classList.remove('hidden');
    const map=p.secTabs||{dynamic:'动态',group:'群聊',files:'文件'};
    const active=p.tabState==='toolTab'?toolTab:p.tabState==='automationTab'?automationTab:p.tabState==='taskTab'?taskTab:p.tabState==='meetingDetailTab'?window.meetingV113DetailTab:workTab;
    sn.innerHTML=Object.entries(map).map(([key,label])=>`<div class="stab${key===active?' active':''}" data-stab="${key}">${label}</div>`).join('');
  } else {
    sn.classList.add('hidden');
    sn.innerHTML='';
  }
}

// ── Drawer ──
const PANEL_ACTIONS = {
  rename:{id:'rename',label:'重新命名',icon:'pencil'},
  pin:{id:'pin',icon:'pin'},
  favorite:{id:'favorite',icon:'star'},
  delete:{id:'ask-delete',icon:'trash-2',danger:true}
};
const PANEL_TYPES = {
  chat:{
    name:'对话',
    favoriteSet:chatFavorites,
    actions:menu=>[
      PANEL_ACTIONS.rename,
      {...PANEL_ACTIONS.favorite,label:chatFavorites.has(menu.id)?'取消收藏':'收藏对话'},
      {...PANEL_ACTIONS.delete,label:'删除对话'}
    ]
  },
  project:{name:'项目'},
  'work-chat':{name:'群聊'},
  'meeting-category':{
    name:'会议分类',
    actions:menu=>[{...PANEL_ACTIONS.pin,label:panelIsPinned(menu.type,menu.id)?'取消置顶':'置顶'}]
  },
  'meeting-event':{
    name:'会议',
    favoriteSet:M_FAVS,
    actions:menu=>[{...PANEL_ACTIONS.favorite,label:M_FAVS.has(menu.id)?'取消收藏':'收藏'}]
  },
  'file-folder':{name:'文件夹'},
  automation:{name:'自动任务'}
};
function panelTypeName(type){return PANEL_TYPES[type]?.name||'对象'}
function panelActionsFor(menu){
  const config=PANEL_TYPES[menu.type];
  if(config?.actions) return config.actions(menu);
  const common=[
    PANEL_ACTIONS.rename,
    {...PANEL_ACTIONS.pin,label:panelIsPinned(menu.type,menu.id)?'取消置顶':'置顶'}
  ];
  if(menu.type==='automation'){
    const task=[...AUTOMATION_SCHEDULED,...AUTOMATION_REMINDERS].find(t=>t.title===menu.id);
    common.push({id:'toggle-enabled',label:task?.enabled?'停用任务':'启用任务',icon:task?.enabled?'pause-circle':'play-circle'});
  }
  common.push({...PANEL_ACTIONS.delete,label:`删除${panelTypeName(menu.type)}`});
  return common;
}
function panelObjectMenuHtml(){
  if(!panelObjectMenu) return '';
  const menu=panelObjectMenu;
  let content='';
  if(menu.mode==='rename'){
    content=`<div class="panel-menu-title">重新命名${panelTypeName(menu.type)}</div>
      <label class="panel-rename-field"><span>名称</span><input data-panel-rename-input value="${escapeAttr(panelName(menu.type,menu.id,menu.label))}" maxlength="40"></label>
      <div class="panel-menu-actions"><button type="button" data-panel-action="close">取消</button><button class="primary" type="button" data-panel-action="save-rename">确认</button></div>`;
  }else if(menu.mode==='confirm-delete'){
    content=`<div class="panel-menu-title">删除${panelTypeName(menu.type)}？</div>
      <div class="panel-menu-warning">删除后将从当前 Panel 中移除“${escapeHtml(panelName(menu.type,menu.id,menu.label))}”。</div>
      <div class="panel-menu-actions"><button type="button" data-panel-action="back">取消</button><button class="danger" type="button" data-panel-action="confirm-delete">删除</button></div>`;
  }else{
    content=`<div class="panel-menu-meta"><span>${panelTypeName(menu.type)}</span><strong>${escapeHtml(panelName(menu.type,menu.id,menu.label))}</strong></div>
      <div class="panel-menu-list" role="menu">${panelActionsFor(menu).map(action=>`<button type="button" role="menuitem" class="${action.danger?'danger':''}" data-panel-action="${action.id}"><i data-lucide="${action.icon}"></i><span>${action.label}</span></button>`).join('')}</div>
      <button class="panel-menu-cancel" type="button" data-panel-action="close">取消</button>`;
  }
  return `<div class="panel-menu-mask" data-panel-action="close"></div><section class="panel-menu" role="dialog" aria-modal="true" aria-label="${escapeAttr(panelTypeName(menu.type))}更多操作">${content}</section>`;
}
function openPanelObjectMenu(item){
  panelReturnFocusKey=panelKey(item.dataset.panelType,item.dataset.panelId);
  panelObjectMenu={type:item.dataset.panelType,id:item.dataset.panelId,label:item.dataset.panelLabel,mode:'actions'};
  render();
}
function closePanelObjectMenu(restoreFocus=true){
  panelObjectMenu=null;
  panelSuppressClick=false;
  if(restoreFocus&&panelReturnFocusKey){
    const key=panelReturnFocusKey;
    setTimeout(()=>{
      document.querySelectorAll('[data-panel-object]').forEach(el=>{
        if(panelKey(el.dataset.panelType,el.dataset.panelId)===key) el.focus();
      });
    },0);
  }
}
function handlePanelAction(action){
  if(!panelObjectMenu) return false;
  const menu=panelObjectMenu;
  const key=panelKey(menu.type,menu.id);
  if(action==='close'){closePanelObjectMenu();render();return true}
  if(action==='back'){menu.mode='actions';render();return true}
  if(action==='rename'){menu.mode='rename';render();return true}
  if(action==='save-rename'){
    const value=document.querySelector('[data-panel-rename-input]')?.value.trim();
    if(value) panelRenames.set(key,value);
    closePanelObjectMenu();render();return true;
  }
  if(action==='pin'){
    if(menu.type==='meeting-category'){
      meetPinned.has(menu.id)?meetPinned.delete(menu.id):meetPinned.add(menu.id);
    }else{
      panelPinned.has(key)?panelPinned.delete(key):panelPinned.add(key);
    }
    closePanelObjectMenu();render();return true;
  }
  if(action==='favorite'){
    const favorites=PANEL_TYPES[menu.type]?.favoriteSet;
    if(favorites) favorites.has(menu.id)?favorites.delete(menu.id):favorites.add(menu.id);
    closePanelObjectMenu();render();return true;
  }
  if(action==='toggle-enabled'){
    const task=[...AUTOMATION_SCHEDULED,...AUTOMATION_REMINDERS].find(t=>t.title===menu.id);
    if(task) task.enabled=!task.enabled;
    closePanelObjectMenu();render();return true;
  }
  if(action==='ask-delete'){menu.mode='confirm-delete';render();return true}
  if(action==='confirm-delete'){
    if(menu.type==='chat') chatFavorites.delete(menu.id);
    panelHidden.add(key);
    closePanelObjectMenu(false);render();return true;
  }
  return false;
}
function renderDrawer(p){
  if(!p.drawer) return;
  document.getElementById('dr-title').textContent=p.drawer.title;
  const drawerAction=p.drawer.action;
  const drawerActionHtml=drawerAction
    ? typeof drawerAction==='string'
      ? `<div class="dr-action">${drawerAction}</div>`
      : `<div class="dr-action" data-action="${drawerAction.action}">${drawerAction.label}</div>`
    : '';
  const body=typeof p.drawer.body==='function'?p.drawer.body():p.drawer.body;
  document.getElementById('dr-body').innerHTML=drawerActionHtml+body+panelObjectMenuHtml();
  if(panelObjectMenu?.mode==='rename'){
    setTimeout(()=>document.querySelector('[data-panel-rename-input]')?.focus(),0);
  }else if(panelObjectMenu){
    setTimeout(()=>document.querySelector('.panel-menu [role="menuitem"]')?.focus(),0);
  }
}

function openDrawer(){drawerOpen=true;projectMenuOpen=false;projectActionMenuOpen=false;meetingActionMenuOpen=false;closePanelObjectMenu(false);render()}
function closeDrawer(){drawerOpen=false;closePanelObjectMenu(false);render()}

function embeddedChatStateItems(){
  return [{t:'收起抽屉',sk:'embeddedChat',sv:'close'},{t:'打开抽屉',sk:'embeddedChat',sv:'open'}];
}

function getEmbeddedChatConfig(p){
  if(!p || !p.embeddedChat) return null;
  return typeof p.embeddedChat === 'function' ? p.embeddedChat() : p.embeddedChat;
}

function renderEmbeddedChatDrawer(p){
  const el=document.getElementById('embedded-chat-body');
  const cfg=getEmbeddedChatConfig(p);
  if(!el || !cfg) return;
  document.getElementById('embedded-chat-title').textContent=cfg.title||'上下文问答';
  const messages=(cfg.messages||[]).map(m=>{
    const cls=m.role==='assistant'?'a':'u';
    const avatar=m.role==='assistant'?'<div class="bava">✦</div>':'';
    return `<div class="brow ${cls}">${avatar}<div class="bbody"><div class="bubble">${escapeHtml(m.text)}</div><div class="btime">${escapeHtml(m.time||'刚刚')}</div></div></div>`;
  }).join('');
  el.innerHTML=`
    <div class="embedded-chat-context"><strong>${escapeHtml(cfg.contextTitle||'当前上下文')}</strong><br>${escapeHtml(cfg.contextDesc||'这是一条由当前页面底部提问建立的聊天记录。')}</div>
    <div class="bubble-area">${messages}</div>
  `;
  document.getElementById('embedded-chat-hint').textContent=cfg.hint||'继续围绕当前上下文提问…';
}

function marketEmbeddedChat(scope){
  return {
    title:'市场问答',
    contextTitle:scope,
    contextDesc:'这是一条由市场页面底部提问建立的聊天记录，当前上下文保留在市场视图。',
    hint:`继续围绕${scope}提问…`,
    messages:[
      {role:'user',text:`帮我总结一下${scope}现在最需要关注什么。`,time:'10:26'},
      {role:'assistant',text:`当前${scope}需要优先看资金方向、领涨板块持续性，以及指数回落时的承接力度。后续提问会继续保留这个市场上下文。`,time:'10:26'}
    ]
  };
}

function stockEmbeddedChat(){
  return {
    title:'单券问答',
    contextTitle:`${currentStock.name} ${currentStock.code}`,
    contextDesc:'这是一条由单券行情底部提问建立的聊天记录，当前上下文保留在该证券。',
    hint:`继续围绕 ${currentStock.name} 提问…`,
    messages:[
      {role:'user',text:`${currentStock.name} 今天上涨的主要原因是什么？`,time:'10:28'},
      {role:'assistant',text:`从当前行情看，${currentStock.name}（${currentStock.code}）最新价 ${currentStock.price}，涨跌幅 ${currentStock.chg}。盘面主要由所属板块走强、成交额放大和短线资金关注共同驱动。`,time:'10:28'},
      {role:'user',text:'帮我看一下还能不能继续追。',time:'10:29'},
      {role:'assistant',text:'短线不建议只按涨幅追入。优先观察成交额能否继续放大、分时回落时是否有承接，以及相关板块是否保持扩散。若回落跌破日内均线且量能缩小，追高胜率会下降。',time:'10:29'}
    ]
  };
}

function documentEmbeddedChat(){
  return {
    title:'文档问答',
    contextTitle:'板块轮动强度趋势.png',
    contextDesc:'这是一条由文档详情底部提问建立的聊天记录，当前上下文保留在该文档。',
    hint:'继续围绕这个文档提问…',
    messages:[
      {role:'user',text:'帮我解释这张图里的主要变化。',time:'10:31'},
      {role:'assistant',text:'这份文档展示的是板块轮动强度趋势。可以优先看强度抬升最快的板块、持续走弱的板块，以及强弱切换发生的时间点。后续提问会继续保留该文档上下文。',time:'10:31'}
    ]
  };
}

function openEmbeddedChat(){
  const p=PAGES[page];
  if(!getEmbeddedChatConfig(p)) return;
  embeddedChatOpen=true;
  drawerOpen=false;
  aliceOpen=false;
  projectMenuOpen=false;
  kb='hidden';
  render();
}
function closeEmbeddedChat(){embeddedChatOpen=false;render()}

// ── Alice selector ──
function toggleAlice(){aliceOpen=!aliceOpen;render()}
function closeAlice(){aliceOpen=false;render()}

// ── Files menu ──
function toggleFilesMenu(){filesMenuOpen=!filesMenuOpen;render()}
function closeFilesMenu(){filesMenuOpen=false;render()}
function uploadFileDemo(){
  FILE_ITEMS.unshift({name:'新上传的会议纪要.pdf',type:'file',count:'860 KB',time:'刚刚',sortTime:Date.now()});
  filesMenuOpen=false;
  render();
}
function createFolderDemo(){
  FILE_ITEMS.unshift({name:'新建文件夹',type:'folder',count:'0 项',time:'刚刚',sortTime:Date.now()+1});
  filesMenuOpen=false;
  render();
}
function toggleFilesSelect(){
  filesSelectMode=!filesSelectMode;
  render();
}
function setFilesViewMode(mode){
  filesViewMode=mode;
  filesMenuOpen=false;
  render();
}
function setFilesSortBy(sortBy){
  filesSortBy=sortBy;
  filesMenuOpen=false;
  render();
}

// ── State panel ──
function renderStatePanel(p){
  const lvMap={1:'一级页面',2:'二级页面',3:'三级页面',4:'四级页面'};
  const lvCls={1:'lv1',2:'lv2',3:'lv3',4:'lv3'};
  let html=`<div class="lv-badge ${lvCls[p.level]}">${lvMap[p.level]} · ${p.navType||'未分型'}</div>`;
  (p.states||[]).forEach(g=>{
    html+=`<div class="sg"><div class="sgl">${g.lbl}</div>`;
    g.items.forEach(item=>{
      let active=false;
      if(item.pg) active=page===item.pg;
      else if(item.sk==='chatTarget') active=chatTarget===item.sv;
      else if(item.sk==='drawer') active=(item.sv==='open'?drawerOpen:!drawerOpen);
      else if(item.sk==='embeddedChat') active=(item.sv==='open'?embeddedChatOpen:!embeddedChatOpen);
      else if(item.sk==='alice') active=(item.sv==='open'?aliceOpen:!aliceOpen);
      else if(item.sk==='kb') active=kb===item.sv;
      else if(item.sk==='workTab') active=workTab===item.sv;
      else if(item.sk==='toolTab') active=toolTab===item.sv;
      else if(item.sk==='automationTab') active=automationTab===item.sv;
      else if(item.sk==='taskTab') active=taskTab===item.sv;
      else if(item.sk==='marketTab') active=marketTab===item.sv;
      else if(item.sk==='filesMenu') active=(item.sv==='open'?filesMenuOpen:!filesMenuOpen);
      else if(item.sk==='meetingDetailVariant') active=meetingDetailVariant===item.sv;
      else if(item.sk==='meetingV113Mode') active=window.meetingV113Mode===item.sv;
      else if(item.sk==='meetingV113Detail') active=window.meetingV113DetailTab===item.sv;
      const onclick=item.pg?`go('${item.pg}')`:
        item.sk==='chatTarget'?`setChatTarget('${item.sv}')`:
        item.sk==='drawer'?(item.sv==='open'?'openDrawer()':'closeDrawer()'):
        item.sk==='embeddedChat'?(item.sv==='open'?'openEmbeddedChat()':'closeEmbeddedChat()'):
        item.sk==='alice'?(item.sv==='open'?'toggleAlice()':'closeAlice()'):
        item.sk==='kb'?`setKb('${item.sv}')`:
        item.sk==='workTab'?`setWorkTab('${item.sv}')`:
        item.sk==='toolTab'?`setToolTab('${item.sv}')`:
        item.sk==='automationTab'?`setAutomationTab('${item.sv}')`:
        item.sk==='taskTab'?`setTaskTab('${item.sv}')`:
        item.sk==='marketTab'?`setMarketTab('${item.sv}')`:
        item.sk==='filesMenu'?(item.sv==='open'?'toggleFilesMenu()':'closeFilesMenu()'):
        item.sk==='meetingDetailVariant'?`setMeetingDetailVariant('${item.sv}')`:
        item.sk==='meetingV113Mode'?`setMeetingV113Mode('${item.sv}')`:
        item.sk==='meetingV113Detail'?`setMeetingV113DetailTab('${item.sv}')`:
        '';
      html+=`<button class="sbtn${active?' active':''}" onclick="${onclick}">${item.t}</button>`;
    });
    html+=`</div>`;
  });
  html+=renderFlowPanel();
  document.getElementById('sscroll').innerHTML=html;
}

function renderFlowPanel(){
  const moduleKey = PAGE_FLOW_MODULE[page] || 'other';
  const chart = FLOW_CHARTS[moduleKey] || FLOW_CHARTS.other;
  return `<div class="flow-sec">
    <div class="flow-title">${chart.title}</div>
    ${chart.flows.map(flow=>`
      <div class="flow-card">
        <div class="flow-name">${flow.name}</div>
        <div class="flow-path">
          ${flow.steps.map((step,index)=>{
            const label=step[0], target=step[1], tab=step[2]||'';
            const isActive=target===page;
            return `${index>0?`<div class="flow-arrow">↓ ${escapeHtml(label)}</div>`:''}<button class="flow-node${isActive?' active':''}" onclick="flowGo('${target}','${tab}')">${escapeHtml(label)}</button>`;
          }).join('')}
        </div>
        <div class="flow-meta"><strong>上下文</strong> ${escapeHtml(flow.context)}<br><strong>TabBar</strong> ${escapeHtml(flow.tab)}</div>
      </div>
    `).join('')}
  </div>`;
}

function renderComponentState(){
  const spec=COMPONENT_SPECS[activeComponent]||COMPONENT_SPECS['1-A'];
  const text=getComponentText();
  const navSpec=COMPONENT_SPECS[selectedNavComponent]||COMPONENT_SPECS['1-A'];
  const tabbarSpec=COMPONENT_SPECS[selectedTabbarComponent]||COMPONENT_SPECS['tabbar-main'];
  const inputSpec=COMPONENT_SPECS[selectedInputComponent]||COMPONENT_SPECS['composer-input'];
  const contentSpec=COMPONENT_SPECS[selectedContentComponent]||COMPONENT_SPECS['content-list'];
  document.querySelectorAll('[data-component]').forEach(el=>{
    el.classList.toggle('active',isComponentSelected(el.dataset.component));
  });
  renderComponentPhone();
  const target=document.getElementById('componentState');
  if(!target) return;
  target.innerHTML=`
    <div class="lv-badge lv${spec.level==='一级'?1:spec.level==='二级'?2:3}">${activeComponent} · ${spec.name}</div>
    <div class="comp-spec">
      <div class="comp-spec-title">当前组件组合</div>
      <div class="comp-row"><span>导航栏</span><span>${selectedNavComponent} · ${navSpec.name}</span></div>
      <div class="comp-row"><span>TabBar</span><span>${tabbarSpec.name}</span></div>
      <div class="comp-row"><span>输入框</span><span>${inputSpec.name}</span></div>
      <div class="comp-row"><span>内容层</span><span>${contentSpec.name}</span></div>
    </div>
    <div class="comp-spec">
      <div class="comp-spec-title">组件参数</div>
      <div class="comp-row"><span>层级</span><span>${spec.level}</span></div>
      <div class="comp-row"><span>结构</span><span>${spec.layout}</span></div>
      <div class="comp-row"><span>左侧</span><span>${spec.left}</span></div>
      <div class="comp-row"><span>右侧</span><span>${spec.right}</span></div>
    </div>
    ${isContentComponent(activeComponent)?'':`
    <div class="comp-spec">
      <div class="comp-spec-title">可变文字</div>
      <div class="comp-field">
        <div class="comp-label">页面名称 / 对象标题</div>
        <input class="comp-input" data-comp-field="title" value="${escapeAttr(text.title)}" placeholder="例如：项目标题">
      </div>
      <div class="comp-field">
        <div class="comp-label">顶部频道 Tab</div>
        <input class="comp-input" data-comp-field="tabs" value="${escapeAttr(text.tabs)}" placeholder="用中文逗号分隔">
      </div>
      <div class="comp-field">
        <div class="comp-label">子 Tab</div>
        <input class="comp-input" data-comp-field="subTabs" value="${escapeAttr(text.subTabs)}" placeholder="用中文逗号分隔">
      </div>
      <div class="comp-field">
        <div class="comp-label">右侧功能</div>
        <input class="comp-input" data-comp-field="actions" value="${escapeAttr(text.actions)}" placeholder="例如：搜索，通知">
      </div>
      <div class="comp-field">
        <div class="comp-label">输入框占位</div>
        <input class="comp-input" data-comp-field="placeholder" value="${escapeAttr(text.placeholder)}">
      </div>
      <div class="comp-help">编辑后会实时更新手机 Mock；多个项目用中文逗号、英文逗号或顿号分隔。</div>
    </div>`}
    <div class="comp-spec">
      <div class="comp-spec-title">使用场景</div>
      <div class="comp-row"><span>适用</span><span>${spec.used}</span></div>
      <div class="comp-row"><span>规则</span><span>${spec.rule}</span></div>
    </div>
    <div class="comp-spec">
      <div class="comp-spec-title">底部规则</div>
      <div class="comp-row"><span>输入框</span><span>${inputSpec.name}</span></div>
      <div class="comp-row"><span>TabBar</span><span>${tabbarSpec.name}</span></div>
    </div>
  `;
  if(window.lucide) window.lucide.createIcons();
  scale();
}

function updateComponentControlValues(){
  const text=getComponentText();
  document.querySelectorAll('[data-comp-field]').forEach(el=>{
    if(Object.prototype.hasOwnProperty.call(text, el.dataset.compField) && el.value!==text[el.dataset.compField]){
      el.value=text[el.dataset.compField]||'';
    }
  });
}

function getComponentText(){
  return getComponentTextById(activeComponent);
}

function getComponentTextById(id){
  return Object.assign({}, COMPONENT_DEFAULT_TEXT[id]||{}, componentDrafts[id]||{});
}

function isNavComponent(id){
  return ['1-A','1-B-1','1-B-2','1-C1','1-D','2-A-1','3-A','3-B','4-A','4-B'].includes(id);
}

const CONTENT_COMPONENTS=['content-list','content-index','content-heat','content-sector','content-hot','content-bubble','content-card','content-form'];
function isContentComponent(id){return CONTENT_COMPONENTS.includes(id)}

function isComponentSelected(id){
  return id===selectedNavComponent || id===selectedTabbarComponent || id===selectedInputComponent || id===selectedContentComponent;
}

function chooseComponent(id){
  activeComponent=id;
  if(isNavComponent(id)) selectedNavComponent=id;
  else if(id==='tabbar-main'||id==='tabbar-hidden') selectedTabbarComponent=id;
  else if(id==='composer-input'||id==='composer-hidden') selectedInputComponent=id;
  else if(isContentComponent(id)) selectedContentComponent=id;
  renderComponentState();
}

function escapeAttr(str){
  return String(str||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function splitTextList(str){
  return String(str||'').split(/[，,、]/).map(s=>s.trim()).filter(Boolean);
}

function iconForAction(title){
  if(title.includes('搜索')) return 'search';
  if(title.includes('通知')) return 'bell';
  if(title.includes('语音')) return 'mic';
  if(title.includes('收藏')) return 'star';
  if(title.includes('上传')) return 'upload';
  if(title.includes('设置')) return 'settings';
  if(title.includes('分享')) return 'share-2';
  if(title.includes('更多')) return 'more-horizontal';
  if(title.includes('执行')) return 'play';
  if(title.includes('文件夹')) return 'folder-plus';
  if(title.includes('新建')) return 'plus';
  return 'more-horizontal';
}

function componentActions(actions){
  return `<div class="nrg">${actions.map((a,i)=>`<div class="nbtn" title="${escapeAttr(a.title)}"><i data-lucide="${a.icon}"></i></div>`).join('')}</div>`;
}

function componentActionsFromText(actionText){
  return componentActions(splitTextList(actionText).map(title=>({title,icon:iconForAction(title)})));
}

function contentSampleHtml(id){
  switch(id){
    case 'content-list':
      return `<div class="stock-head"><span>名称</span><span>两日图</span><span>最新价 ↓</span><span>涨跌幅 ↓</span></div><div class="stock-list">${WATCH_STOCK_ROWS.slice(0,5).map(r=>stockRow(...r)).join('')}</div>`;
    case 'content-index':
      return `<div class="idx-grid">${MARKET_INDEX_ROWS.map(r=>indexCard(...r)).join('')}</div>`;
    case 'content-heat':
      return `<div class="heat">${MARKET_HEAT_ROWS.slice(0,9).map(r=>heatTile(...r)).join('')}</div>`;
    case 'content-sector':
      return `<div class="sector-list">${MARKET_SECTOR_ROWS.map(r=>sectorRow(...r)).join('')}</div>`;
    case 'content-hot':
      return HOT_ITEMS.slice(0,2).map((r,i)=>hotItem(i+1,...r)).join('');
    case 'content-bubble':
      return `
        <div class="bubble-area">
          <div class="brow a"><div class="bava">✦</div><div class="bbody"><div class="bubble">已为您整理贵州茅台近5年ROE变化趋势，2024年预测ROE创近5年新高。</div><div class="btime">10:14</div></div></div>
          <div class="brow u"><div class="bbody"><div class="bubble">能给出具体的投资建议吗？</div><div class="btime">10:15</div></div></div>
          <div class="brow a"><div class="bava">✦</div><div class="bbody"><div class="bubble">基于ROE趋势分析，整体盈利能力稳健，建议关注高端白酒需求韧性、渠道改革进展与估值历史分位。</div><div class="btime">10:15</div></div></div>
        </div>`;
    case 'content-card':
      return `<div class="shd">项目卡片</div>${WORK_PROJECTS.slice(0,2).map((p,i)=>wc(p.name,'',p.meta,WORK_PROJECT_COLORS[i])).join('')}<div class="shd">任务卡片</div>
        <div class="at-list"><div class="at-card"><div class="at-top"><div class="at-title">每日持仓更新 &amp; 3W3C 工作计划</div></div><div class="at-prompt">每天收盘后更新当前持仓、关键波动和风险提示，并同步生成当日进展与次日行动。</div><div class="at-foot"><div class="at-meta"><span class="at-meta-chip">每天</span><span class="at-meta-chip">17:30</span></div><div class="at-switch on"></div></div></div></div>`;
    case 'content-form':
      return `
        <div class="td-form">
          <div class="td-field"><div class="td-label">任务名称</div><input class="td-input" value="每日市场早报汇总"/></div>
          <div class="td-field"><div class="td-label">任务内容 <span class="hint">输入 / 可选技能</span></div><div class="td-textarea-wrap"><textarea class="td-textarea">每日开盘前整合隔夜海外市场、宏观数据、重要公告和今日关注事项，输出早报摘要与机会提示。</textarea><div class="td-counter">54 / 2000</div></div></div>
          <div class="td-field"><div class="td-label">频次</div><select class="td-select"><option>每天</option><option>工作日</option><option>每周</option></select></div>
        </div>
        <div class="td-actions"><div class="td-btn">保存修改</div><div class="td-btn primary">立即执行</div></div>`;
    default:
      return '';
  }
}

function renderComponentPhone(){
  const ui = componentUi[selectedNavComponent] || (componentUi[selectedNavComponent]={tab:0,subTab:0,menu:false});
  const navText=getComponentTextById(selectedNavComponent);
  const tabbarText=getComponentTextById('tabbar-main');
  const inputText=getComponentTextById('composer-input');
  const text=navText;
  const tabs=splitTextList(text.tabs);
  const subTabs=splitTextList(text.subTabs);
  const actions=componentActionsFromText(text.actions);
  const nav=document.getElementById('compNav');
  const sub=document.getElementById('compSubNav');
  const body=document.getElementById('compBody');
  const input=document.getElementById('compInput');
  const tabbar=document.getElementById('compTabbar');
  if(!nav||!sub||!body||!input) return;
  sub.innerHTML='';
  input.innerHTML=selectedInputComponent==='composer-hidden'?'':`<div class="ibar component-composer"><div class="composer-row"><button class="composer-icon-btn" type="button" aria-label="添加附件"><i data-lucide="plus"></i></button><button class="ifield composer-voice-field" type="button"><i data-lucide="audio-lines"></i><span>按住说话</span></button><button class="composer-icon-btn" type="button" aria-label="切换到键盘输入"><i data-lucide="keyboard"></i></button></div></div>`;
  if(tabbar){
    tabbar.classList.toggle('hidden',selectedTabbarComponent==='tabbar-hidden');
    tabbar.innerHTML=renderComponentBottomTabs(splitTextList(tabbarText.tabs),componentUi['tabbar-main']?.tabbar||0);
  }

  if(selectedNavComponent==='1-A'){
    nav.innerHTML=`<div class="tnav"><div class="htabs">${renderComponentTabs(tabs.length?tabs:['自选','热议','市场','持仓'],'htab','tabs',ui.tab,selectedNavComponent)}</div>${actions}</div>`;
  } else if(selectedNavComponent==='1-B-1'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn">=</div><div class="nctr"><div class="nalice"><span class="nalice-n editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'Alice')}</span><span class="nalice-a" data-comp-action="toggle-menu"> ›</span></div></div>${ui.menu?componentMenu(['Alice','金融专家数字人','投研专家','固收专家']):''}${actions}</div>`;
  } else if(selectedNavComponent==='1-B-2'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn">=</div><div class="nctr"><div class="ntitle editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'项目列表')}</div></div>${actions}</div>`;
  } else if(selectedNavComponent==='1-C1'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn">=</div><div class="nctr"><div class="ntitle editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'对话标题')}</div></div>${actions}</div>`;
  } else if(selectedNavComponent==='1-D'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn">=</div><div class="nctr"><div class="ntitle editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'自动任务')}</div></div>${actions}</div>`;
    sub.innerHTML=`<div class="snav">${renderComponentTabs(subTabs.length?subTabs:['定时任务','提醒任务'],'stab','subTabs',ui.subTab,selectedNavComponent)}</div>`;
  } else if(selectedNavComponent==='2-A-1'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn">=</div><div class="nctr"><div class="project-title"><div class="ntitle editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'项目标题')}</div><span class="nalice-a" data-comp-action="toggle-menu">⌄</span></div></div>${ui.menu?componentMenu(['项目标题','信用债合规筛查','Q3持仓归因分析','半导体板块舆情汇总']):''}${actions}</div>`;
    sub.innerHTML=`<div class="snav">${renderComponentTabs(subTabs.length?subTabs:['动态','群聊','文件'],'stab','subTabs',ui.subTab,selectedNavComponent)}</div>`;
  } else if(selectedNavComponent==='3-A'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn back">‹</div><div class="nctr"><div class="ntitle editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'股票名称 [代码]')}</div></div>${actions}</div>`;
  } else if(selectedNavComponent==='3-B'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn back">‹</div><div class="nctr"><div class="ntitle editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'工具')}</div></div>${actions}</div>`;
    sub.innerHTML=`<div class="snav">${renderComponentTabs(subTabs.length?subTabs:['技能','专家','连接器'],'stab','subTabs',ui.subTab,selectedNavComponent)}</div>`;
  } else if(selectedNavComponent==='4-B'){
    nav.innerHTML=`<div class="tnav"><div class="nbtn back">‹</div><div class="nctr nav-search-center"><label class="nav-search-box"><input class="nav-search-input" value="${escapeAttr(text.placeholder||'搜索词、搜索标的')}" data-comp-field="placeholder"><button class="nav-search-clear" type="button">×</button></label></div><button class="nav-search-submit">搜索</button></div>`;
  } else {
    nav.innerHTML=`<div class="tnav"><div class="nbtn back">‹</div><div class="nctr"><div class="ntitle editable-text" contenteditable="true" data-edit-component="${selectedNavComponent}" data-edit-field="title">${escapeHtml(text.title||'设置')}</div></div>${actions}</div>`;
  }

  if(isContentComponent(selectedContentComponent)){
    body.innerHTML=contentSampleHtml(selectedContentComponent);
    return;
  }
}

function renderComponentBottomTabs(items,activeIndex){
  const labels=(items&&items.length?items:['Tab 1','Tab 2','Tab 3','Tab 4','我的']).slice(0,5);
  while(labels.length<5) labels.push(labels.length===4?'我的':`Tab ${labels.length+1}`);
  const icons=['line-chart','message-circle','briefcase','share-2','user'];
  return labels.map((label,i)=>{
    const editable=activeComponent==='tabbar-main' ? ' contenteditable="true" data-edit-component="tabbar-main" data-edit-list="tabs" data-edit-index="'+i+'"' : '';
    return `<div class="titem${i===activeIndex?' active':''}" data-comp-tab="tabbar" data-comp-index="${i}"><div class="tico"><i data-lucide="${icons[i]||'circle'}"></i></div><div class="tlbl${activeComponent==='tabbar-main'?' editable-text':''}"${editable}>${escapeHtml(label)}</div></div>`;
  }).join('');
}

function renderComponentTabs(items,cls,field,activeIndex,componentId){
  return items.map((t,i)=>`${cls==='htab'&&i>0?'<div class="htab-sep"></div>':''}<div class="${cls}${i===activeIndex?' active':''}" data-comp-tab="${field}" data-comp-index="${i}"><span class="editable-text" contenteditable="true" data-edit-component="${componentId}" data-edit-list="${field}" data-edit-index="${i}">${escapeHtml(t)}</span></div>`).join('');
}

function componentMenu(items){
  const title=getComponentTextById(selectedNavComponent).title;
  return `<div class="comp-menu">${items.map(item=>`<div class="comp-menu-item${item===title?' active':''}" data-comp-menu-value="${escapeAttr(item)}">${escapeHtml(item)}</div>`).join('')}</div>`;
}

function escapeHtml(str){
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderAppMode(){
  document.querySelectorAll('.top-tab[data-mode]').forEach(el=>el.classList.toggle('active',el.dataset.mode===appMode));
  document.getElementById('demoView').classList.toggle('active',appMode==='demo');
  document.getElementById('componentView').classList.toggle('active',appMode==='component');
  if(appMode==='component') renderComponentState();
  scale();
}

// ── Scroll-aware bottom chrome ──
function setBottomChromeHidden(hidden){
  const phone=document.getElementById('phone');
  if(!phone||!phone.classList.contains('scroll-chrome-enabled')) return;
  phone.classList.toggle('scroll-chrome-hidden',hidden);
}

function clearChatCarousels(){
  chatCarouselTimers.forEach(timer=>clearInterval(timer));
  chatCarouselTimers=[];
}

function startChatCarousel(track){
  const cards=[...track.children];
  if(cards.length<2) return;
  let direction=1;
  const timer=setInterval(()=>{
    const step=track.clientWidth+10;
    let index=Math.round(track.scrollLeft/step);
    if(index>=cards.length-1) direction=-1;
    else if(index<=0) direction=1;
    index+=direction;
    track.scrollTo({left:index*step,behavior:'smooth'});
  },3000);
  chatCarouselTimers.push(timer);
}

function initializeChatCarousels(){
  clearChatCarousels();
  if(page!=='chat-main'||kb==='show') return;
  document.querySelectorAll('.chat-trending-scroll,.chat-case-list').forEach(startChatCarousel);
}

function configureBottomChrome({showInput,showKb,showEmbeddedChat,showTbar}){
  const phone=document.getElementById('phone');
  const ca=document.getElementById('ca');
  if(!phone||!ca) return;

  if(scrollChromeTimer){
    clearTimeout(scrollChromeTimer);
    scrollChromeTimer=null;
  }

  const enabled=!showKb&&!showEmbeddedChat&&(showInput||showTbar);
  const tabbarHeight=showTbar?TAB_BAR_HEIGHT:0;
  const bottomInset=(showInput?INPUT_BAR_HEIGHT:0)+tabbarHeight;

  phone.style.setProperty('--scroll-tabbar-height',`${tabbarHeight}px`);
  phone.style.setProperty('--scroll-bottom-inset',`${bottomInset}px`);
  phone.classList.toggle('scroll-chrome-enabled',enabled);
  phone.classList.remove('scroll-chrome-hidden');
  contentScrollTop=Math.max(0,ca.scrollTop);
}

function handleContentScroll(event){
  const ca=event.currentTarget;
  const phone=document.getElementById('phone');
  if(!phone||!phone.classList.contains('scroll-chrome-enabled')) return;

  const nextScrollTop=Math.max(0,ca.scrollTop);
  const delta=nextScrollTop-contentScrollTop;
  contentScrollTop=nextScrollTop;

  if(scrollChromeTimer) clearTimeout(scrollChromeTimer);

  if(nextScrollTop<=0||delta<-1){
    setBottomChromeHidden(false);
  } else if(delta>1){
    setBottomChromeHidden(true);
  }

  scrollChromeTimer=setTimeout(()=>{
    setBottomChromeHidden(false);
    scrollChromeTimer=null;
  },SCROLL_STOP_DELAY);
}

// ── Main render ──
function render(){
  const p=PAGES[page];
  if(!p) return;
  const phoneShell=document.getElementById('phone');
  if(phoneShell){
    phoneShell.scrollTop=0;
    phoneShell.scrollLeft=0;
  }
  clearChatCarousels();

  // Directory
  document.querySelectorAll('.di').forEach(el=>el.classList.toggle('active',el.dataset.page===page));

  // Status bar
  renderStatusBar(p);

  // Nav
  renderNav(p);

  // Secondary nav
  renderSecNav(p);

  // Content
  document.getElementById('ca').innerHTML=p.content();

  // Input bar
  const ibar=document.getElementById('ibar');
  const showInput = !p.hideInput && (p.ibar || p.level <= 3);
  const embeddedChatConfig = getEmbeddedChatConfig(p);
  const showEmbeddedChat = !!embeddedChatConfig && embeddedChatOpen;
  ibar.classList.toggle('hidden',!showInput||showEmbeddedChat);
  ibar.classList.toggle('keyboard-active',showInput&&kb==='show'&&!showEmbeddedChat);
  ibar.classList.toggle('text-mode',composerInputMode==='text');
  if(showInput){
    const inputField=document.getElementById('ihint');
    inputField.value=composerText;
    inputField.placeholder='/ 使用技能，# 选择标的';
    inputField.setAttribute('aria-label',p.ihint||'输入任务或对话');
    const voiceField=document.getElementById('voiceHoldButton');
    if(page.startsWith('meeting-')){
      inputField.dataset.action='meeting-v113-chat';
      if(voiceField) voiceField.dataset.action='meeting-v113-chat';
    }else{
      delete inputField.dataset.action;
      if(voiceField) delete voiceField.dataset.action;
    }
    const modeToggle=ibar.querySelector('.composer-mode-toggle');
    if(modeToggle){
      const textMode=composerInputMode==='text';
      modeToggle.dataset.action='composer-toggle-mode';
      modeToggle.setAttribute('aria-label',textMode?'切换到语音输入':'切换到键盘输入');
      modeToggle.title=textMode?'切换到语音输入':'切换到键盘输入';
      modeToggle.innerHTML=`<i data-lucide="${textMode?'mic':'keyboard'}"></i>`;
    }
    renderComposerControls();
  }

  // Keyboard
  const kbsim=document.getElementById('kbsim');
  const showKb=showInput&&kb==='show'&&!showEmbeddedChat;
  kbsim.classList.toggle('hidden',!showKb);

  // TabBar
  const tbar=document.getElementById('tbar');
  const showTbar=!!p.tbar&&!showKb&&!showEmbeddedChat;
  tbar.classList.toggle('hidden',!showTbar);
  configureBottomChrome({showInput:showInput&&!showEmbeddedChat,showKb,showEmbeddedChat,showTbar});

  // TabBar active
  ['home','chat','work','link','mine'].forEach(id=>{
    const el=document.getElementById('tb-'+id);
    if(el) el.classList.toggle('active',p.tba===id);
  });

  // Drawer
  renderDrawer(p);
  document.getElementById('drawer').classList.toggle('open',drawerOpen&&!!p.drawer);

  // Embedded assistant drawer
  renderEmbeddedChatDrawer(p);
  document.getElementById('embedded-chat-drawer').classList.toggle('open',showEmbeddedChat);

  // Alice selector
  document.getElementById('alice-bd').classList.toggle('open',aliceOpen&&p.nav==='chat-main');
  document.getElementById('alice-sel').classList.toggle('open',aliceOpen&&p.nav==='chat-main');
  document.getElementById('ack-alice').style.opacity=chatTarget==='alice'?'1':'0';
  document.getElementById('ack-expert').style.opacity=chatTarget==='expert'?'1':'0';

  // WeChat modal — only on login page
  const wcModal=document.getElementById('wcModal');
  if(wcModal) wcModal.classList.toggle('open',wcModalType&&page==='login');
  const aiMeetingSheet=document.getElementById('aiMeetingSheet');
  if(aiMeetingSheet) aiMeetingSheet.classList.toggle('open',aiMeetingSheetOpen&&page.startsWith('meeting'));
  renderMeetingFilterSheet();
  const mcalSheet=document.getElementById('mcalSheet');
  if(mcalSheet){
    mcalSheet.classList.toggle('open',calOpen&&page.startsWith('meeting')&&!aiMeetingSheetOpen);
    renderCalGrid();
  }

  // State panel
  renderStatePanel(p);

  if(window.lucide) window.lucide.createIcons();
  if(window.renderMeetingV113) window.renderMeetingV113();
  renderComponentState();
  renderAppMode();
  if(p.navType==='4-B'){
    const searchInput=document.querySelector('[data-tool-search-input]');
    if(searchInput) setTimeout(()=>searchInput.focus(),0);
  }
  initializeChatCarousels();
}

// ── Actions ──
function go(pg){
  page=pg; drawerOpen=false; embeddedChatOpen=false; aliceOpen=false; projectMenuOpen=false; projectActionMenuOpen=false; meetingActionMenuOpen=false; aiMeetingSheetOpen=false; meetingFilterOpen=false; calOpen=false; closePanelObjectMenu(false); kb='hidden'; composerText='';
  if(pg!=='work-group-chat') projectChatIsNew=false;
  render();
}

function updateToolSearchResults(){
  if(page!=='tools-search') return;
  const p=PAGES[page];
  document.getElementById('ca').innerHTML=p.content();
  renderStatePanel(p);
  if(window.lucide) window.lucide.createIcons();
}

function setToolSearchQuery(value){
  toolSearchQuery=value;
}

function clearToolSearch(){
  toolSearchQuery='';
  toolSearchSubmittedQuery='';
  toolSearchResultTab='all';
  const input=document.querySelector('[data-tool-search-input]');
  if(input){
    input.value='';
    input.focus();
  }
  updateToolSearchResults();
}

function submitToolSearch(){
  const input=document.querySelector('[data-tool-search-input]');
  if(input) toolSearchQuery=input.value;
  toolSearchSubmittedQuery=toolSearchQuery.trim();
  toolSearchResultTab='all';
  if(input) input.blur();
  if(page!=='tools-search') go('tools-search');
  else updateToolSearchResults();
}

function setToolSearchResultTab(tab){
  toolSearchResultTab=tab;
  updateToolSearchResults();
}

function flowGo(pg,tab){
  if(tab){
    if(pg==='work-detail') workTab=tab;
    else if(pg==='automation-task-detail') taskTab=tab;
    else if(pg==='tools-home'||pg==='mine-tools') toolTab=tab;
    else if(pg==='meeting-detail'&&window.setMeetingV113DetailTab) window.setMeetingV113DetailTab(tab);
  }
  go(pg);
}

function setChatTarget(t){chatTarget=t;aliceOpen=false;render()}
function setKb(v){
  kb=v;
  if(v==='show') composerInputMode='text';
  if(v!=='show') composerMenu='';
  render();
  if(v==='show') requestAnimationFrame(()=>document.getElementById('ihint')?.focus());
}
function toggleComposerMode(){
  composerInputMode=composerInputMode==='voice'?'text':'voice';
  kb=composerInputMode==='text'?'show':'hidden';
  composerMenu='';
  render();
  if(kb==='show') requestAnimationFrame(()=>document.getElementById('ihint')?.focus());
}
function addComposerAttachment(){document.getElementById('composerAttachmentInput')?.click()}
function composerMenuItems(type){
  if(type==='quick') return COMPOSER_QUICK_MODES.map(name=>({name,active:name===composerQuickMode}));
  if(type==='expert') return COMPOSER_EXPERTS.map(item=>Object.assign({},item,{active:item.name===composerExpert}));
  if(type==='skill') return TOOL_MARKET_ITEMS.skills.map(item=>({name:item.name,icon:item.icon,active:false}));
  return [];
}
function renderComposerControls(){
  const quickLabel=document.getElementById('composerQuickLabel');
  const expertLabel=document.getElementById('composerExpertLabel');
  const expertClear=document.getElementById('composerExpertClear');
  const expertPill=expertClear?.closest('.composer-expert-pill');
  const popover=document.getElementById('composerPopover');
  if(quickLabel) quickLabel.textContent=composerQuickMode;
  if(expertLabel) expertLabel.textContent=composerExpert||'金融专家';
  if(expertClear) expertClear.classList.toggle('hidden',!composerExpert);
  if(expertPill) expertPill.classList.toggle('has-value',!!composerExpert);
  document.querySelectorAll('[data-composer-shortcut]').forEach(el=>el.classList.toggle('active',el.dataset.composerShortcut===composerMenu));
  if(!popover) return;
  popover.classList.toggle('hidden',!composerMenu);
  if(!composerMenu){
    popover.innerHTML='';
    delete popover.dataset.menu;
    return;
  }
  popover.dataset.menu=composerMenu;
  const title=composerMenu==='quick'?'选择对话模式':composerMenu==='expert'?'选择金融专家':'选择技能';
  popover.innerHTML=`<div class="composer-popover-title">${title}</div>${composerMenuItems(composerMenu).map(item=>`
    <button class="composer-popover-item${item.active?' active':''}" type="button" role="option" aria-selected="${item.active?'true':'false'}" data-composer-option="${escapeAttr(item.name)}" data-composer-option-type="${composerMenu}">
      <span>${escapeHtml(item.name)}</span>${item.active?'<i data-lucide="check"></i>':item.icon?`<i data-lucide="${item.icon}"></i>`:''}
    </button>`).join('')}`;
}
function setComposerShortcut(value){
  composerMenu=composerMenu===value?'':value;
  renderComposerControls();
  if(window.lucide) window.lucide.createIcons();
}
function selectComposerOption(type,value){
  if(type==='quick') composerQuickMode=value;
  if(type==='expert'){
    composerExpert=value;
    chatTarget='expert';
  }
  if(type==='skill'){
    const token=`/${value}`;
    composerText=`${composerText.trimEnd()}${composerText.trim()?' ':''}${token} `;
    const input=document.getElementById('ihint');
    if(input) input.value=composerText;
  }
  composerMenu='';
  renderComposerControls();
  if(window.lucide) window.lucide.createIcons();
  requestAnimationFrame(()=>document.getElementById('ihint')?.focus());
}
function clearComposerExpert(){
  composerExpert='';
  composerMenu='';
  renderComposerControls();
  if(window.lucide) window.lucide.createIcons();
}
function toggleSpeech(){speechMuted=!speechMuted;render()}
function useTrendingPrompt(text){
  composerText=text;
  composerInputMode='text';
  kb='show';
  render();
}
function setWorkTab(t){workTab=t;projectMenuOpen=false;projectActionMenuOpen=false;render()}
function setToolTab(t){toolTab=t;render()}
function setAutomationTab(t){automationTab=t;render()}
function setMarketTab(t){marketTab=t;render()}
function setCurrentRun(index){
  currentRunIndex = Math.max(0, Math.min(AUTOMATION_RUN_HISTORY.length - 1, Number(index) || 0));
  go('automation-run-detail');
}
function meetingVariantForPlatform(item){
  if(!item.perm) return 'platform-restricted';
  if(item.status==='live') return 'platform-live';
  if(item.status==='ended') return 'platform-ended';
  return 'platform-upcoming';
}
function setMeetingDetailVariant(variant){
  const cfg=MEETING_DETAIL_VARIANTS[variant];
  if(!cfg) return;
  meetingDetailVariant=variant;
  currentMeetingDetailItem=cfg.source==='platform'
    ?mById(cfg.id)
    :cfg.source==='ai'
      ?M_AI.find(item=>item.id===cfg.id)
      :M_UP.find(item=>item.id===cfg.id);
  currentMeet=cfg.source==='platform'?currentMeetingDetailItem:null;
  if(page!=='meeting-detail') meetingFrom=page;
  go('meeting-detail');
}
function openGeneratedMeetingDetail(id){
  const ai=M_AI.find(item=>item.id===id);
  const upload=M_UP.find(item=>item.id===id);
  const item=ai||upload;
  if(!item) return;
  currentMeetingDetailItem=item;
  currentMeet=null;
  if(ai) meetingDetailVariant=ai.status==='running'?'ai-running':ai.status==='done'?'ai-done':'ai-scheduled';
  else meetingDetailVariant=upload.status==='failed'?'upload-failed':upload.status==='done'?'upload-done':'upload-processing';
  if(page!=='meeting-detail') meetingFrom=page;
  go('meeting-detail');
}
function toggleMeetingActionMenu(){meetingActionMenuOpen=!meetingActionMenuOpen;drawerOpen=false;render()}
function closeMeetingActionMenu(){meetingActionMenuOpen=false;render()}
function openAiMeetingSheet(){
  meetingActionMenuOpen=false;
  drawerOpen=false;
  aiMeetingSheetOpen=true;
  render();
  setTimeout(()=>document.querySelector('#aiMeetingSheet input')?.focus(),80);
}
function closeAiMeetingSheet(){aiMeetingSheetOpen=false;render()}
function confirmAiMeeting(){aiMeetingSheetOpen=false;render()}
function uploadMeetingRecording(){
  meetingActionMenuOpen=false;
  render();
  setTimeout(()=>document.getElementById('meetingRecordingInput')?.click(),0);
}
function setTaskTab(t){taskTab=t;render()}
function setNotificationTab(t){notificationTab=t;render()}
function markNotificationsRead(){
  NOTIFICATION_ITEMS.forEach(item=>{item.status='read'});
  render();
}
function toggleProjectMenu(){projectMenuOpen=!projectMenuOpen;projectActionMenuOpen=false;drawerOpen=false;render()}
function toggleProjectActionMenu(){projectActionMenuOpen=!projectActionMenuOpen;projectMenuOpen=false;drawerOpen=false;render()}
function closeProjectActionMenu(){projectActionMenuOpen=false;render()}
function createProjectChat(){
  projectActionMenuOpen=false;
  projectChatIsNew=true;
  page='work-group-chat';
  drawerOpen=false;
  kb='hidden';
  composerText='';
  render();
}
function addProjectFile(){
  projectActionMenuOpen=false;
  workTab='files';
  render();
}
function setCurrentProject(name,targetPage){
  currentProject=name;
  projectMenuOpen=false;
  projectActionMenuOpen=false;
  drawerOpen=false;
  if(targetPage) page=targetPage;
  render();
}
function setCurrentStock(code,targetPage){
  if(STOCKS[code]) currentStock=STOCKS[code];
  embeddedChatOpen=false;
  if(targetPage) page=targetPage;
  render();
}

// ── WeChat OAuth ──
let wcModalType=null;
function openWcModal(type){
  wcModalType=type;
  const modal=document.getElementById('wcModal');
  const icon=document.getElementById('wcModalIcon');
  const title=document.getElementById('wcModalTitle');
  icon.classList.remove('wecom');
  icon.innerHTML='<i data-lucide="message-circle"></i>';
  title.textContent='微信登录';
  modal.classList.add('open');
  if(window.lucide) window.lucide.createIcons();
}
function closeWcModal(){
  document.getElementById('wcModal').classList.remove('open');
  wcModalType=null;
}
function confirmWcLogin(){
  closeWcModal();
  setTimeout(()=>{
    alert('[Demo] 正在跳转微信完成 OAuth 授权登录…\n\n实际环境中将唤起微信客户端进行授权。');
    go('home-watch');
  },200);
}
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('wcModalConfirm');
  if(btn) btn.addEventListener('click',confirmWcLogin);
});

function setMeetingFilter(key,value){
  if(value==='calendar'){
    calFor=key;
    calOpen=true;
    render();
    return;
  }
  if(key==='mtStatus') mtStatus=value;
  else if(key==='mtInd') mtInd=value;
  else if(key==='mtTime') mtTime=value;
  else if(key==='skStatus') skStatus=value;
  else if(key==='skSrc') skSrc=value;
  else if(key==='skTime') skTime=value;
  else if(key==='mnSrc') mnSrc=value;
  else if(key==='mnTime') mnTime=value;
  else if(key==='fvStatus') fvStatus=value;
  else if(key==='fvTime') fvTime=value;
  render();
}
function openMeetingFilter(key){
  const cfg=meetingFilterConfig(key);
  if(!cfg) return;
  if(cfg.calendar){
    openMeetingCalendar(key);
    return;
  }
  meetingFilterKey=key;
  meetingFilterDraft=meetingFilterValue(key);
  meetingFilterOpen=true;
  calOpen=false;
  render();
}
function mDatePlus(days){
  const date=new Date(`${M_M_TODAY}T00:00:00`);
  date.setDate(date.getDate()+days);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function openMeetingCalendar(key){
  const value=meetingFilterValue(key);
  calFor=key;
  calQuick=['d3','d7','d30'].includes(value)?value:'';
  if(calQuick){
    const days=calQuick==='d3'?3:calQuick==='d7'?7:30;
    calStart=M_M_TODAY;
    calEnd=mDatePlus(days-1);
  }else if(value.startsWith('range:')){
    [,calStart,calEnd]=value.split(':');
  }else if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
    calStart=value;
    calEnd=value;
  }else{
    calStart='';
    calEnd='';
  }
  meetingFilterOpen=false;
  calScrollTop=0;
  calOpen=true;
  render();
}
function pickMeetingQuick(value){
  if(calQuick===value){
    calQuick='';
    calStart='';
    calEnd='';
    return;
  }
  const days=value==='d3'?3:value==='d7'?7:30;
  calQuick=value;
  calStart=M_M_TODAY;
  calEnd=mDatePlus(days-1);
}
function pickMeetingDay(date){
  calQuick='';
  if(!calStart||(calStart&&calEnd)){
    calStart=date;
    calEnd='';
  }else if(date<calStart){
    calStart=date;
    calEnd='';
  }else{
    calEnd=date;
  }
}
function confirmMeetingCalendar(){
  if(!calStart){
    calOpen=false;
    setMeetingFilter(calFor,'all');
    return;
  }
  const value=calQuick||`range:${calStart}:${calEnd||calStart}`;
  calOpen=false;
  setMeetingFilter(calFor,value);
}
function clearMeetingCalendar(){
  calStart='';
  calEnd='';
  calQuick='';
  calOpen=false;
  setMeetingFilter(calFor,'all');
}
function closeMeetingFilter(){meetingFilterOpen=false;render()}
function confirmMeetingFilter(){
  if(!meetingFilterKey) return;
  meetingFilterOpen=false;
  setMeetingFilter(meetingFilterKey,meetingFilterDraft);
}
function clearMeetingFilter(){
  if(!meetingFilterKey) return;
  meetingFilterDraft='all';
  meetingFilterOpen=false;
  setMeetingFilter(meetingFilterKey,'all');
}

function clearPanelLongPress(){
  if(panelLongPressTimer!==null){
    clearTimeout(panelLongPressTimer);
    panelLongPressTimer=null;
  }
  panelPressPoint=null;
}

document.addEventListener('pointerdown',e=>{
  const item=e.target.closest('[data-panel-object]');
  if(!item||e.button!==0) return;
  clearPanelLongPress();
  panelPressPoint={x:e.clientX,y:e.clientY,item};
  panelLongPressTimer=setTimeout(()=>{
    panelLongPressTimer=null;
    panelSuppressClick=true;
    openPanelObjectMenu(item);
  },550);
});
document.addEventListener('pointerup',clearPanelLongPress);
document.addEventListener('pointercancel',clearPanelLongPress);
document.addEventListener('pointermove',e=>{
  if(!panelPressPoint) return;
  if(Math.hypot(e.clientX-panelPressPoint.x,e.clientY-panelPressPoint.y)>8) clearPanelLongPress();
});
document.addEventListener('contextmenu',e=>{
  const item=e.target.closest('[data-panel-object]');
  if(!item) return;
  e.preventDefault();
  clearPanelLongPress();
  panelSuppressClick=true;
  openPanelObjectMenu(item);
});

const UI_ACTIONS = {
  'open-drawer':openDrawer,
  'close-drawer':closeDrawer,
  'new-chat':()=>go('chat-main'),
  'open-embedded-chat':openEmbeddedChat,
  'composer-toggle-mode':toggleComposerMode,
  'composer-add-attachment':addComposerAttachment,
  'composer-clear-expert':clearComposerExpert,
  'close-embedded-chat':closeEmbeddedChat,
  'toggle-alice':toggleAlice,
  'toggle-project-menu':toggleProjectMenu,
  'toggle-project-actions':toggleProjectActionMenu,
  'close-project-actions':closeProjectActionMenu,
  'project-new-chat':createProjectChat,
  'project-add-file':addProjectFile,
  'toggle-meeting-actions':toggleMeetingActionMenu,
  'close-meeting-actions':closeMeetingActionMenu,
  'open-ai-meeting':openAiMeetingSheet,
  'close-ai-meeting':closeAiMeetingSheet,
  'confirm-ai-meeting':confirmAiMeeting,
  'upload-meeting-recording':uploadMeetingRecording,
  'toggle-speech':toggleSpeech,
  'close-alice':closeAlice,
  'files-menu':toggleFilesMenu,
  'close-files-menu':closeFilesMenu,
  'files-upload':uploadFileDemo,
  'files-new-folder':createFolderDemo,
  'files-select':toggleFilesSelect,
  'files-view-list':()=>setFilesViewMode('list'),
  'files-view-image':()=>setFilesViewMode('image'),
  'files-sort-title':()=>setFilesSortBy('title'),
  'files-sort-time':()=>setFilesSortBy('time'),
  'files-sort-type':()=>setFilesSortBy('type'),
  'clear-tool-search':clearToolSearch,
  'submit-tool-search':submitToolSearch,
  'notifications-read-all':markNotificationsRead,
  'go-back':element=>{const target=element.dataset.backpage;if(target) go(target)},
  'wc-login':element=>openWcModal(element.dataset.wc),
  'close-wc-modal':closeWcModal
};
function dispatchUiAction(element){
  const handler=UI_ACTIONS[element.dataset.action];
  if(!handler) return false;
  handler(element);
  return true;
}

const MEETING_ACTIONS = {
  status:({arg})=>{mtStatus=arg;render()},
  ind:({arg})=>{mtInd=arg;render()},
  time:({arg})=>{mtTime=arg;render()},
  openCal:({arg})=>openMeetingCalendar(arg),
  skstatus:({arg})=>{skStatus=arg;render()},
  sksrc:({arg})=>{skSrc=arg;render()},
  sktime:({arg})=>{skTime=arg;render()},
  skCal:()=>openMeetingCalendar('skTime'),
  mnsrc:({arg})=>{mnSrc=arg;render()},
  mntime:({arg})=>{mnTime=arg;render()},
  mnCal:()=>openMeetingCalendar('mnTime'),
  fvstatus:({arg})=>{fvStatus=arg;render()},
  fvtime:({arg})=>{fvTime=arg;render()},
  fvCal:()=>openMeetingCalendar('fvTime'),
  closefilter:()=>{meetingFilterOpen=false;render()},
  pickfilter:({arg})=>{meetingFilterDraft=meetingFilterDraft===arg?'all':arg;render()},
  confirmfilter:confirmMeetingFilter,
  clearfilter:clearMeetingFilter,
  cap:()=>{calOpen=false;render()},
  pickquick:({arg})=>{pickMeetingQuick(arg);render()},
  pickday:({arg})=>{
    calScrollTop=document.querySelector('.mcal-scroll')?.scrollTop||0;
    pickMeetingDay(arg);
    render();
  },
  confirmcal:confirmMeetingCalendar,
  clearcal:clearMeetingCalendar,
  cat:({cat})=>{meetCat=cat;mtStatus='all';mtInd='all';mtTime='all';go('meeting-home')},
  open:({id})=>{
    currentMeet=mById(id)||{id,title:'会议详情',date:M_M_TODAY,start:'--',end:'--',org:'',cat:'',inds:[],status:'upcoming',perm:true};
    currentMeetingDetailItem=currentMeet;
    meetingDetailVariant=meetingVariantForPlatform(currentMeet);
    if(page!=='meeting-detail') meetingFrom=page;
    go('meeting-detail');
  },
  res:({id})=>{M_RES.has(id)?M_RES.delete(id):M_RES.add(id);render()},
  fav:({id})=>{M_FAVS.has(id)?M_FAVS.delete(id):M_FAVS.add(id);render()},
  ailisten:openAiMeetingSheet,
  openai:({id})=>openGeneratedMeetingDetail(id),
  noperm:()=>render()
};
function dispatchMeetingAction(element){
  const handler=MEETING_ACTIONS[element.dataset.mact];
  if(!handler) return false;
  handler({
    element,
    arg:element.dataset.arg,
    id:element.dataset.id,
    cat:element.dataset.cat
  });
  return true;
}

// ── Event delegation ──
document.addEventListener('click',e=>{
  if(appMode==='component'&&e.target.closest('#componentView')&&!e.target.closest('[data-component],[data-comp-menu-value],[data-comp-action],[data-comp-tab],[data-comp-field],[contenteditable]')) return;
  const collapseForPageInteraction=kb==='show'&&e.target.closest('#phone')&&!e.target.closest('#ibar,#kbsim,#vover');
  if(collapseForPageInteraction){
    kb='hidden';
    composerMenu='';
    requestAnimationFrame(()=>{if(kb==='hidden') render()});
  }
  const mode=e.target.closest('.top-tab[data-mode]');
  if(mode){appMode=mode.dataset.mode;renderAppMode();return}

  const composerOption=e.target.closest('[data-composer-option]');
  if(composerOption){selectComposerOption(composerOption.dataset.composerOptionType,composerOption.dataset.composerOption);return}

  if(e.target.id==='ihint'&&page.startsWith('meeting-')&&window.openMeetingV113Chat){window.openMeetingV113Chat();return}
  if(e.target.id==='ihint'&&kb!=='show'){setKb('show');return}

  const composerShortcut=e.target.closest('[data-composer-shortcut]');
  if(composerShortcut){setComposerShortcut(composerShortcut.dataset.composerShortcut);return}

  if(composerMenu&&e.target.closest('#ibar')&&!e.target.closest('#composerPopover,#composerShortcuts')){
    composerMenu='';
    renderComposerControls();
  }

  const panelAction=e.target.closest('[data-panel-action]');
  if(panelAction&&handlePanelAction(panelAction.dataset.panelAction)) return;
  const panelObject=e.target.closest('[data-panel-object]');
  if(panelObject&&panelSuppressClick){
    panelSuppressClick=false;
    e.preventDefault();
    return;
  }

  const compMenuItem=e.target.closest('[data-comp-menu-value]');
  if(compMenuItem){
    componentDrafts[selectedNavComponent]=Object.assign({}, getComponentTextById(selectedNavComponent), {title:compMenuItem.dataset.compMenuValue});
    componentUi[selectedNavComponent]=Object.assign({tab:0,subTab:0,menu:false}, componentUi[selectedNavComponent]||{}, {menu:false});
    renderComponentState();
    return;
  }

  const compAction=e.target.closest('[data-comp-action]');
  if(compAction){
    const ui=componentUi[selectedNavComponent] || (componentUi[selectedNavComponent]={tab:0,subTab:0,menu:false});
    if(compAction.dataset.compAction==='toggle-menu') ui.menu=!ui.menu;
    renderComponentPhone();
    if(window.lucide) window.lucide.createIcons();
    scale();
    return;
  }

  const compTab=e.target.closest('[data-comp-tab]');
  if(compTab&&!e.target.closest('[contenteditable="true"]')){
    const ui=componentUi[selectedNavComponent] || (componentUi[selectedNavComponent]={tab:0,subTab:0,menu:false});
    if(compTab.dataset.compTab==='tabs') ui.tab=Number(compTab.dataset.compIndex)||0;
    if(compTab.dataset.compTab==='subTabs') ui.subTab=Number(compTab.dataset.compIndex)||0;
    if(compTab.dataset.compTab==='tabbar'){
      const tui=componentUi['tabbar-main'] || (componentUi['tabbar-main']={tab:0,subTab:0,menu:false,tabbar:0});
      tui.tabbar=Number(compTab.dataset.compIndex)||0;
    }
    renderComponentPhone();
    if(window.lucide) window.lucide.createIcons();
    scale();
    return;
  }

  const comp=e.target.closest('[data-component]');
  if(comp&&!comp.dataset.page){chooseComponent(comp.dataset.component);return}

  const di=e.target.closest('.di[data-page]');
  if(di){go(di.dataset.page);return}

  const titem=e.target.closest('.titem[data-page]');
  if(titem){go(titem.dataset.page);return}

  const mact=e.target.closest('[data-mact]');
  if(mact&&!mact.closest('[data-page]')){
    if(dispatchMeetingAction(mact)) return;
  }

  const htab=e.target.closest('[data-htab]');
  if(htab){
    const map=Object.assign({},MARKET_PAGES,{'我的':'mine','服务记录':'my-link','拓客服务':'my-link'});
    go(map[htab.dataset.htab]);return;
  }

  const market=e.target.closest('[data-market-tab]');
  if(market){setMarketTab(market.dataset.marketTab);return}

  const toolDrawerItem=e.target.closest('[data-tool-tab]');
  if(toolDrawerItem){toolTab=toolDrawerItem.dataset.toolTab;drawerOpen=false;go('tools-home');return}

  const stab=e.target.closest('.stab[data-stab]');
  if(stab){
    const p=PAGES[page];
    if(p&&p.tabState==='toolTab') setToolTab(stab.dataset.stab);
    else if(p&&p.tabState==='automationTab') setAutomationTab(stab.dataset.stab);
    else if(p&&p.tabState==='taskTab') setTaskTab(stab.dataset.stab);
    else if(p&&p.tabState==='meetingDetailTab'&&window.setMeetingV113DetailTab) window.setMeetingV113DetailTab(stab.dataset.stab);
    else setWorkTab(stab.dataset.stab);
    return
  }

  const toolSearchTab=e.target.closest('[data-tool-search-tab]');
  if(toolSearchTab){setToolSearchResultTab(toolSearchTab.dataset.toolSearchTab);return}

  const notificationType=e.target.closest('[data-notification-tab]');
  if(notificationType){setNotificationTab(notificationType.dataset.notificationTab);return}

  const meetingPlatform=e.target.closest('[data-meeting-platform]');
  if(meetingPlatform){meetingPlatform.classList.toggle('selected');return}

  const meetingFilter=e.target.closest('[data-mfilter-open]');
  if(meetingFilter){openMeetingFilter(meetingFilter.dataset.mfilterOpen);return}

  const trendingPrompt=e.target.closest('[data-trending-prompt]');
  if(trendingPrompt){useTrendingPrompt(trendingPrompt.dataset.trendingPrompt);return}

  const alice=e.target.closest('[data-alice]');
  if(alice){setChatTarget(alice.dataset.alice);return}

  const project=e.target.closest('[data-project]');
  if(project){setCurrentProject(project.dataset.project, project.dataset.page || (page==='work-dashboard'?'work-detail':''));return}

  const stock=e.target.closest('[data-stock]');
  if(stock){setCurrentStock(stock.dataset.stock, stock.dataset.page || 'stock-quote');return}

  const run=e.target.closest('[data-run-index]');
  if(run){setCurrentRun(run.dataset.runIndex);return}

  const history=e.target.closest('.at-hist[data-page="automation-task-detail"]');
  if(history){taskTab='records';go('automation-task-detail');return}

  const taskCard=e.target.closest('.at-card[data-page="automation-task-detail"]');
  if(taskCard){taskTab='intro';go('automation-task-detail');return}

  const projectChat=e.target.closest('[data-project-chat="existing"]');
  if(projectChat){projectChatIsNew=false;go('work-group-chat');return}

  const pg=e.target.closest('[data-page]:not(.di):not(.titem):not([data-action])');
  if(pg){go(pg.dataset.page);return}

  const action=e.target.closest('[data-action]');
  if(action) dispatchUiAction(action);
});

document.addEventListener('change',e=>{
  if(e.target.id==='composerAttachmentInput'){
    const count=e.target.files?.length||0;
    const attachButton=document.querySelector('#ibar .composer-attach');
    if(attachButton){
      attachButton.classList.toggle('has-attachment',count>0);
      attachButton.setAttribute('aria-label',count>0?`已选择 ${count} 个附件，点击重新选择`:'添加附件');
      attachButton.title=count>0?`已选择 ${count} 个附件`:'添加附件';
    }
    return;
  }
  const select=e.target.closest('[data-mfilter]');
  if(select){
    setMeetingFilter(select.dataset.mfilter,select.value);
  }
});

document.addEventListener('dragstart',e=>{
  const item=e.target.closest('.menu-sort-item');
  if(!item) return;
  draggingMenuIndex=Number(item.dataset.menuIndex);
  item.classList.add('dragging');
  if(e.dataTransfer){
    e.dataTransfer.effectAllowed='move';
    e.dataTransfer.setData('text/plain', String(draggingMenuIndex));
  }
});

document.addEventListener('dragover',e=>{
  const item=e.target.closest('.menu-sort-item');
  if(!item||draggingMenuIndex===null) return;
  e.preventDefault();
  if(e.dataTransfer) e.dataTransfer.dropEffect='move';
});

document.addEventListener('drop',e=>{
  const item=e.target.closest('.menu-sort-item');
  if(!item||draggingMenuIndex===null) return;
  e.preventDefault();
  const targetIndex=Number(item.dataset.menuIndex);
  if(targetIndex!==draggingMenuIndex){
    const [moved]=MENU_ITEMS.splice(draggingMenuIndex,1);
    MENU_ITEMS.splice(targetIndex,0,moved);
  }
  draggingMenuIndex=null;
  render();
});

document.addEventListener('dragend',()=>{
  draggingMenuIndex=null;
  document.querySelectorAll('.menu-sort-item.dragging').forEach(el=>el.classList.remove('dragging'));
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&composerMenu){
    composerMenu='';
    renderComposerControls();
    return;
  }
  const panelObject=e.target.closest?.('[data-panel-object]');
  if(panelObject&&(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10'))){
    e.preventDefault();
    openPanelObjectMenu(panelObject);
    return;
  }
  if(e.key==='Enter'&&e.target.matches?.('[data-panel-rename-input]')){
    handlePanelAction('save-rename');
    return;
  }
  if(e.key==='Escape'&&panelObjectMenu){
    closePanelObjectMenu();
    render();
    return;
  }
  if(e.key==='Escape'&&calOpen){
    calOpen=false;
    render();
    return;
  }
  if(e.key==='Escape'&&meetingFilterOpen){
    meetingFilterOpen=false;
    render();
    return;
  }
  if(e.key==='Escape'&&aiMeetingSheetOpen){
    aiMeetingSheetOpen=false;
    render();
    return;
  }
  if(e.key==='Escape'&&meetingActionMenuOpen){
    meetingActionMenuOpen=false;
    render();
    return;
  }
  if(e.key==='Escape'&&projectActionMenuOpen){
    projectActionMenuOpen=false;
    render();
    return;
  }
  const toolSearchInput=e.target.closest('[data-tool-search-input]');
  if(toolSearchInput&&e.key==='Enter'){
    e.preventDefault();
    submitToolSearch();
  }
});

document.addEventListener('input',e=>{
  if(e.target.id==='ihint'){
    composerText=e.target.value;
    return;
  }
  const toolSearchInput=e.target.closest('[data-tool-search-input]');
  if(toolSearchInput){
    setToolSearchQuery(toolSearchInput.value);
    return;
  }

  const editField=e.target.closest('[data-edit-field]');
  if(editField){
    const targetComponent=editField.dataset.editComponent||activeComponent;
    componentDrafts[targetComponent]=Object.assign({}, getComponentTextById(targetComponent), {[editField.dataset.editField]: editField.textContent.trim()});
    updateComponentControlValues();
    return;
  }

  const editList=e.target.closest('[data-edit-list]');
  if(editList){
    const field=editList.dataset.editList;
    const idx=Number(editList.dataset.editIndex)||0;
    const targetComponent=editList.dataset.editComponent||activeComponent;
    const text=getComponentTextById(targetComponent);
    const list=splitTextList(text[field]);
    list[idx]=editList.textContent.trim();
    componentDrafts[targetComponent]=Object.assign({}, text, {[field]:list.filter(Boolean).join('，')});
    updateComponentControlValues();
    return;
  }

  const field=e.target.closest('[data-comp-field]');
  if(!field) return;
  componentDrafts[activeComponent] = Object.assign({}, getComponentText(), {[field.dataset.compField]: field.value});
  renderComponentPhone();
  if(window.lucide) window.lucide.createIcons();
  scale();
});

document.addEventListener('focusin',e=>{
  const editList=e.target.closest('[data-edit-list]');
  if(!editList) return;
  const targetComponent=editList.dataset.editComponent||activeComponent;
  const ui=componentUi[targetComponent] || (componentUi[targetComponent]={tab:0,subTab:0,menu:false});
  const field=editList.dataset.editList;
  const idx=Number(editList.dataset.editIndex)||0;
  if(field==='tabs') ui.tab=idx;
  if(field==='subTabs') ui.subTab=idx;
  if(field==='tabs'&&targetComponent==='tabbar-main') ui.tabbar=idx;
  const tabKey=(field==='tabs'&&targetComponent==='tabbar-main')?'tabbar':field;
  document.querySelectorAll(`[data-comp-tab="${tabKey}"]`).forEach(el=>el.classList.toggle('active',Number(el.dataset.compIndex)===idx));
});

// ── Voice ──
const vbtn=document.getElementById('voiceHoldButton');
const vover=document.getElementById('vover');
if(vbtn&&vover){
  const startVoice=e=>{
    e.preventDefault();
    if(page.startsWith('meeting-')&&window.openMeetingV113Chat){
      window.openMeetingV113Chat();
      return;
    }
    vbtn.classList.add('pressed');
    vover.classList.add('show');
  };
  const stopVoice=()=>{vbtn.classList.remove('pressed');vover.classList.remove('show')};
  vbtn.addEventListener('pointerdown',startVoice);
  document.addEventListener('pointerup',stopVoice);
  document.addEventListener('pointercancel',stopVoice);
}

// ── Scale ──
function scale(){
  const demoPhone=document.getElementById('phone');
  const demoPanel=document.querySelector('#demoView .center-panel');
  if(demoPhone&&demoPanel){
    const s=Math.min(1,Math.min((demoPanel.clientHeight-84)/812,(demoPanel.clientWidth-40)/375));
    demoPhone.style.transform=`scale(${s})`;
  }
  const compPhone=document.getElementById('compPhone');
  const compPanel=document.querySelector('#componentView .cl-strip');
  if(compPhone&&compPanel){
    const s=Math.min(1,Math.min((compPanel.clientHeight-24)/812,(compPanel.clientWidth-40)/375));
    compPhone.style.transform=`scale(${s})`;
  }
}
window.addEventListener('resize',scale);
scale();

// ── Init ──
document.getElementById('ca').addEventListener('scroll',handleContentScroll,{passive:true});
render();
renderAppMode();
