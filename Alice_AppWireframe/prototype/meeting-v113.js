(() => {
  const TABS={all:'全部',today:'今日',near3:'近三天',custom:'自定义'};
  const DETAIL_TABS={back:'<',minutes:'会议纪要',transcript:'录音转记',media:'音/视频观看',change:'边际变化'};
  const TODAY='2026-09-03';
  const records=[
    {id:'mtg_catl',title:'宁德时代 2026 中期业绩说明会',date:TODAY,dateText:'今天 · 9月3日 周四',time:'09:30 - 10:30',status:'bookable',source:'万得路演',topic:'新能源',type:'业绩会',industry:'电力设备',org:'上市公司',venue:'万得路演平台 · 线上',people:'管理层 + 卖方 320 人',priority:'重点持仓',summary:'验证海外产能爬坡、储能订单和毛利率修复是否兑现，是组合第一大重仓的关键跟踪会议。',highlights:['海外订单能见度提升，欧洲工厂产能利用率预计在四季度进入修复区间。','储能大单交付节奏前移，但价格条款仍是毛利率弹性的主要分歧。','固态电池中试线披露更积极，需要评估对现有产线折旧周期的影响。'],todos:['更新海外产能利用率假设','把储能大单交付节奏同步到组合跟踪表','追踪固态电池中试线披露口径']},
    {id:'mtg_li_auto',title:'理想汽车智能座舱闭门交流',date:TODAY,dateText:'今天 · 9月3日 周四',time:'10:45 - 11:30',status:'live',source:'Zoom 私会',topic:'AI广告',type:'专家会议',industry:'汽车',org:'专家网络',venue:'Zoom · 私密会议',people:'智能座舱产品专家 + 你',priority:'高优先级',summary:'聚焦车载大模型、座舱交互和商业化入口，判断软件体验是否带来新一轮估值溢价。'},
    {id:'mtg_juliang',title:'巨量引擎 AI 广告投放效率交流',date:TODAY,dateText:'今天 · 9月3日 周四',time:'11:40 - 12:30',status:'bookable',source:'路演广场',topic:'AI广告',type:'路演会议',industry:'传媒',org:'上市公司',venue:'万得路演平台 · 线上',people:'商业化团队 + 机构投资者',priority:'主题跟踪',summary:'跟踪 AIGC 创意生成、投放 ROI 和广告主预算迁移，对互联网平台收入弹性形成判断。'},
    {id:'mtg_muyuan',title:'牧原股份猪价周期跟踪电话会',date:TODAY,dateText:'今天 · 9月3日 周四',time:'13:30 - 14:20',status:'replay',source:'万得路演',topic:'猪周期',type:'业绩会',industry:'农林牧渔',org:'上市公司',venue:'电话会议 · 已回放',people:'公司 IR + 农业首席',priority:'周期验证',summary:'验证能繁母猪去化、成本下降和现金流修复节奏，判断猪周期右侧确认度。'},
    {id:'mtg_zijin',title:'紫金矿业黄金成本曲线交流',date:TODAY,dateText:'今天 · 9月3日 周四',time:'15:00 - 16:00',status:'live',source:'万得路演',topic:'黄金',type:'路演会议',industry:'有色金属',org:'上市公司',venue:'万得路演平台 · 直播中',people:'公司管理层 + 海外矿山专家',priority:'资源品',summary:'围绕金价中枢、海外矿山成本和资本开支节奏，更新黄金资产配置框架。'},
    {id:'mtg_byd',title:'比亚迪海外战略发布会',date:'2026-09-04',dateText:'明天 · 9月4日 周五',time:'09:30 - 10:50',status:'replay',source:'万得路演',topic:'新能源',type:'业绩会',industry:'汽车',org:'上市公司',venue:'万得路演平台 · 回放',people:'高管团队 + 卖方 260 人',priority:'重点持仓',summary:'海外本地化生产、KD 组装和单车盈利是核心信息，已自动生成纪要并归档至新能源知识域。'},
    {id:'mtg_wenshi',title:'温氏股份出栏节奏专家会',date:'2026-09-04',dateText:'明天 · 9月4日 周五',time:'14:00 - 15:00',status:'live',source:'专家网络',topic:'猪周期',type:'专家会议',industry:'农林牧渔',org:'上市公司',venue:'Zoom · 直播中',people:'养殖专家 + 农业研究员',priority:'周期验证',summary:'对比行业出栏节奏、仔猪补栏和饲料成本，验证猪价上行持续性。'},
    {id:'mtg_macro',title:'财政政策与流动性展望',date:'2026-09-05',dateText:'9月5日 周六',time:'10:30 - 11:30',status:'bookable',source:'券商电话会',topic:'宏观',type:'专家会议',industry:'宏观',org:'卖方机构',venue:'电话会议',people:'宏观首席 + 策略团队',priority:'政策跟踪',summary:'梳理财政发力节奏、流动性投放和权益风险偏好的边际变化。'},
    {id:'mtg_ai_chip',title:'AI听会 · 半导体设备国产化专家交流',date:'2026-09-07',dateText:'9月7日 周一',time:'18:30 - 19:20',status:'live',source:'AI听会',topic:'半导体',type:'专家会议',industry:'电子',org:'专家网络',venue:'AI听会机器人 · 直播中',people:'设备产业专家 + 研究员',priority:'AI听会',aiListen:true,summary:'由 AI 听会机器人代入会场，实时转写国产设备验证进度、订单节奏和客户导入变化。'},
    {id:'mtg_ai_replay',title:'AI听会 · 创新药出海 BD 复盘会',date:'2026-09-02',dateText:'9月2日 周三',time:'19:00 - 20:10',status:'replay',source:'AI听会',topic:'医药出海',type:'专家会议',industry:'医药生物',org:'专家网络',venue:'AI听会机器人 · 已回放',people:'BD 专家 + 医药研究员',priority:'AI听会',aiListen:true,summary:'复盘近期创新药授权交易条款变化，提炼首付款、里程碑和区域权益的边际变化。'}
  ];
  const uploads=[
    {id:'mtg_upload_review',title:'华宝内部投委会9月持仓评审录音',date:'2026-09-02',dateText:'9月2日 周三',time:'11:20:05',status:'file',source:'录音上传',topic:'内部投委会',type:'录音文件',industry:'组合管理',org:'内部会议',venue:'本地上传 · m4a',people:'成长组 + 风控',priority:'录音上传',summary:'围绕新能源、AI 广告和黄金仓位展开复盘，录音已转写 72%，待生成正式纪要。'},
    {id:'mtg_upload_ai',title:'AI算力产业链闭门会录音',date:'2026-09-01',dateText:'9月1日 周二',time:'16:42:18',status:'file',source:'录音上传',topic:'AI算力',type:'录音文件',industry:'通信',org:'本地文件',venue:'本地上传 · wav',people:'外部专家访谈',priority:'录音上传',summary:'录音包含光模块、GPU 供给和云厂商资本开支线索，已进入会议资料待处理队列。'},
    {id:'mtg_upload_bond',title:'固收组合久期调整讨论录音',date:'2026-08-29',dateText:'8月29日 周六',time:'09:08:33',status:'file',source:'录音上传',topic:'固收',type:'录音文件',industry:'固收',org:'内部会议',venue:'本地上传 · m4a',people:'固收组 + 风控',priority:'录音上传',summary:'围绕收益率曲线、信用利差和组合久期调整展开讨论，已完成转写并生成可编辑纪要。'}
  ];
  const network=[
    {id:'mtg_net_nvda',title:'海外云厂商资本开支与 GPU 供需电话会',date:'2026-09-07',dateText:'9月7日 周一',time:'08:30 - 09:15',status:'replay',source:'网络资源',topic:'AI算力',type:'路演会议',industry:'通信',org:'海外机构',venue:'网络资源 · 回放',people:'海外云厂商专家 + 卖方研究员',priority:'网络资源',summary:'梳理北美云厂商 GPU 采购节奏、网络设备升级和资本开支口径变化。'},
    {id:'mtg_net_consumer',title:'消费电子产业交流 · 端侧 AI 新品观察',date:'2026-09-06',dateText:'9月6日 周日',time:'20:00 - 21:00',status:'replay',source:'网络资源',topic:'消费电子',type:'专家会议',industry:'电子',org:'公开会议',venue:'网络资源 · 已回放',people:'产业链专家 + 消费电子研究员',priority:'网络资源',summary:'围绕端侧 AI 手机、MR 供应链和零部件库存周期更新产业链观察。'},
    {id:'mtg_net_policy',title:'政策稳增长与基建资金网络研讨',date:'2026-09-05',dateText:'9月5日 周六',time:'19:30 - 20:30',status:'bookable',source:'网络资源',topic:'宏观',type:'路演会议',industry:'宏观',org:'公开会议',venue:'网络资源 · 可预约',people:'宏观首席 + 机构投资者',priority:'网络资源',summary:'跟踪政策稳增长节奏、专项债发行和基建实物工作量变化。'}
  ];

  let listMode='list';
  let timeMode='all';
  let calendarYear=2026;
  let calendarMonth=9;
  let yearPickerOpen=false;
  let customStart=TODAY;
  let customEnd='2026-09-07';
  let listFilter=null;
  let selectedId='mtg_li_auto';
  let returnPage='meeting-home';
  let detailTab='minutes';
  let favorites=['mtg_ai_replay'];
  let booked=[];
  let sheet=null;
  let toast='';
  let toastTimer=null;
  let chatMessages=[];
  let chatHistory=[
    {id:'hist_prepare',title:'宁德时代业绩会会前准备',time:'昨天 20:05',messages:[{role:'user',text:'生成会前调研清单'},{role:'assistant',text:'已整理海外产能、储能订单、毛利率修复三组会前追问。'}]},
    {id:'hist_change',title:'AI广告素材会议边际变化',time:'今天 16:20',messages:[{role:'user',text:'调用边际变化'},{role:'assistant',text:'本次新增关注素材生成成本下降，但预算迁移节奏仍需和广告主反馈交叉验证。'}]}
  ];

  const icon=name=>`<i data-lucide="${name}"></i>`;
  const pad=n=>String(Number(n)||1).padStart(2,'0');
  const addDays=(date,delta)=>{const d=new Date(`${date}T00:00:00`);d.setDate(d.getDate()+delta);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  const kindFromPage=(pg=page)=>pg==='meeting-all'?'all':pg==='meeting-upload'?'uploads':'my';
  const pageForKind=kind=>kind==='all'?'meeting-all':kind==='uploads'?'meeting-upload':'meeting-home';
  const allRecords=()=>records.concat(network,uploads);
  const baseRecords=()=>records.concat(network);
  const byId=id=>allRecords().find(item=>item.id===id)||records[0];
  const statusMeta=status=>({
    bookable:{label:'可预约',cls:'bookable'},live:{label:'直播中',cls:'live'},
    replay:{label:'回放',cls:'replay'},file:{label:'文件',cls:'file'}
  }[status]||{label:'会议',cls:'file'});
  const sortValue=item=>new Date(`${item.date}T${String(item.time||'00:00').slice(0,5)}:00`).getTime();
  const sorted=list=>list.slice().sort((a,b)=>sortValue(b)-sortValue(a)||a.title.localeCompare(b.title,'zh-CN'));
  const isFavorite=id=>favorites.includes(id)||booked.includes(id);
  const myCategory=kind=>{
    if(kind==='booked') return records.filter(item=>item.status==='bookable'||booked.includes(item.id));
    if(kind==='favorite') return baseRecords().filter(item=>favorites.includes(item.id));
    if(kind==='ai') return records.filter(item=>item.aiListen||item.source==='AI听会');
    return records.filter(item=>item.source==='AI听会'||/Zoom|专家网络|券商电话会/.test(item.source)||isFavorite(item.id));
  };
  const myRecords=()=>{
    const seen=new Set();
    return sorted(['mine','booked','favorite','ai'].flatMap(myCategory).filter(item=>!seen.has(item.id)&&seen.add(item.id)));
  };
  const recordsForKind=kind=>{
    if(kind==='uploads') return sorted(uploads);
    if(kind==='my') return myRecords();
    let result=baseRecords();
    if(listFilter) result=result.filter(item=>item[listFilter.type]===listFilter.value);
    return sorted(result);
  };
  const applyTime=list=>{
    if(timeMode==='today') return list.filter(item=>item.date===TODAY);
    if(timeMode==='near3') return list.filter(item=>item.date>=addDays(TODAY,-2)&&item.date<=TODAY);
    if(timeMode==='custom') return list.filter(item=>item.date>=customStart&&item.date<=customEnd);
    return list;
  };

  function toolbar(){
    const left=listMode==='calendar'?calendarYear:`${calendarMonth}月`;
    const action=listMode==='calendar'?'meeting-v113-toggle-year':'meeting-v113-toggle-calendar';
    const filters=listMode==='calendar'?'':`<div class="mtg-filter-tabs">${Object.entries(TABS).map(([key,label])=>`<button class="mtg-filter-tab${timeMode===key?' active':''}" data-action="meeting-v113-time" data-value="${key}">${label}</button>`).join('')}</div>`;
    return `<div class="mtg-toolbar"><button class="mtg-month-btn" data-action="${action}">&lt; ${left}</button>${filters}</div>`;
  }
  function row(item){
    const meta=statusMeta(item.status);
    return `<article class="mtg-row" data-action="meeting-v113-open" data-id="${item.id}">
      <div class="mtg-row-title">${escapeHtml(item.title)}</div>
      <div class="mtg-row-meta"><span>${escapeHtml(item.time)}</span><span class="mtg-status ${meta.cls}">${meta.label}</span></div>
      <button class="mtg-star${isFavorite(item.id)?' active':''}" data-action="meeting-v113-star" data-id="${item.id}" aria-label="星标">${icon('star')}</button>
    </article>`;
  }
  function groupedRows(list){
    if(!list.length) return '<div class="mtg-empty">暂无匹配会议</div>';
    const groups=new Map();
    sorted(list).forEach(item=>{const key=item.dateText||item.date;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item)});
    return `<div class="mtg-list">${[...groups].map(([label,items])=>`<section class="mtg-day-block" data-meeting-date="${items[0].date}"><div class="mtg-day-title"><b>${escapeHtml(label)}</b><span class="mtg-day-count">（${items.length}场）</span></div>${items.map(row).join('')}</section>`).join('')}</div>`;
  }
  function calendar(list){
    const month=`${calendarYear}-${pad(calendarMonth)}`;
    const first=new Date(`${month}-01T00:00:00`);
    const offset=(first.getDay()+6)%7;
    const total=new Date(calendarYear,calendarMonth,0).getDate();
    const map={};
    list.forEach(item=>(map[item.date]||(map[item.date]=[])).push(item));
    let grid=['一','二','三','四','五','六','日'].map(day=>`<div class="mtg-dow">${day}</div>`).join('');
    for(let i=0;i<offset;i++) grid+='<div class="mtg-cal-cell muted"></div>';
    for(let day=1;day<=total;day++){
      const date=`${month}-${pad(day)}`,items=sorted(map[date]||[]),shown=items.slice(0,2);
      grid+=`<div class="mtg-cal-cell${date===TODAY?' today':''}" data-action="meeting-v113-date" data-date="${date}"><div class="mtg-cal-date">${day}</div><div class="mtg-cal-items">${shown.map(item=>`<div class="mtg-cal-tag ${statusMeta(item.status).cls}">${escapeHtml(item.title)}</div>`).join('')}${items.length>2?`<div class="mtg-cal-more">更多...（${items.length}场）</div>`:''}</div></div>`;
    }
    return `<div class="mtg-calendar"><div class="mtg-calendar-grid">${grid}</div></div>`;
  }
  function miniMonth(year,month,dates){
    const prefix=`${year}-${pad(month)}`;
    const first=new Date(`${prefix}-01T00:00:00`);
    const offset=(first.getDay()+6)%7;
    const total=new Date(year,month,0).getDate();
    let cells='<span class="mtg-mini-day"></span>'.repeat(offset);
    for(let day=1;day<=total;day++){
      const date=`${prefix}-${pad(day)}`;
      cells+=`<span class="mtg-mini-day${dates.has(date)?' has':''}${date===TODAY?' today':''}">${day}</span>`;
    }
    return `<div class="mtg-year-month${year===calendarYear&&month===calendarMonth?' active':''}" data-action="meeting-v113-month" data-year="${year}" data-month="${month}"><div class="mtg-year-month-name">${month}月</div><div class="mtg-mini-grid">${cells}</div></div>`;
  }
  function yearCalendar(list){
    const dates=new Set(list.map(item=>item.date));
    return `<div class="mtg-year-calendar"><div class="mtg-year-stack">${[calendarYear-1,calendarYear,calendarYear+1].map(year=>`<section><div class="mtg-year-title">${year}</div><div class="mtg-year-grid">${Array.from({length:12},(_,i)=>miniMonth(year,i+1,dates)).join('')}</div></section>`).join('')}</div></div>`;
  }
  function listPage(kind){
    const all=recordsForKind(kind);
    const body=listMode==='calendar'?(yearPickerOpen?yearCalendar(all):calendar(all)):groupedRows(applyTime(all));
    return `<div class="mtg-shell">${toolbar()}${body}</div>`;
  }

  function drawerObject(obj){
    if(obj.id) return `<div class="dr-it mtg-drawer-object" data-action="meeting-v113-open" data-id="${obj.id}">${escapeHtml(obj.name)}</div>`;
    return `<div class="dr-it mtg-drawer-object" data-action="meeting-v113-filter" data-filter-type="${obj.type}" data-filter-value="${escapeAttr(obj.value)}">${escapeHtml(obj.name)}</div>`;
  }
  const recordObjects=list=>sorted(list).slice(0,10).map(item=>({name:item.title,id:item.id}));
  function drawerCatalog(){
    return [
      {key:'my',name:'我的参会',categories:[
        {name:'我的会议',objects:recordObjects(myCategory('mine'))},
        {name:'已预约会议',objects:recordObjects(myCategory('booked'))},
        {name:'已收藏会议',objects:recordObjects(myCategory('favorite'))},
        {name:'AI听会',objects:recordObjects(myCategory('ai'))}
      ]},
      {key:'all',name:'全部会议',categories:[
        {name:'会议状态',objects:[{name:'预约路演',type:'status',value:'bookable'},{name:'正在直播',type:'status',value:'live'},{name:'精彩回放',type:'status',value:'replay'},{name:'网络资源',type:'source',value:'网络资源'}]},
        {name:'热门主题',objects:[{name:'AI广告',type:'topic',value:'AI广告'},{name:'新能源',type:'topic',value:'新能源'},{name:'猪周期',type:'topic',value:'猪周期'},{name:'黄金',type:'topic',value:'黄金'}]},
        {name:'会议类型',objects:[{name:'业绩会',type:'type',value:'业绩会'},{name:'路演会议',type:'type',value:'路演会议'},{name:'专家会议',type:'type',value:'专家会议'}]},
        {name:'行业分类',objects:[{name:'宏观',type:'industry',value:'宏观'},{name:'电子',type:'industry',value:'电子'},{name:'固收',type:'industry',value:'固收'},{name:'农林牧渔',type:'industry',value:'农林牧渔'}]}
      ]},
      {key:'uploads',name:'录音上传',objects:recordObjects(uploads)}
    ];
  }
  function drawerBody(activeKind){
    return drawerCatalog().map(group=>{
      let html=`<div class="dr-project mtg-drawer-head${group.key===activeKind?' active':''}" data-action="meeting-v113-drawer" data-kind="${group.key}"><span>${group.name}</span></div>`;
      if(group.key===activeKind&&group.categories) html+=group.categories.map(category=>`<div class="dr-sl">${category.name}</div>${category.objects.map(drawerObject).join('')}`).join('');
      if(group.key===activeKind&&group.objects) html+=group.objects.map(drawerObject).join('');
      return html;
    }).join('');
  }
  function meetingDrawer(kind){
    return {title:'会议',action:{label:kind==='uploads'?'+ 录音上传':'+ AI听会',action:'meeting-v113-add'},body:()=>drawerBody(kind)};
  }
  function listStates(){
    return [
      state('会议抽屉',[{t:'我的参会',pg:'meeting-home'},{t:'全部会议',pg:'meeting-all'},{t:'录音上传',pg:'meeting-upload'}]),
      state('展示方式',[{t:'会议列表',sk:'meetingV113Mode',sv:'list'},{t:'日历模式',sk:'meetingV113Mode',sv:'calendar'}]),
      drawerState()
    ];
  }

  function transcript(item){
    return [
      ['主持人',`欢迎各位参加「${item.title}」。本场会议围绕 ${item.topic} 和 ${item.industry} 板块的最新变化展开。`,'00:18'],
      ['管理层',`${item.summary} 这个判断背后既有需求端恢复，也有供应链、价格和费用投放节奏的变化。`,'03:24'],
      ['卖方提问',`${item.topic} 相关业务在下半年是否会出现明显边际改善？`,'08:45'],
      ['管理层','我们的排序是先保证高质量交付，再看收入节奏。短期不会为了规模牺牲现金流。','10:08'],
      ['研究员','会后会把本次会议口径与过去两次纪要交叉对比，重点标记和模型假设不一致的地方。','33:15']
    ];
  }
  function detailBody(item){
    if(detailTab==='transcript') return `<div class="mtg-transcript">${transcript(item).map(line=>`<div class="mtg-tr-line"><span class="mtg-tr-who">${escapeHtml(line[0])}</span><span class="mtg-tr-text">${escapeHtml(line[1])}</span><span class="mtg-tr-time">${line[2]}</span></div>`).join('')}</div>`;
    if(detailTab==='media') return `<div class="mtg-media-card"><div class="mtg-video-box">${icon(item.status==='file'?'volume-2':'play')}</div><div class="mtg-progress"><i></i></div><div class="mtg-progress-meta"><span>00:18</span><span>38:42</span></div></div><div class="mtg-section-title">同步转写</div><div class="mtg-transcript">${transcript(item).map(line=>`<div class="mtg-tr-line"><span class="mtg-tr-who">${escapeHtml(line[0])}</span><span class="mtg-tr-text">${escapeHtml(line[1])}</span><span class="mtg-tr-time">${line[2]}</span></div>`).join('')}</div>`;
    if(detailTab==='change') return `<div class="mtg-note-card"><b>经营口径更谨慎</b><p>本次交流更强调现金流质量和订单兑现节奏，对单纯收入规模的表述明显收敛。</p></div><div class="mtg-note-card"><b>模型变量更清晰</b><p>可进入模型的变量集中在交付节奏、成本压力缓和、费用投放效率和价格条款四个方向。</p></div><div class="mtg-note-card"><b>风险验证前置</b><p>会议反复提到回款质量和客户结构，仓位调整需要等待高频数据继续确认。</p></div>`;
    const highlights=item.highlights||[item.summary,'本次会议口径较上次更强调经营质量和现金流，需继续核验数据来源。','建议与模型假设、持仓比例和风险阈值联动更新。'];
    const points=[['会议背景',`本次会议聚焦「${item.title}」，核心是验证 ${item.topic} 相关业务的边际变化。`],['经营变化',`当前 ${item.industry} 需求恢复并不均衡，优质客户和高确定性项目先恢复。`],['关键数据','可进入模型的变量包括订单兑现节奏、价格条款、成本压力缓和和费用投放效率。'],['投资启示',`这次会议提高了「${item.priority}」方向的跟踪优先级。`]];
    return `<div class="mtg-note-card"><b>一分钟速读</b><ul>${highlights.map(text=>`<li>${escapeHtml(text)}</li>`).join('')}</ul></div><div class="mtg-section-title">会议纪要要点</div>${points.map(point=>`<div class="mtg-note-card"><b>${escapeHtml(point[0])}</b><p>${escapeHtml(point[1])}</p></div>`).join('')}<div class="mtg-section-title">Todo / Follow-up</div>${(item.todos||['更新会议纪要并归档知识库','核验核心数据来源','同步给相关研究专家继续跟踪']).map(text=>`<div class="mtg-note-card"><b>${escapeHtml(text)}</b><p>温妮建议 · 本周内处理</p></div>`).join('')}`;
  }
  function detailPage(){
    const item=byId(selectedId),meta=statusMeta(item.status);
    return `<div class="mtg-detail"><div class="mtg-detail-hero"><div class="mtg-detail-title">${escapeHtml(item.title)}</div><div class="mtg-detail-meta"><span>${escapeHtml(item.dateText||item.date)}</span><span>${escapeHtml(item.time)}</span><span class="mtg-status ${meta.cls}">${meta.label}</span></div></div><div class="mtg-detail-body">${detailBody(item)}</div></div>`;
  }

  ACTIONS.meetingV113Add={title:'新建',icon:'plus',action:'meeting-v113-add'};
  ACTIONS.meetingV113Search={title:'搜索',icon:'search',action:'meeting-v113-search'};
  ACTIONS.meetingV113Copy={title:'复制',icon:'copy',action:'meeting-v113-copy'};
  ACTIONS.meetingV113Download={title:'下载',icon:'download',action:'meeting-v113-download'};
  ACTIONS.meetingV113Star={title:'星标',icon:'star',action:'meeting-v113-star-current'};
  ACTIONS.meetingV113Folder={title:'添加到文件夹',icon:'folder-plus',action:'meeting-v113-folder'};

  PAGES['meeting-home']={level:1,navType:'1-D',tba:'mine',nav:'meeting',title:'会议',navActions:actions('meetingV113Add','meetingV113Search'),ibar:false,ihint:'问会议小助手…',tbar:true,sec:false,content:()=>listPage('my'),drawer:meetingDrawer('my'),states:listStates()};
  PAGES['meeting-all']={level:1,navType:'1-D',tba:'mine',nav:'meeting',title:'会议',navActions:actions('meetingV113Add','meetingV113Search'),ibar:false,ihint:'问会议小助手…',tbar:true,sec:false,content:()=>listPage('all'),drawer:meetingDrawer('all'),states:listStates()};
  PAGES['meeting-upload']={level:1,navType:'1-D',tba:'mine',nav:'meeting',title:'会议',navActions:actions('meetingV113Add','meetingV113Search'),ibar:false,ihint:'问会议小助手…',tbar:true,sec:false,content:()=>listPage('uploads'),drawer:meetingDrawer('uploads'),states:listStates()};
  PAGES['meeting-detail']={level:3,navType:'3-A',tba:'mine',nav:'back',title:'会议',hideTopBack:true,backPage:'meeting-home',navActions:actions('meetingV113Search','meetingV113Copy','meetingV113Download','meetingV113Star','meetingV113Folder'),ibar:false,ihint:'问会议小助手…',tbar:true,sec:true,secTabs:DETAIL_TABS,tabState:'meetingDetailTab',content:detailPage,drawer:meetingDrawer(kindFromPage(returnPage)),states:[state('详情内容',[{t:'返回',sk:'meetingV113Detail',sv:'back'},{t:'会议纪要',sk:'meetingV113Detail',sv:'minutes'},{t:'录音转记',sk:'meetingV113Detail',sv:'transcript'},{t:'音/视频观看',sk:'meetingV113Detail',sv:'media'},{t:'边际变化',sk:'meetingV113Detail',sv:'change'}]),drawerState()]};

  function showToast(text){
    toast=text;
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>{toast='';renderMeetingV113()},1400);
  }
  function openDetail(id){
    selectedId=id;
    returnPage=page.startsWith('meeting-')&&page!=='meeting-detail'?page:returnPage;
    detailTab='minutes';
    PAGES['meeting-detail'].drawer=meetingDrawer(kindFromPage(returnPage));
    sheet=null;
    go('meeting-detail');
  }
  function toggleStar(id){
    const item=byId(id);
    const target=item.status==='bookable'?booked:favorites;
    const index=target.indexOf(id);
    if(index>=0){target.splice(index,1);showToast(item.status==='bookable'?'已取消预约':'已取消收藏')}
    else{target.push(id);showToast(item.status==='bookable'?'已存入已预约会议':'已存入收藏会议')}
    render();
  }
  function setDetailTab(value){
    if(value==='back'){sheet=null;go(returnPage||'meeting-home');return}
    detailTab=value;
    window.meetingV113DetailTab=value;
    render();
  }
  window.setMeetingV113DetailTab=setDetailTab;
  window.meetingV113DetailTab=detailTab;
  window.setMeetingV113Mode=value=>{listMode=value;yearPickerOpen=false;window.meetingV113Mode=value;render()};
  window.meetingV113Mode=listMode;

  function dateOptions(){
    const dates=allRecords().map(item=>item.date).concat(customStart,customEnd).sort();
    const out=[];
    for(let date=addDays(dates[0],-7);date<=addDays(dates[dates.length-1],7);date=addDays(date,1)) out.push(date);
    return out;
  }
  const dateLabel=date=>{const d=new Date(`${date}T00:00:00`);return `${d.getMonth()+1}月${d.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][d.getDay()]}`};
  function chatReply(text){
    if(/边际|变化/.test(text)) return '已提炼三类边际变化：需求端订单能见度延长；成本端原材料压力缓和；风险端客户预算节奏仍需后续路演验证。';
    if(/待办|清单/.test(text)) return '已形成待办：核对交付节奏、追踪核心客户预算变化、更新利润率假设并标注敏感项。';
    if(/问题|提问/.test(text)) return '建议重点追问订单转化率、产能瓶颈、价格传导、海外客户验证进度，以及本轮指引与上季口径的差异。';
    return '已按投研纪要格式整理：核心结论、证据链、与前次认知差异、风险提示和后续跟踪事项。';
  }
  function chatHtml(){
    const cases=[
      ['生成会议纪要','整理结论、分歧、风险点','请把当前会议整理成投研纪要。'],
      ['提炼边际变化','找出新增、反转与超预期信息','请提炼这场会议相对上次跟踪的边际变化。'],
      ['形成会后待办','拆成调研追问和组合动作','请把会议内容转成会后待办清单。'],
      ['准备参会问题','按产业链和财务线索追问','请基于当前会议主题准备5个高质量提问。']
    ];
    const intro=chatMessages.length?'':`<div class="mtg-chat-greeting">hello~，我是您的会议小助手，请给我派活吧。</div><div class="mtg-case-grid">${cases.map(item=>`<button class="mtg-case-card" data-action="meeting-v113-chat-case" data-prompt="${escapeAttr(item[2])}"><b>${item[0]}</b><span>${item[1]}</span></button>`).join('')}</div>`;
    const messages=chatMessages.map(item=>`<div class="mtg-msg ${item.role==='user'?'user':'assistant'}"><div class="mtg-msg-bubble">${escapeHtml(item.text)}</div></div>`).join('');
    return `<div class="mtg-chat-body"><div class="mtg-chat-scroll">${intro}${messages}</div><div class="mtg-chat-composer"><div class="mtg-chat-input" contenteditable="true" data-placeholder="给会议小助手派活…"></div><button class="mtg-chat-send" data-action="meeting-v113-chat-send">${icon('arrow-up')}</button></div></div>`;
  }
  function chatHeader(history=false){
    return `<span>${history?'对话历史':'会议小助手'}</span><div class="mtg-chat-head-actions"><button class="mtg-chat-icon" data-action="meeting-v113-new-chat">${icon('plus')}</button><button class="mtg-chat-icon${history?' active':''}" data-action="meeting-v113-chat-history">${icon('history')}</button></div>`;
  }
  function historyHtml(){
    return `<div class="mtg-history-list">${chatHistory.map(item=>`<button class="mtg-history-item" data-action="meeting-v113-history-open" data-id="${item.id}"><b>${escapeHtml(item.title)}</b><span>${escapeHtml(item.time)} · ${escapeHtml(item.messages[0]?.text||'会议对话')}</span></button>`).join('')}</div>`;
  }
  function openChat(){sheet={type:'chat'};drawerOpen=false;kb='hidden';render()}
  window.openMeetingV113Chat=openChat;
  function sendChat(text){
    const prompt=(text||'请整理当前会议的重点结论').trim();
    chatMessages.push({role:'user',text:prompt},{role:'assistant',text:chatReply(prompt)});
    sheet={type:'chat'};render();
  }

  function renderSheet(){
    const root=document.getElementById('meetingV113Sheet');
    const title=document.getElementById('meetingV113SheetTitle');
    const body=document.getElementById('meetingV113SheetBody');
    if(!root||!title||!body) return;
    if(!sheet||!page.startsWith('meeting-')){
      root.classList.remove('open','mtg-chat-sheet','mtg-date-sheet');
      title.textContent='';body.innerHTML='';return;
    }
    root.classList.add('open');
    root.classList.toggle('mtg-chat-sheet',sheet.type==='chat'||sheet.type==='history');
    root.classList.toggle('mtg-date-sheet',sheet.type==='date');
    if(sheet.type==='chat'){title.innerHTML=chatHeader();body.innerHTML=chatHtml();requestAnimationFrame(()=>{const el=body.querySelector('.mtg-chat-scroll');if(el)el.scrollTop=el.scrollHeight});return}
    if(sheet.type==='history'){title.innerHTML=chatHeader(true);body.innerHTML=historyHtml();return}
    if(sheet.type==='upload'){
      title.textContent='录音上传';
      body.innerHTML='<div class="mtg-sheet-field">选择或拖入本地录音文件，支持 m4a、mp3、wav。上传后自动进入转写、纪要生成和边际变化提取流程。</div><div class="mtg-sheet-tip">示例：华宝内部投委会9月持仓评审录音.m4a</div><div class="mtg-sheet-actions"><button class="mtg-sheet-btn" data-action="meeting-v113-close-sheet">取消</button><button class="mtg-sheet-btn primary" data-action="meeting-v113-create-upload">开始上传</button></div>';return;
    }
    if(sheet.type==='download'){
      title.textContent='下载纪要';
      body.innerHTML=['Word','PDF','Markdown'].map(format=>`<div class="mtg-format-row" data-action="meeting-v113-download-format" data-format="${format}">${icon(format==='PDF'?'file-type-2':'file-text')}<span>${format}</span></div>`).join('');return;
    }
    if(sheet.type==='folder'){
      title.textContent='添加到文件夹';
      body.innerHTML=['信用债合规资料','市场热议素材库','客户路演资料'].map(folder=>`<div class="mtg-folder-row" data-action="meeting-v113-folder-pick" data-folder="${folder}">${icon('folder')}<span>${folder}</span></div>`).join('');return;
    }
    if(sheet.type==='date'){
      title.textContent='自定义时间';
      const dates=dateOptions();
      const wheel=(label,key,active)=>`<div class="mtg-wheel"><div class="mtg-wheel-label">${label}</div><div class="mtg-wheel-list">${dates.map(date=>`<button class="mtg-wheel-item${date===active?' active':''}" data-action="meeting-v113-pick-date" data-boundary="${key}" data-date="${date}">${dateLabel(date)}</button>`).join('')}</div></div>`;
      body.innerHTML=`<div class="mtg-wheel-wrap">${wheel('起始','start',customStart)}${wheel('结束','end',customEnd)}</div><div class="mtg-sheet-tip">点击日期选择范围。</div><div class="mtg-sheet-actions"><button class="mtg-sheet-btn" data-action="meeting-v113-close-sheet">取消</button><button class="mtg-sheet-btn primary" data-action="meeting-v113-apply-date">确定</button></div>`;return;
    }
    title.textContent='AI听会';
    body.innerHTML='<div class="mtg-sheet-field">粘贴会议链接、会议号或会议信息。Alice 将在会议开始前创建 AI 听会任务，并在会后沉淀录音转记、会议纪要和边际变化。</div><div class="mtg-sheet-tip">示例：AI听会 · 半导体设备国产化专家交流</div><div class="mtg-sheet-actions"><button class="mtg-sheet-btn" data-action="meeting-v113-close-sheet">取消</button><button class="mtg-sheet-btn primary" data-action="meeting-v113-create-ai">创建AI听会</button></div>';
  }
  function renderMeetingV113(){
    renderSheet();
    const toastEl=document.getElementById('meetingV113Toast');
    if(toastEl){toastEl.textContent=toast;toastEl.classList.toggle('show',!!toast)}
    window.meetingV113DetailTab=detailTab;
    window.meetingV113Mode=listMode;
  }
  window.renderMeetingV113=renderMeetingV113;

  const handlers={
    'meeting-v113-chat':openChat,
    'meeting-v113-add':()=>{sheet={type:kindFromPage()==='uploads'?'upload':'create'};drawerOpen=false;render()},
    'meeting-v113-search':()=>{showToast('已打开会议搜索');renderMeetingV113()},
    'meeting-v113-copy':()=>{showToast('已复制当前纪要内容');renderMeetingV113()},
    'meeting-v113-download':()=>{sheet={type:'download'};render()},
    'meeting-v113-folder':()=>{sheet={type:'folder'};render()},
    'meeting-v113-star-current':()=>toggleStar(selectedId),
    'meeting-v113-open':el=>openDetail(el.dataset.id),
    'meeting-v113-star':el=>toggleStar(el.dataset.id),
    'meeting-v113-drawer':el=>{listFilter=null;listMode='list';yearPickerOpen=false;sheet=null;page=pageForKind(el.dataset.kind);render()},
    'meeting-v113-filter':el=>{listFilter={type:el.dataset.filterType,value:el.dataset.filterValue};listMode='list';timeMode='all';drawerOpen=false;go('meeting-all')},
    'meeting-v113-time':el=>{if(el.dataset.value==='custom')sheet={type:'date'};else{timeMode=el.dataset.value;sheet=null}render()},
    'meeting-v113-toggle-calendar':()=>{listMode=listMode==='calendar'?'list':'calendar';yearPickerOpen=false;render()},
    'meeting-v113-toggle-year':()=>{yearPickerOpen=!yearPickerOpen;render()},
    'meeting-v113-month':el=>{calendarYear=Number(el.dataset.year);calendarMonth=Number(el.dataset.month);yearPickerOpen=false;render()},
    'meeting-v113-date':el=>{listMode='list';timeMode='custom';customStart=el.dataset.date;customEnd=el.dataset.date;render()},
    'meeting-v113-close-sheet':()=>{sheet=null;render()},
    'meeting-v113-pick-date':el=>{if(el.dataset.boundary==='end')customEnd=el.dataset.date;else customStart=el.dataset.date;render()},
    'meeting-v113-apply-date':()=>{if(customStart>customEnd)[customStart,customEnd]=[customEnd,customStart];timeMode='custom';sheet=null;render()},
    'meeting-v113-create-upload':()=>{uploads.unshift({id:`upload_${Date.now()}`,title:'新上传的会议录音',date:'2026-09-07',dateText:'9月7日 周一',time:'18:58:09',status:'file',source:'录音上传',topic:'录音上传',type:'录音文件',industry:'待识别',org:'用户提交',venue:'本地上传 · 音频',people:'录音文件',priority:'录音上传',summary:'已进入转写与纪要生成队列。'});sheet=null;showToast('已新建录音上传任务');go('meeting-upload')},
    'meeting-v113-create-ai':()=>{records.push({id:`ai_${Date.now()}`,title:'AI听会 · 新建会议',date:'2026-09-07',dateText:'9月7日 周一',time:'18:50 - 19:30',status:'bookable',source:'AI听会',topic:'AI听会',type:'AI听会',industry:'待识别',org:'用户提交',venue:'会议链接 · 待接入',people:'AI听会机器人',priority:'AI听会',aiListen:true,summary:'等待会议开始后自动转写。'});sheet=null;showToast('已新建 AI听会会议');go('meeting-home')},
    'meeting-v113-download-format':el=>{sheet=null;showToast(`已选择下载 ${el.dataset.format} 格式`);render()},
    'meeting-v113-folder-pick':el=>{sheet=null;showToast(`已添加到「${el.dataset.folder}」`);render()},
    'meeting-v113-chat-case':el=>sendChat(el.dataset.prompt),
    'meeting-v113-chat-send':()=>sendChat(document.querySelector('#meetingV113Sheet .mtg-chat-input')?.textContent),
    'meeting-v113-new-chat':()=>{if(chatMessages.length){const first=chatMessages.find(item=>item.role==='user')||chatMessages[0];chatHistory.unshift({id:`hist_${Date.now()}`,title:first.text.slice(0,22),time:'刚刚',messages:chatMessages.slice()})}chatMessages=[];sheet={type:'chat'};render()},
    'meeting-v113-chat-history':()=>{sheet={type:'history'};render()},
    'meeting-v113-history-open':el=>{const item=chatHistory.find(history=>history.id===el.dataset.id);chatMessages=item?item.messages.map(message=>({...message})):[];sheet={type:'chat'};render()}
  };

  document.addEventListener('click',event=>{
    const action=event.target.closest('[data-action^="meeting-v113-"]');
    if(!action) return;
    const handler=handlers[action.dataset.action];
    if(handler){event.preventDefault();event.stopImmediatePropagation();handler(action)}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&sheet){sheet=null;render()}
  });

  render();
})();
