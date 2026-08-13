/**
 * @name 好游快爆收入统计
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { defineHashPageRoute, useHashPage } from '../../common/useHashPage';
import calendarIcon from './calendar.svg';
import filterIcon from './filter.svg';
import RechargeStats, { type RechargeStatsPageId } from './RechargeStats';
import './style.css';

type OrderStatus = '成功' | '失败' | '异常';
type DrillType = 'order' | 'total-subsidy' | 'row-subsidy' | null;

function OrderTypeSelect({ value, onChange }: { value: string; onChange: (value:string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const options = [{ value:'mobile-recharge-formal', label:'正式订单' }, { value:'mobile-recharge-test', label:'测试订单' }];
  const selected = options.find((option) => option.value === value) ?? options[0];
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return <div className="kbi-order-type-select" ref={rootRef}>
    <button type="button" aria-label="三级功能" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((visible) => !visible)}><span>{selected.label}</span><i></i></button>
    {open && <div className="kbi-order-type-options" role="listbox">{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} className={option.value === value ? 'is-selected' : ''} key={option.value} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}</div>}
  </div>;
}

type RechargeOrder = {
  time: string;
  orderNo: string;
  gameOrderNo: string;
  gameId: string;
  gameName: string;
  playerId: string;
  playerName: string;
  developerId: string;
  developerName: string;
  status: OrderStatus;
  channel: string;
  rechargeAmount: number;
  subsidyAmount: number;
  couponFace: number;
  couponId: string;
  gameCoins: string;
  zoneId: string;
  callbackValue: string;
};

type PaidDownloadOrder = {
  time: string;
  orderNo: string;
  gameOrderNo: string;
  gameId: string;
  gameName: string;
  playerId: string;
  playerName: string;
  developerId: string;
  developerName: string;
  channel: string;
  purchaseAmount: number;
  subsidyAmount: number;
  couponFace: number;
  couponId: string;
};

const route = defineHashPageRoute([
  { id: 'mobile-recharge-formal', title: '正式订单', group: '手游 / 充值明细' },
  { id: 'mobile-recharge-test', title: '测试订单', group: '手游 / 充值明细' },
  { id: 'mobile-recharge-game-stats', title: '游戏统计', group: '手游 / 充值统计' },
  { id: 'mobile-recharge-developer-stats', title: '开发者统计', group: '手游 / 充值统计' },
  { id: 'mobile-recharge-summary-stats', title: '汇总统计', group: '手游 / 充值统计' },
  { id: 'mobile-paid-download-detail', title: '付费下载明细', group: '手游 / 付费下载明细' },
  { id: 'mobile-paid-download-game-stats', title: '游戏统计', group: '手游 / 付费下载统计' },
  { id: 'mobile-paid-download-developer-stats', title: '开发者统计', group: '手游 / 付费下载统计' },
  { id: 'mobile-paid-download-summary-stats', title: '汇总统计', group: '手游 / 付费下载统计' },
  { id: 'mobile-income-game-stats', title: '游戏统计', group: '手游 / 收入汇总统计' },
  { id: 'mobile-income-developer-stats', title: '开发者统计', group: '手游 / 收入汇总统计' },
  { id: 'pc-recharge-detail', title: '充值明细', group: 'PC 游戏 / 充值明细' },
  { id: 'mini-game-recharge-detail', title: '充值明细', group: '快爆小游戏 / 充值明细' },
], { defaultPageId: 'mobile-recharge-formal' });

const formalOrders: RechargeOrder[] = [
  { time:'2026-08-10 15:23:00', orderNo:'2026081015230054914007', gameOrderNo:'HUA10414714016', gameId:'112516', gameName:'全民枪战2', playerId:'1379637935', playerName:'-', developerId:'100370', developerName:'英雄互娱', status:'成功', channel:'支付宝钱包(手机)', rechargeAmount:60, subsidyAmount:6, couponFace:10, couponId:'KBQ-20260810-0816', gameCoins:'600 钻石', zoneId:'15', callbackValue:'{"status":2,"code":"","money":6,"gamemoney":60,"msg":""}' },
  { time:'2026-08-10 15:22:59', orderNo:'2026081015225916754007', gameOrderNo:'WXS202608105991', gameId:'139782', gameName:'龙族：卡塞尔之门', playerId:'494022485', playerName:'-', developerId:'100895', developerName:'祖龙娱乐', status:'成功', channel:'微信H5(手机)', rechargeAmount:128, subsidyAmount:12.8, couponFace:20, couponId:'KBQ-20260810-0771', gameCoins:'1280 钻石', zoneId:'1002', callbackValue:'{"status":2,"money":12.8,"gamemoney":128}' },
  { time:'2026-08-10 15:22:58', orderNo:'2026081015225825554007', gameOrderNo:'YSWX-80610522', gameId:'124946', gameName:'造梦无双', playerId:'3223944185', playerName:'-', developerId:'100705', developerName:'AppDeveloper', status:'失败', channel:'微信H5(手机)', rechargeAmount:30, subsidyAmount:0, couponFace:0, couponId:'-', gameCoins:'300 元宝', zoneId:'8', callbackValue:'{"status":0,"code":"PAY_FAIL","money":0,"gamemoney":30}' },
  { time:'2026-08-10 15:22:57', orderNo:'2026081015225765704007', gameOrderNo:'SGZ202608107053', gameId:'40020', gameName:'放开那三国', playerId:'1724039501', playerName:'-', developerId:'100895', developerName:'巴别时代', status:'异常', channel:'QQ钱包(手机)', rechargeAmount:68, subsidyAmount:5, couponFace:10, couponId:'KBQ-20260810-0659', gameCoins:'680 金币', zoneId:'205', callbackValue:'{"status":1,"code":"WAIT_CALLBACK","money":5,"gamemoney":68}' },
  { time:'2026-08-10 15:22:56', orderNo:'2026081015225682224007', gameOrderNo:'XY2026081011008', gameId:'40025', gameName:'造梦西游OL', playerId:'2157688461', playerName:'-', developerId:'100705', developerName:'四三九九', status:'成功', channel:'银联支付宝H5', rechargeAmount:328, subsidyAmount:30, couponFace:50, couponId:'KBQ-20260810-0528', gameCoins:'3280 点券', zoneId:'1', callbackValue:'{"status":2,"code":"","money":30,"gamemoney":328}' },
  { time:'2026-08-10 15:22:54', orderNo:'2026081015225450244007', gameOrderNo:'QH202608106129', gameId:'100943', gameName:'火线精英OL', playerId:'1603217789', playerName:'-', developerId:'100859', developerName:'火线工作室', status:'成功', channel:'支付宝APP', rechargeAmount:18, subsidyAmount:2, couponFace:5, couponId:'KBQ-20260810-0471', gameCoins:'180 点券', zoneId:'3', callbackValue:'{"status":2,"code":"","money":2,"gamemoney":18}' },
];

const testOrders: RechargeOrder[] = [
  { time:'2026-08-10 14:05:30', orderNo:'TEST20260810140530001', gameOrderNo:'TEST-GAME-001', gameId:'112516', gameName:'全民枪战2', playerId:'151668671', playerName:'-', developerId:'100370', developerName:'英雄互娱', status:'成功', channel:'支付宝沙箱', rechargeAmount:1, subsidyAmount:0, couponFace:0, couponId:'-', gameCoins:'10 钻石', zoneId:'15', callbackValue:'{"status":2,"code":"TEST_SUCCESS","money":0,"gamemoney":1}' },
  { time:'2026-08-10 13:46:12', orderNo:'TEST20260810134612002', gameOrderNo:'TEST-GAME-002', gameId:'124946', gameName:'造梦无双', playerId:'151668672', playerName:'-', developerId:'100705', developerName:'AppDeveloper', status:'异常', channel:'微信测试通道', rechargeAmount:0.01, subsidyAmount:0, couponFace:0, couponId:'-', gameCoins:'1 元宝', zoneId:'8', callbackValue:'{"status":1,"code":"TEST_WAIT","money":0,"gamemoney":0.01}' },
  { time:'2026-08-09 17:18:06', orderNo:'TEST20260809171806003', gameOrderNo:'TEST-GAME-003', gameId:'40020', gameName:'放开那三国', playerId:'151668673', playerName:'-', developerId:'100895', developerName:'巴别时代', status:'失败', channel:'QQ钱包测试', rechargeAmount:0.1, subsidyAmount:0, couponFace:0, couponId:'-', gameCoins:'1 金币', zoneId:'205', callbackValue:'{"status":0,"code":"TEST_FAIL","money":0,"gamemoney":0.1}' },
];

const miniGameOrders: RechargeOrder[] = formalOrders.map((row, index) => {
  const games = [
    ['210516','疯狂动物园'], ['210782','合成大西瓜'], ['210946','消灭星星'],
    ['220020','羊了个羊'], ['220025','球球大作战'], ['220943','开心消消乐'],
  ] as const;
  const game = games[index % games.length];
  return {
    ...row,
    orderNo:`MG${row.orderNo}`,
    gameOrderNo:`MINI-${String(index + 1).padStart(4, '0')}-${row.gameOrderNo}`,
    gameId:game[0],
    gameName:game[1],
    playerName:['小鹿同学', '星河玩家', '橘子汽水', '云朵旅人', '青柠少年', '夏日微风'][index % 6],
    channel:['游币充值', '微信APP', '支付宝H5', '支付宝APP'][index % 4],
    subsidyAmount:0,
    couponFace:0,
    couponId:'-',
    callbackValue:row.callbackValue.replace('gamemoney', 'game_money'),
  };
});

const pcGameOrders: RechargeOrder[] = formalOrders.map((row, index) => ({
  ...row,
  channel:['微信PC扫码', '支付宝PC扫码'][index % 2],
  subsidyAmount:0,
  couponFace:0,
  couponId:'-',
}));

const platformRechargeChannels = {
  'PC 游戏':['微信PC扫码', '支付宝PC扫码'],
  '快爆小游戏':['游币充值', '微信APP', '支付宝H5', '支付宝APP'],
} as const;

const paidDownloadGames = [
  ['112516','全民枪战2'], ['139782','龙族：卡塞尔之门'], ['124946','造梦无双'], ['40020','放开那三国'],
  ['40025','造梦西游OL'], ['100943','火线精英OL'], ['141943','大闹仙途'], ['138471','元气骑士'],
] as const;

const paidDownloadChannels = ['QQ钱包APP','银联微信小程序','银联支付宝小程序','支付宝APP','微信APP','微信扫码','支付宝扫码'];

const paidDownloadOrders: PaidDownloadOrder[] = Array.from({ length: 24 }, (_, index) => {
  const game = paidDownloadGames[index % paidDownloadGames.length];
  const day = 10 - Math.floor(index / 4);
  const purchaseAmount = [6, 12, 18, 30, 45, 68, 98, 128][index % 8];
  const hasCoupon = index % 3 !== 2;
  const subsidyAmount = hasCoupon ? [1, 2, 3, 5, 8][index % 5] : 0;
  return {
    time:`2026-08-${String(day).padStart(2, '0')} ${String(15 - index % 6).padStart(2, '0')}:${String(52 - index).padStart(2, '0')}:00`,
    orderNo:`FD202608${String(day).padStart(2, '0')}${String(153000 + index).padStart(8, '0')}`,
    gameOrderNo:`FD-GAME-${String(20260810001 + index)}`,
    gameId:game[0], gameName:game[1], playerId:String(151668671 + index), playerName:'-',
    developerId:String(100370 + index % 8), developerName:['英雄互娱','祖龙娱乐','AppDeveloper','巴别时代','四三九九','火线工作室','九游互娱','凉屋游戏'][index % 8],
    channel:paidDownloadChannels[index % paidDownloadChannels.length],
    purchaseAmount, subsidyAmount, couponFace:hasCoupon ? subsidyAmount * 2 : 0,
    couponId:hasCoupon ? `KBFD-202608-${String(1001 + index).padStart(4, '0')}` : '-',
  };
});

const initialFilters = {
  startDate: '2026-08-01', endDate: '2026-08-10', orderNo: '', gameOrderNo: '',
  game: '', player: '', developer: '', paidAmount: '', couponFace: '', couponId: '', channel: '',
};

const paymentChannels = ['QQ钱包APP', '微信H5', '银联微信小程序', '银联支付宝H5', '支付宝APP', '微信APP', '微信PC扫码', '支付宝PC扫码', '零元购'];

function paymentChannelName(channel: string) {
  if (channel.includes('QQ钱包')) return 'QQ钱包APP';
  if (channel.includes('微信H5')) return '微信H5';
  if (channel.includes('银联微信小程序')) return '银联微信小程序';
  if (channel.includes('银联支付宝')) return '银联支付宝H5';
  if (channel.includes('支付宝')) return '支付宝APP';
  return channel;
}

function money(value: number) {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formattedCallback(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return { date: isoDate(date.getFullYear(), date.getMonth(), date.getDate()), day: date.getDate(), current: date.getMonth() === month };
  });
}

function DateRangePicker({ start, end, onChange }: { start: string; end: string; onChange: (start: string, end: string) => void }) {
  const [open, setOpen] = useState(false);
  const [waitingForEnd, setWaitingForEnd] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date(`${start}T00:00:00`));
  const pickerRef = useRef<HTMLDivElement>(null);
  const leftYear = viewDate.getFullYear();
  const leftMonth = viewDate.getMonth();
  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutside = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setWaitingForEnd(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, [open]);
  const moveCalendar = (months: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + months, 1));
  };
  const choose = (date: string) => {
    if (!waitingForEnd) {
      onChange(date, date);
      setWaitingForEnd(true);
      return;
    }
    onChange(date < start ? date : start, date < start ? start : date);
    setWaitingForEnd(false);
    setOpen(false);
  };
  const renderMonth = (year: number, month: number) => <div className="kbi-calendar-month">
    <div className="kbi-calendar-title">{year} 年 {month + 1} 月</div>
    <div className="kbi-calendar-week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>
    <div className="kbi-calendar-grid">{monthCells(year, month).map((cell) => {
      const selected = cell.current && (cell.date === start || cell.date === end);
      const inRange = cell.current && cell.date > start && cell.date < end;
      return <button key={cell.date} className={`${cell.current ? '' : 'is-other'} ${selected ? 'is-selected' : ''} ${inRange ? 'is-range' : ''}`} onClick={() => choose(cell.date)}><span>{cell.day}</span></button>;
    })}</div>
  </div>;
  return <div className="kbi-date-picker" ref={pickerRef}>
    <button className={`kbi-date-trigger ${open ? 'is-open' : ''}`} onClick={() => { setOpen((visible) => !visible); setViewDate(new Date(`${start}T00:00:00`)); }}><img src={calendarIcon} alt="" />{start}<i>—</i>{end}</button>
    {open && <div className="kbi-calendar-popover">
      <div className="kbi-calendar-nav"><button aria-label="上一年" onClick={() => moveCalendar(-12)}>«</button><button aria-label="上个月" onClick={() => moveCalendar(-1)}>‹</button><span></span><button aria-label="下个月" onClick={() => moveCalendar(1)}>›</button><button aria-label="下一年" onClick={() => moveCalendar(12)}>»</button></div>
      <div className="kbi-calendar-panels">{renderMonth(leftYear, leftMonth)}{renderMonth(rightDate.getFullYear(), rightDate.getMonth())}</div>
    </div>}
  </div>;
}

function PaidDownloadDetail({ showToast }: { showToast: (message: string) => void }) {
  const initialPaidFilters = { startDate:'2026-08-01', endDate:'2026-08-10', orderNo:'', gameOrderNo:'', game:'', player:'', developer:'', paidAmount:'', couponFace:'', couponId:'', channel:'' };
  const [paidFilters, setPaidFilters] = useState(initialPaidFilters);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [drill, setDrill] = useState<'total' | 'row' | null>(null);
  const [selected, setSelected] = useState<PaidDownloadOrder | null>(null);
  const setPaidFilter = (key: keyof typeof initialPaidFilters, value: string) => { setPaidFilters((current) => ({ ...current, [key]:value })); setCurrentPage(1); };
  const rows = useMemo(() => paidDownloadOrders.filter((row) => {
    const game = `${row.gameId} ${row.gameName}`.toLowerCase();
    const player = `${row.playerId} ${row.playerName}`.toLowerCase();
    const developer = `${row.developerId} ${row.developerName}`.toLowerCase();
    return row.time.slice(0, 10) >= paidFilters.startDate && row.time.slice(0, 10) <= paidFilters.endDate
      && row.orderNo.toLowerCase().includes(paidFilters.orderNo.trim().toLowerCase())
      && row.gameOrderNo.toLowerCase().includes(paidFilters.gameOrderNo.trim().toLowerCase())
      && game.includes(paidFilters.game.trim().toLowerCase())
      && player.includes(paidFilters.player.trim().toLowerCase())
      && developer.includes(paidFilters.developer.trim().toLowerCase())
      && (!paidFilters.paidAmount || row.purchaseAmount === Number(paidFilters.paidAmount))
      && (!paidFilters.couponFace || row.couponFace === Number(paidFilters.couponFace))
      && row.couponId.toLowerCase().includes(paidFilters.couponId.trim().toLowerCase())
      && (!paidFilters.channel || row.channel === paidFilters.channel);
  }), [paidFilters]);
  const totals = useMemo(() => rows.reduce((total, row) => ({ purchase:total.purchase + row.purchaseAmount, subsidy:total.subsidy + row.subsidyAmount, couponFace:total.couponFace + row.couponFace }), { purchase:0, subsidy:0, couponFace:0 }), [rows]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <>
    <section className="kbi-card">
      <div className="kbi-querybar">
        <DateRangePicker start={paidFilters.startDate} end={paidFilters.endDate} onChange={(startDate, endDate) => { setPaidFilters((current) => ({ ...current, startDate, endDate })); setCurrentPage(1); }}/>
        <input aria-label="订单号" value={paidFilters.orderNo} onChange={(event) => setPaidFilter('orderNo', event.target.value)} placeholder="订单号"/>
        <input aria-label="游戏订单号" value={paidFilters.gameOrderNo} onChange={(event) => setPaidFilter('gameOrderNo', event.target.value)} placeholder="游戏订单号"/>
        <input aria-label="游戏ID / 名称" value={paidFilters.game} onChange={(event) => setPaidFilter('game', event.target.value)} placeholder="游戏ID / 名称"/>
        <input aria-label="玩家ID / 名称" value={paidFilters.player} onChange={(event) => setPaidFilter('player', event.target.value)} placeholder="玩家ID / 名称"/>
        <input aria-label="开发者ID / 名称" value={paidFilters.developer} onChange={(event) => setPaidFilter('developer', event.target.value)} placeholder="开发者ID / 名称"/>
        <input aria-label="购买金额" type="number" min="0" step="0.01" value={paidFilters.paidAmount} onChange={(event) => setPaidFilter('paidAmount', event.target.value)} placeholder="购买金额"/>
        <input aria-label="优惠券面额" type="number" min="0" step="0.01" value={paidFilters.couponFace} onChange={(event) => setPaidFilter('couponFace', event.target.value)} placeholder="优惠券面额"/>
        <input aria-label="优惠券ID" value={paidFilters.couponId} onChange={(event) => setPaidFilter('couponId', event.target.value)} placeholder="优惠券ID"/>
        <button className="kbi-btn kbi-btn-primary" onClick={() => showToast('已创建付费下载明细导出任务（原型示意）')}>导出</button>
      </div>
      <div className="kbi-table-wrap">
        <table className="kbi-paid-download-table">
          <thead><tr><th>时间</th><th>订单号</th><th>游戏ID / 名称</th><th>玩家ID / 名称</th><th className="kbi-filter-column"><button className={paidFilters.channel ? 'is-filtered' : ''} aria-haspopup="listbox" aria-expanded={channelMenuOpen} onClick={() => setChannelMenuOpen((open) => !open)}>支付渠道<img src={filterIcon} alt="筛选" /></button>{channelMenuOpen && <div className="kbi-channel-menu kbi-paid-channel-menu" role="listbox"><button className={!paidFilters.channel ? 'is-selected' : ''} onClick={() => { setPaidFilter('channel', ''); setChannelMenuOpen(false); }}>全部</button>{paidDownloadChannels.map((channel) => <button key={channel} className={paidFilters.channel === channel ? 'is-selected' : ''} onClick={() => { setPaidFilter('channel', channel); setChannelMenuOpen(false); }}>{channel}</button>)}</div>}</th><th className="is-number">购买金额</th><th className="is-number">平台补贴金额</th></tr></thead>
          <tbody>
            {rows.length > 0 && <tr className="kbi-total-row"><td>查询总计</td><td colSpan={4}></td><td className="is-number">{money(totals.purchase)}</td><td className="is-number"><button className="kbi-drill" onClick={() => { setSelected(null); setDrill('total'); }}>{money(totals.subsidy)}</button></td></tr>}
            {pageRows.map((row) => <tr key={row.orderNo}><td>{row.time}</td><td>{row.orderNo}</td><td>{row.gameId} / {row.gameName}</td><td>{row.playerId} / -</td><td>{row.channel}</td><td className="is-number">{money(row.purchaseAmount)}</td><td className="is-number">{row.subsidyAmount ? <button className="kbi-drill" onClick={() => { setSelected(row); setDrill('row'); }}>{money(row.subsidyAmount)}</button> : <span className="kbi-empty-value">-</span>}</td></tr>)}
            {!rows.length && <tr><td className="kbi-empty" colSpan={7}>暂无数据</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="kbi-pagination"><span>共 {rows.length} 条</span><select aria-label="每页条数" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}><option value="10">10条/页</option><option value="20">20条/页</option><option value="30">30条/页</option><option value="50">50条/页</option><option value="100">100条/页</option><option value="200">200条/页</option></select><button aria-label="上一页" disabled={currentPage === 1} onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}>‹</button>{Array.from({ length:Math.min(6, totalPages) }, (_, index) => index + 1).map((pageNo) => <button key={pageNo} className={currentPage === pageNo ? 'is-current' : ''} onClick={() => setCurrentPage(pageNo)}>{pageNo}</button>)}<button aria-label="下一页" disabled={currentPage === totalPages} onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}>›</button></div>
    </section>
    {drill && <div className="kbi-mask" onMouseDown={() => setDrill(null)}><section className="kbi-modal" role="dialog" aria-modal="true" aria-label="平台补贴详情" onMouseDown={(event) => event.stopPropagation()}><header><button aria-label="关闭弹窗" onClick={() => setDrill(null)}><X size={18}/></button></header><div className="kbi-modal-body"><dl><div className="kbi-modal-table-head"><dt>名词</dt><dd>说明</dd></div>{drill === 'total' ? <><div><dt>优惠券面额</dt><dd>{money(totals.couponFace)}</dd></div><div><dt>平台补贴金额</dt><dd>{money(totals.subsidy)}</dd></div></> : selected && <><div><dt>平台游戏</dt><dd>{selected.gameId} / {selected.gameName}</dd></div><div><dt>订单号</dt><dd>{selected.orderNo}</dd></div><div><dt>优惠券面额</dt><dd>{money(selected.couponFace)}</dd></div><div><dt>平台补贴金额</dt><dd>{money(selected.subsidyAmount)}</dd></div><div><dt>优惠券ID</dt><dd>{selected.couponId}</dd></div></>}</dl></div></section></div>}
  </>;
}

function PlatformRechargeDetail({ platform, showToast }: { platform: 'PC 游戏' | '快爆小游戏'; showToast: (message: string) => void }) {
  const initial = { startDate:'2026-08-01', endDate:'2026-08-10', orderNo:'', game:'', player:'', developer:'', channel:'' };
  const [query, setQuery] = useState(initial);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [drill, setDrill] = useState<DrillType>(null);
  const [selected, setSelected] = useState<RechargeOrder | null>(null);
  const setQueryValue = (key: keyof typeof initial, value: string) => { setQuery((current) => ({ ...current, [key]:value })); setCurrentPage(1); };
  const sourceRows = platform === '快爆小游戏' ? miniGameOrders : pcGameOrders;
  const rows = useMemo(() => sourceRows.filter((row) => {
    const day = row.time.slice(0, 10);
    const game = `${row.gameId} ${row.gameName}`.toLowerCase();
    const player = `${row.playerId} ${row.playerName}`.toLowerCase();
    const developer = `${row.developerId} ${row.developerName}`.toLowerCase();
    return day >= query.startDate && day <= query.endDate
      && row.orderNo.includes(query.orderNo.trim())
      && game.includes(query.game.trim().toLowerCase())
      && player.includes(query.player.trim().toLowerCase())
      && developer.includes(query.developer.trim().toLowerCase())
      && (!query.channel || row.channel === query.channel);
  }), [query, sourceRows]);
  const totals = useMemo(() => rows.reduce((total, row) => ({ recharge:total.recharge + row.rechargeAmount, subsidy:total.subsidy + row.subsidyAmount, couponFace:total.couponFace + row.couponFace }), { recharge:0, subsidy:0, couponFace:0 }), [rows]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <>
    <section className="kbi-card">
      <div className="kbi-querybar">
        <DateRangePicker start={query.startDate} end={query.endDate} onChange={(startDate, endDate) => { setQuery((current) => ({ ...current, startDate, endDate })); setCurrentPage(1); }}/>
        <input aria-label="订单号" value={query.orderNo} onChange={(event) => setQueryValue('orderNo', event.target.value)} placeholder="订单号"/>
        <input aria-label="游戏ID / 名称" value={query.game} onChange={(event) => setQueryValue('game', event.target.value)} placeholder="游戏ID / 名称"/>
        <input aria-label="玩家ID / 名称" value={query.player} onChange={(event) => setQueryValue('player', event.target.value)} placeholder="玩家ID / 名称"/>
        <input aria-label="开发者ID / 名称" value={query.developer} onChange={(event) => setQueryValue('developer', event.target.value)} placeholder="开发者ID / 名称"/>
        <button className="kbi-btn kbi-btn-primary" onClick={() => showToast(`已创建${platform}充值明细导出任务（原型示意）`)}>导出</button>
      </div>
      <div className="kbi-table-wrap">
        <table>
          <thead><tr><th>时间</th><th>订单号</th><th>游戏ID / 名称</th><th>玩家ID / 名称</th><th>订单状态</th><th className="kbi-filter-column"><button className={query.channel ? 'is-filtered' : ''} aria-haspopup="listbox" aria-expanded={channelMenuOpen} onClick={() => setChannelMenuOpen((open) => !open)}>支付渠道<img src={filterIcon} alt="筛选" /></button>{channelMenuOpen && <div className="kbi-channel-menu kbi-paid-channel-menu" role="listbox"><button className={!query.channel ? 'is-selected' : ''} onClick={() => { setQueryValue('channel', ''); setChannelMenuOpen(false); }}>全部</button>{platformRechargeChannels[platform].map((channel) => <button key={channel} className={query.channel === channel ? 'is-selected' : ''} onClick={() => { setQueryValue('channel', channel); setChannelMenuOpen(false); }}>{channel}</button>)}</div>}</th><th className="is-number">充值金额</th><th className="is-number">平台补贴金额</th></tr></thead>
          <tbody>
            {rows.length > 0 && <tr className="kbi-total-row"><td>查询总计</td><td colSpan={5}></td><td className="is-number">{money(totals.recharge)}</td><td className="is-number"><span className="kbi-empty-value">-</span></td></tr>}
            {pageRows.map((row) => <tr key={row.orderNo}><td>{row.time}</td><td><button className="kbi-drill" onClick={() => { setSelected(row); setDrill('order'); }}>{row.orderNo}</button></td><td>{row.gameId} / {row.gameName}</td><td>{row.playerId} / {platform === '快爆小游戏' ? row.playerName : '-'}</td><td><span className={`kbi-status kbi-status-${row.status}`}>{row.status}</span></td><td>{row.channel}</td><td className="is-number">{money(row.rechargeAmount)}</td><td className="is-number"><span className="kbi-empty-value">-</span></td></tr>)}
            {!rows.length && <tr><td className="kbi-empty" colSpan={8}>暂无数据</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="kbi-pagination"><span>共 {rows.length} 条</span><select aria-label="每页条数" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}><option value="10">10条/页</option><option value="20">20条/页</option><option value="30">30条/页</option><option value="50">50条/页</option><option value="100">100条/页</option><option value="200">200条/页</option></select><button aria-label="上一页" disabled={currentPage === 1} onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}>‹</button>{Array.from({ length:Math.min(6, totalPages) }, (_, index) => index + 1).map((pageNo) => <button key={pageNo} className={currentPage === pageNo ? 'is-current' : ''} onClick={() => setCurrentPage(pageNo)}>{pageNo}</button>)}<button aria-label="下一页" disabled={currentPage === totalPages} onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}>›</button></div>
    </section>
    {drill && <div className="kbi-mask" onMouseDown={() => setDrill(null)}><section className="kbi-modal" role="dialog" aria-modal="true" aria-label="明细下钻" onMouseDown={(event) => event.stopPropagation()}><header><button aria-label="关闭弹窗" onClick={() => setDrill(null)}><X size={18}/></button></header><div className="kbi-modal-body"><dl><div className="kbi-modal-table-head"><dt>名词</dt><dd>说明</dd></div>{drill === 'order' && selected ? <><div><dt>游戏ID / 名称</dt><dd>{selected.gameId} / {selected.gameName}</dd></div><div><dt>订单号</dt><dd>{selected.orderNo}</dd></div><div><dt>游戏订单号</dt><dd>{selected.gameOrderNo}</dd></div><div><dt>游戏币</dt><dd>{selected.gameCoins}</dd></div><div><dt>游戏区服ID</dt><dd>{selected.zoneId}</dd></div><div><dt>服务端回传值</dt><dd><pre>{formattedCallback(selected.callbackValue)}</pre></dd></div></> : drill === 'total-subsidy' ? <><div><dt>优惠券面额</dt><dd>{money(totals.couponFace)}</dd></div><div><dt>平台补贴金额</dt><dd>{money(totals.subsidy)}</dd></div></> : selected && <><div><dt>平台游戏</dt><dd>{selected.gameId} / {selected.gameName}</dd></div><div><dt>订单号</dt><dd>{selected.orderNo}</dd></div><div><dt>优惠券面额</dt><dd>{money(selected.couponFace)}</dd></div><div><dt>平台补贴金额</dt><dd>{money(selected.subsidyAmount)}</dd></div><div><dt>优惠券ID</dt><dd>{selected.couponId}</dd></div></>}</dl></div></section></div>}
  </>;
}

export default function KuaibaoIncomeAlignment() {
  const { page, setPage } = useHashPage(route);
  const isTest = page === 'mobile-recharge-test';
  const isRechargeStats = page === 'mobile-recharge-game-stats' || page === 'mobile-recharge-developer-stats' || page === 'mobile-recharge-summary-stats';
  const isPaidDownloadDetail = page === 'mobile-paid-download-detail';
  const isPaidDownloadStats = page === 'mobile-paid-download-game-stats' || page === 'mobile-paid-download-developer-stats' || page === 'mobile-paid-download-summary-stats';
  const isIncomeStats = page === 'mobile-income-game-stats' || page === 'mobile-income-developer-stats';
  const isPcRechargeDetail = page === 'pc-recharge-detail';
  const isMiniGameRechargeDetail = page === 'mini-game-recharge-detail';
  const sourceOrders = isTest ? testOrders : formalOrders;
  const [filters, setFilters] = useState(initialFilters);
  const [drillType, setDrillType] = useState<DrillType>(null);
  const [selectedOrder, setSelectedOrder] = useState<RechargeOrder | null>(null);
  const [toast, setToast] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);

  const filteredOrders = useMemo(() => sourceOrders.filter((row) => {
    const day = row.time.slice(0, 10);
    const game = `${row.gameId} ${row.gameName}`.toLowerCase();
    const player = `${row.playerId} ${row.playerName}`.toLowerCase();
    const developer = `${row.developerId} ${row.developerName}`.toLowerCase();
    return day >= filters.startDate && day <= filters.endDate
      && row.orderNo.includes(filters.orderNo.trim())
      && row.gameOrderNo.toLowerCase().includes(filters.gameOrderNo.trim().toLowerCase())
      && game.includes(filters.game.trim().toLowerCase())
      && player.includes(filters.player.trim().toLowerCase())
      && developer.includes(filters.developer.trim().toLowerCase())
      && (!filters.paidAmount || row.rechargeAmount === Number(filters.paidAmount))
      && (!filters.couponFace || row.couponFace === Number(filters.couponFace))
      && row.couponId.toLowerCase().includes(filters.couponId.trim().toLowerCase())
      && (!filters.channel || paymentChannelName(row.channel) === filters.channel);
  }), [sourceOrders, filters]);

  const totals = useMemo(() => filteredOrders.reduce((acc, row) => ({
    recharge: acc.recharge + row.rechargeAmount,
    subsidy: acc.subsidy + row.subsidyAmount,
    couponFace: acc.couponFace + row.couponFace,
  }), { recharge: 0, subsidy: 0, couponFace: 0 }), [filteredOrders]);

  const isDefaultQuery = Object.entries(filters).every(([key, value]) => value === initialFilters[key as keyof typeof initialFilters]);
  const resultCount = isDefaultQuery ? (isTest ? 18 : 71935) : filteredOrders.length;
  const displayTotals = isDefaultQuery
    ? (isTest ? { recharge: 16.08, subsidy: 0, couponFace: 0 } : { recharge: 4821560, subsidy: 286340, couponFace: 421500 })
    : totals;
  const totalPages = Math.max(1, Math.ceil(resultCount / pageSize));

  const setFilter = (key: keyof typeof initialFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const openOrder = (row: RechargeOrder) => {
    setSelectedOrder(row);
    setDrillType('order');
  };

  const openRowSubsidy = (row: RechargeOrder) => {
    setSelectedOrder(row);
    setDrillType('row-subsidy');
  };

  return <div className="kbi-app">
    <aside className="kbi-sidebar">
      <div className="kbi-logo">原创管理后台</div>
      <nav aria-label="业务菜单">
        <div className="kbi-primary-title">手游</div>
        <div className="kbi-secondary-list">
          <button className={!isRechargeStats && !isPaidDownloadDetail && !isPaidDownloadStats && !isIncomeStats && !isPcRechargeDetail && !isMiniGameRechargeDetail ? 'is-active' : ''} onClick={() => setPage('mobile-recharge-formal')}>充值明细</button>
          <button className={isRechargeStats ? 'is-active' : ''} onClick={() => setPage('mobile-recharge-game-stats')}>充值统计</button>
          <button className={isPaidDownloadDetail ? 'is-active' : ''} onClick={() => setPage('mobile-paid-download-detail')}>付费下载明细</button>
          <button className={isPaidDownloadStats ? 'is-active' : ''} onClick={() => setPage('mobile-paid-download-game-stats')}>付费下载统计</button>
          <button className={isIncomeStats ? 'is-active' : ''} onClick={() => setPage('mobile-income-game-stats')}>收入汇总统计</button>
        </div>
        <div className="kbi-primary-title">PC 游戏</div>
        <div className="kbi-secondary-list">
          <button className={isPcRechargeDetail ? 'is-active' : ''} onClick={() => setPage('pc-recharge-detail')}>充值明细</button>
        </div>
        <div className="kbi-primary-title">快爆小游戏</div>
        <div className="kbi-secondary-list">
          <button className={isMiniGameRechargeDetail ? 'is-active' : ''} onClick={() => setPage('mini-game-recharge-detail')}>充值明细</button>
        </div>
      </nav>
      <div className="kbi-side-foot">本期不修改 4399 与广告收入</div>
    </aside>

    <section className="kbi-main">
      <header className="kbi-header">
        <select aria-label="目录" value="kuaibao" onChange={() => undefined}><option value="kuaibao">好游快爆 / 数据中心</option></select>
        <div className="kbi-crumb">{isPcRechargeDetail ? 'PC 游戏' : isMiniGameRechargeDetail ? '快爆小游戏' : '手游'} <span>›</span> {isRechargeStats ? '充值统计' : isPaidDownloadStats ? '付费下载统计' : isIncomeStats ? '收入汇总统计' : isPaidDownloadDetail ? '付费下载明细' : '充值明细'}</div>
      </header>

      <main className="kbi-content">
        <div className="kbi-secondary-tab">{isRechargeStats ? '充值统计' : isPaidDownloadStats ? '付费下载统计' : isIncomeStats ? '收入汇总统计' : isPaidDownloadDetail ? '付费下载明细' : '充值明细'}</div>
        {isRechargeStats || isPaidDownloadStats || isIncomeStats ? <RechargeStats page={page as RechargeStatsPageId} setPage={setPage} showToast={showToast}/> : isPaidDownloadDetail ? <PaidDownloadDetail showToast={showToast}/> : isPcRechargeDetail ? <PlatformRechargeDetail platform="PC 游戏" showToast={showToast}/> : isMiniGameRechargeDetail ? <PlatformRechargeDetail platform="快爆小游戏" showToast={showToast}/> : <section className="kbi-card">
          <div className="kbi-querybar">
            <OrderTypeSelect value={isTest ? 'mobile-recharge-test' : 'mobile-recharge-formal'} onChange={setPage}/>
            <DateRangePicker start={filters.startDate} end={filters.endDate} onChange={(startDate, endDate) => { setFilters((current) => ({ ...current, startDate, endDate })); setCurrentPage(1); }}/>
            <input aria-label="订单号" value={filters.orderNo} onChange={(e) => setFilter('orderNo', e.target.value)} placeholder="订单号"/>
            <input aria-label="游戏订单号" value={filters.gameOrderNo} onChange={(e) => setFilter('gameOrderNo', e.target.value)} placeholder="游戏订单号"/>
            <input aria-label="游戏ID / 名称" value={filters.game} onChange={(e) => setFilter('game', e.target.value)} placeholder="游戏ID / 名称"/>
            <input aria-label="玩家ID / 名称" value={filters.player} onChange={(e) => setFilter('player', e.target.value)} placeholder="玩家ID / 名称"/>
            <input aria-label="开发者ID / 名称" value={filters.developer} onChange={(e) => setFilter('developer', e.target.value)} placeholder="开发者ID / 名称"/>
            <input aria-label="充值金额" type="number" min="0" step="0.01" value={filters.paidAmount} onChange={(e) => setFilter('paidAmount', e.target.value)} placeholder="充值金额"/>
            <input aria-label="优惠券面额" type="number" min="0" step="0.01" value={filters.couponFace} onChange={(e) => setFilter('couponFace', e.target.value)} placeholder="优惠券面额"/>
            <input aria-label="优惠券ID" value={filters.couponId} onChange={(e) => setFilter('couponId', e.target.value)} placeholder="优惠券ID"/>
            <button className="kbi-btn kbi-btn-primary" onClick={() => showToast(`已创建${isTest ? '测试订单' : '正式订单'}导出任务（原型示意）`)}>导出</button>
          </div>

          <div className="kbi-table-wrap">
            <table>
              <thead><tr><th>时间</th><th>订单号</th><th>游戏ID / 名称</th><th>玩家ID / 名称</th><th>订单状态</th><th className="kbi-filter-column"><button className={filters.channel ? 'is-filtered' : ''} aria-haspopup="listbox" aria-expanded={channelMenuOpen} onClick={() => setChannelMenuOpen((open) => !open)}>支付渠道<img src={filterIcon} alt="筛选" /></button>{channelMenuOpen && <div className="kbi-channel-menu" role="listbox"><button className={!filters.channel ? 'is-selected' : ''} onClick={() => { setFilter('channel', ''); setChannelMenuOpen(false); }}>全部</button>{paymentChannels.map((channel) => <button key={channel} className={filters.channel === channel ? 'is-selected' : ''} onClick={() => { setFilter('channel', channel); setChannelMenuOpen(false); }}>{channel}</button>)}</div>}</th><th className="is-number">充值金额</th><th className="is-number">平台补贴金额</th></tr></thead>
              <tbody>
                {filteredOrders.length > 0 && <tr className="kbi-total-row"><td>查询总计</td><td colSpan={5}></td><td className="is-number">{money(displayTotals.recharge)}</td><td className="is-number"><button className="kbi-drill" onClick={() => { setSelectedOrder(null); setDrillType('total-subsidy'); }}>{money(displayTotals.subsidy)}</button></td></tr>}
                {filteredOrders.map((row) => <tr key={row.orderNo}>
                  <td>{row.time}</td>
                  <td><button className="kbi-drill" onClick={() => openOrder(row)}>{row.orderNo}</button></td>
                  <td>{row.gameId} / {row.gameName}</td>
                  <td>{row.playerId} / -</td>
                  <td><span className={`kbi-status kbi-status-${row.status}`}>{row.status}</span></td>
                  <td>{paymentChannelName(row.channel)}</td>
                  <td className="is-number">{money(row.rechargeAmount)}</td>
                  <td className="is-number">{row.subsidyAmount ? <button className="kbi-drill" onClick={() => openRowSubsidy(row)}>{money(row.subsidyAmount)}</button> : <span className="kbi-empty-value">-</span>}</td>
                </tr>)}
                {filteredOrders.length === 0 && <tr><td className="kbi-empty" colSpan={8}>暂无数据</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="kbi-pagination"><span>共 {resultCount} 条</span><select aria-label="每页条数" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}><option value="10">10条/页</option><option value="20">20条/页</option><option value="30">30条/页</option><option value="50">50条/页</option><option value="100">100条/页</option><option value="200">200条/页</option></select><button aria-label="上一页" disabled={currentPage === 1} onClick={() => setCurrentPage((pageNo) => Math.max(1, pageNo - 1))}>‹</button>{Array.from({ length: Math.min(6, totalPages) }, (_, index) => index + 1).map((pageNo) => <button key={pageNo} className={currentPage === pageNo ? 'is-current' : ''} onClick={() => setCurrentPage(pageNo)}>{pageNo}</button>)}{totalPages > 7 && <span className="kbi-page-ellipsis">…</span>}{totalPages > 6 && <button className={currentPage === totalPages ? 'is-current' : ''} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>}<button aria-label="下一页" disabled={currentPage === totalPages} onClick={() => setCurrentPage((pageNo) => Math.min(totalPages, pageNo + 1))}>›</button></div>
        </section>}
      </main>
    </section>

    {!isRechargeStats && !isPaidDownloadDetail && drillType && <div className="kbi-mask" onMouseDown={() => setDrillType(null)}>
      <section className="kbi-modal" role="dialog" aria-modal="true" aria-label={drillType === 'order' ? '订单详情' : '平台补贴详情'} onMouseDown={(e) => e.stopPropagation()}>
        <header><button aria-label="关闭弹窗" onClick={() => setDrillType(null)}><X size={18}/></button></header>
        <div className="kbi-modal-body">
          {drillType === 'order' && selectedOrder && <dl>
            <div className="kbi-modal-table-head"><dt>名词</dt><dd>说明</dd></div>
            <div><dt>平台游戏</dt><dd>{selectedOrder.gameId} / {selectedOrder.gameName}</dd></div>
            <div><dt>平台订单号</dt><dd>{selectedOrder.orderNo}</dd></div>
            <div><dt>游戏订单号</dt><dd>{selectedOrder.gameOrderNo}</dd></div>
            <div><dt>游戏区服ID</dt><dd>{selectedOrder.zoneId}</dd></div>
            <div className="is-wide"><dt>游戏回传值</dt><dd><pre>{formattedCallback(selectedOrder.callbackValue)}</pre></dd></div>
          </dl>}
          {drillType === 'total-subsidy' && <dl>
            <div className="kbi-modal-table-head"><dt>名词</dt><dd>说明</dd></div>
            <div><dt>优惠券面额</dt><dd>{money(displayTotals.couponFace)}</dd></div>
            <div><dt>平台补贴金额</dt><dd>{money(displayTotals.subsidy)}</dd></div>
          </dl>}
          {drillType === 'row-subsidy' && selectedOrder && <dl>
            <div className="kbi-modal-table-head"><dt>名词</dt><dd>说明</dd></div>
            <div><dt>平台游戏</dt><dd>{selectedOrder.gameId} / {selectedOrder.gameName}</dd></div>
            <div><dt>订单号</dt><dd>{selectedOrder.orderNo}</dd></div>
            <div><dt>优惠券面额</dt><dd>{money(selectedOrder.couponFace)}</dd></div>
            <div><dt>平台补贴金额</dt><dd>{money(selectedOrder.subsidyAmount)}</dd></div>
            <div className="is-wide"><dt>优惠券ID</dt><dd>{selectedOrder.couponId}</dd></div>
          </dl>}
        </div>
      </section>
    </div>}

    {toast && <div className="kbi-toast" role="status">{toast}</div>}
  </div>;
}
