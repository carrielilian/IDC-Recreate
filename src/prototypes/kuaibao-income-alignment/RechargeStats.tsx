import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChartLine, X } from 'lucide-react';
import calendarIcon from './calendar.svg';

export type RechargeStatsPageId =
  | 'mobile-recharge-game-stats'
  | 'mobile-recharge-developer-stats'
  | 'mobile-recharge-summary-stats'
  | 'mobile-paid-download-game-stats'
  | 'mobile-paid-download-developer-stats'
  | 'mobile-paid-download-summary-stats'
  | 'mobile-income-game-stats'
  | 'mobile-income-developer-stats';

type StatsMode = 'game' | 'developer' | 'summary';

type StatRow = {
  time: string;
  gameId: string;
  gameName: string;
  developerId: string;
  developerName: string;
  companyName: string;
  pendingAmount: number;
  successAmount: number;
  failedAmount: number;
  subsidyAmount: number;
  couponCount: number;
  couponFace: number;
  orderCount: number;
  orderPeople: number;
  successOrders: number;
  failedOrders: number;
  abnormalOrders: number;
};

const pageOptions: Array<{ id: RechargeStatsPageId; label: string; mode: StatsMode }> = [
  { id: 'mobile-recharge-game-stats', label: '游戏统计', mode: 'game' },
  { id: 'mobile-recharge-developer-stats', label: '开发者统计', mode: 'developer' },
  { id: 'mobile-recharge-summary-stats', label: '汇总统计', mode: 'summary' },
  { id: 'mobile-paid-download-game-stats', label: '游戏统计', mode: 'game' },
  { id: 'mobile-paid-download-developer-stats', label: '开发者统计', mode: 'developer' },
  { id: 'mobile-paid-download-summary-stats', label: '汇总统计', mode: 'summary' },
  { id: 'mobile-income-game-stats', label: '游戏统计', mode: 'game' },
  { id: 'mobile-income-developer-stats', label: '开发者统计', mode: 'developer' },
];

function StatsViewSelect({ value, onChange }: { value: RechargeStatsPageId; onChange: (value: RechargeStatsPageId) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pagePrefix = value.startsWith('mobile-paid-download-') ? 'mobile-paid-download-' : value.startsWith('mobile-income-') ? 'mobile-income-' : 'mobile-recharge-';
  const availableOptions = pageOptions.filter((option) => option.id.startsWith(pagePrefix));
  const selected = availableOptions.find((option) => option.id === value) ?? availableOptions[0];
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return <div className="kbi-stats-view-select" ref={rootRef}>
    <button type="button" aria-label="三级功能" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((valueOpen) => !valueOpen)}><span>{selected.label}</span><i></i></button>
    {open && <div className="kbi-stats-view-options" role="listbox">{availableOptions.map((option) => <button type="button" role="option" aria-selected={option.id === value} className={option.id === value ? 'is-selected' : ''} key={option.id} onClick={() => { onChange(option.id); setOpen(false); }}>{option.label}</button>)}</div>}
  </div>;
}

function StatsCompactSelect({ label, value, options, className = '', onChange }: { label: string; value: string; options: Array<{ value:string; label:string }>; className?: string; onChange: (value:string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return <div className={`kbi-compact-select ${className}`} ref={rootRef}>
    <button type="button" aria-label={label} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((valueOpen) => !valueOpen)}><span>{selected.label}</span><i></i></button>
    {open && <div className="kbi-compact-options" role="listbox">{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} className={option.value === value ? 'is-selected' : ''} key={option.value} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}</div>}
  </div>;
}

const mockEntities = [
  ['112516','全民枪战2','100370','英雄互娱','天津英雄互娱科技有限公司'],
  ['139782','龙族：卡塞尔之门','100895','祖龙娱乐','天津祖龙娱乐科技有限公司'],
  ['124946','造梦无双','100705','AppDeveloper','厦门游力信息科技有限公司'],
  ['40020','放开那三国','100619','巴别时代','北京巴别时代科技股份有限公司'],
  ['40025','造梦西游OL','100019','四三九九','四三九九网络股份有限公司'],
  ['100943','火线精英OL','100859','火线工作室','厦门火线互动科技有限公司'],
  ['141943','大闹仙途','103067','九游互娱','广州九游信息技术有限公司'],
  ['138471','元气骑士','102608','凉屋游戏','深圳凉屋游戏科技有限公司'],
  ['114742','明日之后','101455','网易游戏','杭州网易雷火科技有限公司'],
  ['135240','西普大陆','102116','四三九九研发','厦门四三九九研发有限公司'],
  ['142337','奥奇传说','103208','百田信息','广州百田信息科技有限公司'],
  ['130201','光·遇','101872','网易互娱','广州网易计算机系统有限公司'],
  ['141834','奥特曼系列OL','103152','扬讯科技','上海扬讯计算机科技有限公司'],
  ['125980','王牌竞速','100926','不鸣科技','杭州不鸣科技有限公司'],
  ['142085','忍者必须死3','103244','炎魂网络','杭州炎魂网络科技有限公司'],
] as const;

const mockDates = ['2026-07-15','2026-07-28','2026-08-01','2026-08-02','2026-08-03','2026-08-04','2026-08-05','2026-08-06','2026-08-07','2026-08-08','2026-08-09','2026-08-10'];

const trendProfiles = [
  [0.72,0.78,0.82,0.86,0.91,0.96,1.02,1.07,1.11,1.16,1.22,1.28], // 持续增长
  [1.28,1.24,1.19,1.14,1.09,1.03,0.98,0.93,0.89,0.84,0.80,0.76], // 持续下降
  [0.82,0.88,0.96,1.08,1.22,1.32,1.24,1.12,1.02,0.94,0.88,0.84], // 中期峰值
  [1.18,1.10,1.01,0.91,0.82,0.76,0.81,0.90,1.02,1.13,1.20,1.27], // 先降后升
  [0.90,1.08,0.86,1.15,0.88,1.20,0.92,1.16,0.89,1.12,0.94,1.18], // 周期波动
  [0.92,0.94,0.96,0.97,0.98,1.00,1.01,1.03,1.04,1.05,1.07,1.08], // 平稳微增
  [1.03,1.02,1.04,1.01,1.03,1.00,1.02,1.01,1.03,1.02,1.01,1.03], // 基本稳定
  [0.78,0.81,0.84,0.87,0.91,0.96,1.04,1.16,1.28,1.20,1.12,1.06], // 后期冲高
  [1.12,1.08,1.04,1.00,0.96,0.92,0.88,0.84,0.80,0.92,1.08,1.24], // 末期反弹
  [0.92,0.96,1.04,1.18,1.06,0.94,0.88,0.96,1.12,1.24,1.10,0.98], // 双峰走势
  [1.00,0.98,1.02,1.05,1.01,0.97,1.00,1.04,1.02,0.99,1.03,1.01], // 小幅震荡
  [0.84,0.86,0.88,0.90,0.93,0.97,1.02,1.08,1.15,1.23,1.31,1.38], // 加速增长
  [1.24,1.20,1.16,1.11,1.05,0.98,0.92,0.87,0.83,0.80,0.78,0.77], // 减速下滑
  [0.88,0.92,0.98,1.05,1.14,1.22,1.16,1.08,1.00,0.95,0.91,0.89], // 活动后回落
  [1.02,0.96,0.90,0.86,0.92,1.04,1.18,1.10,0.98,0.92,1.00,1.14], // 不规则波动
];

const statRows: StatRow[] = mockEntities.flatMap(([gameId, gameName, developerId, developerName, companyName], entityIndex) =>
  mockDates.map((time, dateIndex) => {
    const base = 79000 - entityIndex * 3900;
    const timeFactor = trendProfiles[entityIndex][dateIndex];
    const wave = ((entityIndex * 13 + dateIndex * 17) % 11 - 5) * 170;
    const successAmount = Math.max(2800, Math.round((base * timeFactor + wave) / 10) * 10);
    const subsidyAmount = Math.round(successAmount * (0.048 + (entityIndex % 5) * 0.006) / 10) * 10;
    const failedAmount = Math.round(successAmount * (0.025 + ((entityIndex + dateIndex) % 4) * 0.007) / 10) * 10;
    const orderCount = Math.max(80, Math.round(successAmount / (52 + entityIndex % 6 * 4)));
    const failedOrders = 5 + (entityIndex * 3 + dateIndex * 2) % 28;
    const abnormalOrders = 1 + (entityIndex + dateIndex * 2) % 9;
    const successOrders = Math.max(1, orderCount - failedOrders - abnormalOrders);
    const couponCount = Math.round(orderCount * (0.18 + (entityIndex % 4) * 0.025));
    return {
      time, gameId, gameName, developerId, developerName, companyName,
      pendingAmount: successAmount + subsidyAmount,
      successAmount,
      failedAmount,
      subsidyAmount,
      couponCount,
      couponFace: couponCount * 20,
      orderCount,
      orderPeople: Math.round(orderCount * (0.66 + (entityIndex % 3) * 0.035)),
      successOrders,
      failedOrders,
      abnormalOrders,
    };
  })
);

const initialFilters = { startDate:'2026-08-01', endDate:'2026-08-10', game:'', developer:'', company:'' };

function money(value: number) {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function percent(subsidy: number, pending: number) {
  return pending ? `${(subsidy / pending * 100).toFixed(2)}%` : '0.00%';
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

function monthEnd(year: number, month: number) {
  const date = new Date(year, month + 1, 0);
  return isoDate(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, offset: number) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
  return isoDate(result.getFullYear(), result.getMonth(), result.getDate());
}

function StatsDateRangePicker({ start, end, precision, onChange }: { start: string; end: string; precision: string; onChange: (start: string, end: string) => void }) {
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

  const closePicker = () => {
    setWaitingForEnd(false);
    setOpen(false);
  };

  const chooseDay = (date: string) => {
    if (!waitingForEnd) {
      onChange(date, date);
      setWaitingForEnd(true);
      return;
    }
    onChange(date < start ? date : start, date < start ? start : date);
    closePicker();
  };

  const chooseMonth = (year: number, month: number) => {
    const selectedStart = isoDate(year, month, 1);
    const selectedEnd = monthEnd(year, month);
    if (!waitingForEnd) {
      onChange(selectedStart, selectedEnd);
      setWaitingForEnd(true);
      return;
    }
    if (selectedStart < start) onChange(selectedStart, monthEnd(Number(start.slice(0, 4)), Number(start.slice(5, 7)) - 1));
    else onChange(start.slice(0, 7) + '-01', selectedEnd);
    closePicker();
  };

  const chooseYear = (year: number) => {
    const selectedStart = `${year}-01-01`;
    const selectedEnd = `${year}-12-31`;
    if (!waitingForEnd) {
      onChange(selectedStart, selectedEnd);
      setWaitingForEnd(true);
      return;
    }
    if (selectedStart < start) onChange(selectedStart, `${start.slice(0, 4)}-12-31`);
    else onChange(`${start.slice(0, 4)}-01-01`, selectedEnd);
    closePicker();
  };

  const quickSelect = (kind: 'yesterday' | '7' | '30' | '90') => {
    const today = new Date();
    const todayText = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
    if (kind === 'yesterday') {
      const yesterday = addDays(today, -1);
      onChange(yesterday, yesterday);
    } else {
      onChange(addDays(today, -Number(kind)), todayText);
    }
    closePicker();
  };

  const renderMonth = (year: number, month: number) => <div className="kbi-calendar-month">
    <div className="kbi-calendar-title">{year} 年 {month + 1} 月</div>
    <div className="kbi-calendar-week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>
    <div className="kbi-calendar-grid">{monthCells(year, month).map((cell) => {
      const selected = cell.current && (cell.date === start || cell.date === end);
      const inRange = cell.current && cell.date > start && cell.date < end;
      return <button key={cell.date} className={`${cell.current ? '' : 'is-other'} ${selected ? 'is-selected' : ''} ${inRange ? 'is-range' : ''}`} onClick={() => chooseDay(cell.date)}><span>{cell.day}</span></button>;
    })}</div>
  </div>;

  const renderYearMonths = (year: number) => <div className="kbi-month-picker-year">
    <div className="kbi-month-picker-title">{year} 年</div>
    <div className="kbi-month-picker-grid">{Array.from({ length: 12 }, (_, month) => {
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const startMonth = start.slice(0, 7);
      const endMonth = end.slice(0, 7);
      const selected = monthKey === startMonth || monthKey === endMonth;
      const inRange = monthKey > startMonth && monthKey < endMonth;
      return <button key={monthKey} className={`${selected ? 'is-selected' : ''} ${inRange ? 'is-range' : ''}`} onClick={() => chooseMonth(year, month)}>{month + 1}月</button>;
    })}</div>
  </div>;

  const decadeStart = Math.floor(leftYear / 10) * 10;
  const renderYears = () => <div className="kbi-year-picker">
    <div className="kbi-year-picker-title">{decadeStart} 年 - {decadeStart + 9} 年</div>
    <div className="kbi-year-picker-grid">{Array.from({ length: 10 }, (_, index) => decadeStart + index).map((year) => {
      const startYear = Number(start.slice(0, 4));
      const endYear = Number(end.slice(0, 4));
      const selected = year === startYear || year === endYear;
      const inRange = year > startYear && year < endYear;
      return <button key={year} className={`${selected ? 'is-selected' : ''} ${inRange ? 'is-range' : ''}`} onClick={() => chooseYear(year)}>{year}</button>;
    })}</div>
  </div>;

  const displayStart = precision === 'year' ? start.slice(0, 4) : precision === 'month' ? start.slice(0, 7) : start;
  const displayEnd = precision === 'year' ? end.slice(0, 4) : precision === 'month' ? end.slice(0, 7) : end;

  return <div className="kbi-date-picker" ref={pickerRef}>
    <button className={`kbi-date-trigger ${open ? 'is-open' : ''}`} onClick={() => { setOpen((visible) => !visible); setWaitingForEnd(false); setViewDate(new Date(`${start}T00:00:00`)); }}><img src={calendarIcon} alt="" />{displayStart}<i>—</i>{displayEnd}</button>
    {open && <div className={`kbi-stats-date-popover is-${precision}`}>
      {precision === 'day' && <><div className="kbi-quick-ranges"><button onClick={() => quickSelect('yesterday')}>昨天</button><button onClick={() => quickSelect('7')}>过去7天</button><button onClick={() => quickSelect('30')}>过去30天</button><button onClick={() => quickSelect('90')}>过去90天</button></div><div className="kbi-stats-calendar-main"><div className="kbi-calendar-nav"><button aria-label="上一年" onClick={() => setViewDate((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1))}>«</button><button aria-label="上个月" onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>‹</button><span></span><button aria-label="下个月" onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>›</button><button aria-label="下一年" onClick={() => setViewDate((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1))}>»</button></div><div className="kbi-calendar-panels">{renderMonth(leftYear, leftMonth)}{renderMonth(rightDate.getFullYear(), rightDate.getMonth())}</div></div></>}
      {precision === 'month' && <><div className="kbi-stats-picker-nav"><button aria-label="上一组年份" onClick={() => setViewDate((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1))}>«</button><span></span><button aria-label="下一组年份" onClick={() => setViewDate((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1))}>»</button></div><div className="kbi-month-picker-panels">{renderYearMonths(leftYear)}{renderYearMonths(leftYear + 1)}</div></>}
      {precision === 'year' && <><div className="kbi-stats-picker-nav"><button aria-label="上十年" onClick={() => setViewDate((current) => new Date(current.getFullYear() - 10, current.getMonth(), 1))}>«</button><span></span><button aria-label="下十年" onClick={() => setViewDate((current) => new Date(current.getFullYear() + 10, current.getMonth(), 1))}>»</button></div>{renderYears()}</>}
    </div>}
  </div>;
}

function StatsPagination({ count, pageSize, currentPage, onPageSizeChange, onPageChange }: { count: number; pageSize: number; currentPage: number; onPageSizeChange: (size: number) => void; onPageChange: (page: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  return <div className="kbi-pagination"><span>共 {count} 条</span><select aria-label="每页条数" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}><option value="10">10条/页</option><option value="20">20条/页</option><option value="30">30条/页</option><option value="50">50条/页</option><option value="100">100条/页</option><option value="200">200条/页</option></select><button aria-label="上一页" disabled={currentPage === 1} onClick={() => onPageChange(Math.max(1, currentPage - 1))}>‹</button>{Array.from({ length: Math.min(6, totalPages) }, (_, index) => index + 1).map((pageNo) => <button key={pageNo} className={currentPage === pageNo ? 'is-current' : ''} onClick={() => onPageChange(pageNo)}>{pageNo}</button>)}{totalPages > 7 && <span className="kbi-page-ellipsis">…</span>}{totalPages > 6 && <button className={currentPage === totalPages ? 'is-current' : ''} onClick={() => onPageChange(totalPages)}>{totalPages}</button>}<button aria-label="下一页" disabled={currentPage === totalPages} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>›</button></div>;
}

function metricValue(row: StatRow, metric: string) {
  if (metric === '充值待结算金额') return row.successAmount;
  if (metric === '付费下载待结算金额') return Math.round(row.successAmount * .28 / 10) * 10;
  if (metric === '总收入') return row.successAmount + Math.round(row.successAmount * .28 / 10) * 10;
  if (metric === '成功金额') return row.successAmount;
  if (metric === '失败金额') return row.failedAmount;
  if (metric === '平台补贴金额') return row.subsidyAmount;
  if (metric === '订单次数') return row.orderCount;
  if (metric === '订单人数') return row.orderPeople;
  if (metric === '充值金额' || metric === '购买金额') return row.successAmount;
  return row.pendingAmount;
}

function StatsChart({ rows, mode, metric, times }: { rows: StatRow[]; mode: StatsMode; metric: string; times: string[] }) {
  const [visibleSeriesIds, setVisibleSeriesIds] = useState<string[]>([]);
  const [hoveredTimeIndex, setHoveredTimeIndex] = useState<number | null>(null);
  const colors = ['#4165d7','#22a06b','#e98b2a','#8b5cf6','#ef5b5b','#16a3b6','#d977b7','#75839a','#7aaa33','#b46b3c','#3d88c7','#9467bd','#3fa37c','#c8802c','#64748b'];
  const entityId = (row: StatRow) => mode === 'developer' ? row.developerId : mode === 'summary' ? 'summary' : row.gameId;
  const entityName = (row: StatRow) => mode === 'developer' ? row.developerName : mode === 'summary' ? '汇总' : row.gameName;
  const series = Array.from(new Map(rows.map((row) => [entityId(row), entityName(row)])).entries()).map(([id, name]) => ({
    id,
    name,
    values: times.map((time) => metricValue(rows.find((row) => entityId(row) === id && row.time === time) ?? ({ pendingAmount:0, successAmount:0, failedAmount:0, subsidyAmount:0, orderCount:0, orderPeople:0 } as StatRow), metric)),
  })).sort((leftSeries, rightSeries) => rightSeries.values.reduce((sum, value) => sum + value, 0) - leftSeries.values.reduce((sum, value) => sum + value, 0)).slice(0, 15);
  const seriesSignature = series.map((item) => item.id).join('|');
  useEffect(() => setVisibleSeriesIds(series.slice(0, Math.min(5, series.length)).map((item) => item.id)), [seriesSignature, metric, mode]);
  const visibleSeries = series.filter((item) => visibleSeriesIds.includes(item.id));
  const max = Math.max(...visibleSeries.flatMap((item) => item.values), 1);
  const left = 70;
  const right = 850;
  const top = 50;
  const bottom = 300;
  const xAt = (index: number) => times.length === 1 ? (left + right) / 2 : left + index * ((right - left) / (times.length - 1));
  const yAt = (value: number) => bottom - value / max * (bottom - top);
  const hoveredX = hoveredTimeIndex !== null ? xAt(hoveredTimeIndex) : 0;
  const tooltipColumns = visibleSeries.length > 8 ? 2 : 1;
  const tooltipRows = Math.ceil(visibleSeries.length / tooltipColumns);
  const tooltipColumnWidth = 220;
  const tooltipWidth = tooltipColumnWidth * tooltipColumns;
  const tooltipHeight = 38 + tooltipRows * 22;
  const tooltipX = Math.min(right - tooltipWidth, Math.max(left + 8, hoveredX + 14));
  const tooltipY = top + 4;
  return <div className="kbi-line-chart kbi-multi-line-chart" aria-label={`${metric}${series.length > 1 ? ' Top15对象' : ''}折线图`}>
    <svg viewBox="0 0 900 360" role="img" onMouseLeave={() => setHoveredTimeIndex(null)}>
      {Array.from({ length: 6 }, (_, index) => {
        const y = top + index * ((bottom - top) / 5);
        return <g key={index}><line x1={left} x2={right} y1={y} y2={y} className="kbi-chart-grid"/><text x={left - 10} y={y + 4} textAnchor="end">{Math.round(max * (1 - index / 5)).toLocaleString('zh-CN')}</text></g>;
      })}
      {visibleSeries.map((item) => {
        const seriesIndex = series.findIndex((seriesItem) => seriesItem.id === item.id);
        const points = item.values.map((value, index) => ({ x:xAt(index), y:yAt(value), value }));
        const color = colors[seriesIndex % colors.length];
        return <g key={item.id} className="kbi-line-series"><polyline points={points.map((point) => `${point.x},${point.y}`).join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>{points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="2" fill="#fff" stroke={color} strokeWidth="1.4"/>)}</g>;
      })}
      {times.map((time, index) => {
        const previousX = index === 0 ? left : (xAt(index - 1) + xAt(index)) / 2;
        const nextX = index === times.length - 1 ? right : (xAt(index) + xAt(index + 1)) / 2;
        return <rect key={`hit-${time}`} x={previousX} y={top} width={Math.max(1, nextX - previousX)} height={bottom - top} fill="transparent" className="kbi-line-time-hit" onMouseEnter={() => setHoveredTimeIndex(index)}/>;
      })}
      {times.map((time, index) => <text key={time} x={xAt(index)} y="326" textAnchor="middle">{time}</text>)}
      {hoveredTimeIndex !== null && <g className="kbi-line-tooltip" pointerEvents="none">
        <line x1={hoveredX} x2={hoveredX} y1={top} y2={bottom} className="kbi-line-hover-guide"/>
        <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} rx="4"/>
        <text x={tooltipX + 13} y={tooltipY + 22} className="kbi-line-tooltip-title">{times[hoveredTimeIndex]}</text>
        {visibleSeries.map((item, index) => {
          const seriesIndex = series.findIndex((seriesItem) => seriesItem.id === item.id);
          const value = item.values[hoveredTimeIndex];
          const valueText = metric.includes('金额') ? money(value) : value.toLocaleString('zh-CN');
          const columnIndex = Math.floor(index / tooltipRows);
          const rowIndex = index % tooltipRows;
          const columnX = tooltipX + columnIndex * tooltipColumnWidth;
          const rowY = tooltipY + 44 + rowIndex * 22;
          return <g key={item.id}><circle cx={columnX + 17} cy={rowY - 4} r="4" fill={colors[seriesIndex % colors.length]}/><text x={columnX + 29} y={rowY}>{item.name}</text><text x={columnX + tooltipColumnWidth - 12} y={rowY} textAnchor="end">{valueText}</text></g>;
        })}
      </g>}
    </svg>
    {series.length > 1 && <div className="kbi-series-legend">{series.map((item, index) => {
      const selected = visibleSeriesIds.includes(item.id);
      return <button type="button" key={item.id} className={selected ? 'is-selected' : ''} aria-pressed={selected} onClick={() => setVisibleSeriesIds((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])}><i style={{ background: colors[index % colors.length] }}></i>{item.name}</button>;
    })}</div>}
  </div>;
}

function StatsBarChart({ rows, mode, dimension, includeFailedAmount = true, totalIncomeOnly = false }: { rows: StatRow[]; mode: StatsMode; dimension: 'income' | 'orders'; includeFailedAmount?: boolean; totalIncomeOnly?: boolean }) {
  const [hoveredSegment, setHoveredSegment] = useState<{ entryIndex:number; metricIndex:number } | null>(null);
  const entityId = (row: StatRow) => mode === 'developer' ? row.developerId : mode === 'summary' ? 'summary' : row.gameId;
  const entityName = (row: StatRow) => mode === 'developer' ? row.developerName : mode === 'summary' ? '汇总' : row.gameName;
  const metrics = totalIncomeOnly
    ? [{ label:'总收入', color:'#4165D7' }]
    : dimension === 'orders'
    ? [{ label:'订单次数', color:'#DCE5FF' }, { label:'订单人数', color:'#4165D7' }]
    : [{ label:'待结算金额', color:'#DCE5FF' }, { label:'成功金额', color:'#4165D7' }, ...(includeFailedAmount ? [{ label:'失败金额', color:'#E6A23C' }] : [])];
  const [visibleMetrics, setVisibleMetrics] = useState<string[]>(() => metrics.map((item) => item.label));
  useEffect(() => {
    setVisibleMetrics(metrics.map((item) => item.label));
    setHoveredSegment(null);
  }, [dimension, includeFailedAmount, mode, totalIncomeOnly]);
  const entries = Array.from(rows.reduce((groups, row) => {
    const id = entityId(row);
    const existing = groups.get(id);
    const values = metrics.map((item, index) => (existing?.values[index] ?? 0) + metricValue(row, item.label));
    groups.set(id, { id, label:entityName(row), values, total:values[0] });
    return groups;
  }, new Map<string, { id:string; label:string; values:number[]; total:number }>()).values()).sort((left, right) => right.total - left.total).slice(0, 15);
  const visibleMetricIndexes = metrics.map((item, index) => visibleMetrics.includes(item.label) ? index : -1).filter((index) => index >= 0);
  const max = Math.max(...entries.flatMap((entry) => visibleMetricIndexes.map((metricIndex) => entry.values[metricIndex])), 1);
  const left = 76;
  const right = 850;
  const top = 36;
  const bottom = 292;
  const slot = (right - left) / Math.max(entries.length, 1);
  const barWidth = Math.min(42, slot * .62);
  const labelCharactersPerLine = Math.max(2, Math.floor((slot - 8) / 11));
  const splitLabel = (label: string) => Array.from({ length: Math.ceil(label.length / labelCharactersPerLine) }, (_, index) => label.slice(index * labelCharactersPerLine, index * labelCharactersPerLine + labelCharactersPerLine));
  const displayValue = (label: string, value: number) => label.includes('金额') ? money(value) : value.toLocaleString('zh-CN');
  return <div className="kbi-svg-bar-chart kbi-summary-bar-chart kbi-stacked-bar-chart" aria-label={`${dimension === 'income' ? '收入' : '订单数'}指标分层柱状图`}>
    <svg viewBox="0 0 900 380" role="img" onMouseLeave={() => setHoveredSegment(null)}>
      {Array.from({ length: 6 }, (_, index) => {
        const y = top + index * ((bottom - top) / 5);
        return <g key={index}><line x1={left} x2={right} y1={y} y2={y} className="kbi-bar-grid"/><text x={left - 10} y={y + 4} textAnchor="end" className="kbi-bar-axis-label">{Math.round(max * (1 - index / 5)).toLocaleString('zh-CN')}</text></g>;
      })}
      <line x1={left} x2={right} y1={bottom} y2={bottom} className="kbi-bar-axis"/>
      {entries.map((entry, index) => {
        const center = entries.length === 1 ? (left + right) / 2 : left + index * slot + slot / 2;
        return <g key={entry.id} className="kbi-bar-group">{entry.values.map((value, metricIndex) => {
          if (!visibleMetrics.includes(metrics[metricIndex].label)) return null;
          const height = value <= 0 ? 0 : Math.max(2, value / max * (bottom - top));
          const segmentWidth = barWidth;
          const x = center - segmentWidth / 2;
          const y = bottom - height;
          return <rect key={metrics[metricIndex].label} x={x} y={y} width={segmentWidth} height={height} fill={metrics[metricIndex].color} className="kbi-stacked-segment" onMouseEnter={() => setHoveredSegment({ entryIndex:index, metricIndex })}/>;
        })}<text x={center} y={bottom + 18} textAnchor="middle" className="kbi-bar-x-label">{splitLabel(entry.label).map((line, lineIndex) => <tspan key={lineIndex} x={center} dy={lineIndex ? 14 : 0}>{line}</tspan>)}</text></g>;
      })}
      {hoveredSegment && entries[hoveredSegment.entryIndex] && (() => {
        const entry = entries[hoveredSegment.entryIndex];
        const center = entries.length === 1 ? (left + right) / 2 : left + hoveredSegment.entryIndex * slot + slot / 2;
        const boxWidth = 220;
        const visibleItems = metrics.map((item, metricIndex) => ({ ...item, metricIndex })).filter((item) => visibleMetrics.includes(item.label));
        const boxHeight = 38 + visibleItems.length * 22;
        const boxX = Math.min(right - boxWidth, Math.max(left + 6, center - boxWidth / 2));
        return <g className="kbi-bar-tooltip" pointerEvents="none"><line x1={center} x2={center} y1={top} y2={bottom} className="kbi-bar-hover-line"/><rect x={boxX} y="82" width={boxWidth} height={boxHeight} rx="4"/><text x={boxX + 12} y="105" className="kbi-bar-tooltip-title">{entry.label}</text>{visibleItems.map((item, visibleIndex) => {
          const rowY = 128 + visibleIndex * 22;
          return <g key={item.label}><circle cx={boxX + 16} cy={rowY - 4} r="4" style={{ fill:item.color }}/><text x={boxX + 27} y={rowY}>{item.label}：</text><text x={boxX + boxWidth - 12} y={rowY} textAnchor="end">{displayValue(item.label, entry.values[item.metricIndex])}</text></g>;
        })}</g>;
      })()}
    </svg>
    <div className="kbi-stacked-legend">{metrics.map((item) => {
      const selected = visibleMetrics.includes(item.label);
      return <button type="button" key={item.label} className={selected ? 'is-selected' : ''} aria-pressed={selected} onClick={() => { setVisibleMetrics((current) => current.includes(item.label) ? current.filter((label) => label !== item.label) : [...current, item.label]); setHoveredSegment(null); }}><i style={{ background:item.color }}></i>{item.label}</button>;
    })}</div>
  </div>;
}

export default function RechargeStats({ page, setPage, showToast }: { page: RechargeStatsPageId; setPage: (pageId: string) => void; showToast: (message: string) => void }) {
  const current = pageOptions.find((option) => option.id === page) ?? pageOptions[0];
  const mode = current.mode;
  const isPaidDownload = page.startsWith('mobile-paid-download-');
  const isIncomeStats = page.startsWith('mobile-income-');
  const [filters, setFilters] = useState(initialFilters);
  const [precision, setPrecision] = useState('day');
  const [rangeMode, setRangeMode] = useState<'interval' | 'cumulative'>('interval');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [metric, setMetric] = useState('待结算金额');
  const [barDimension, setBarDimension] = useState<'income' | 'orders'>('income');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderDrill, setOrderDrill] = useState<'count' | 'people' | null>(null);
  const [orderDrillRow, setOrderDrillRow] = useState<StatRow | null>(null);

  const filteredRows = useMemo(() => statRows.filter((row) => {
    const gameText = `${row.gameId} ${row.gameName}`.toLowerCase();
    const developerText = `${row.developerId} ${row.developerName}`.toLowerCase();
    return row.time >= filters.startDate && row.time <= filters.endDate
      && gameText.includes(filters.game.trim().toLowerCase())
      && developerText.includes(filters.developer.trim().toLowerCase())
      && row.companyName.toLowerCase().includes(filters.company.trim().toLowerCase());
  }).map((row) => ({ ...row, pendingAmount: row.successAmount + row.subsidyAmount })), [filters]);

  const displayRows = useMemo(() => {
    const groups = new Map<string, StatRow>();
    const grain = (time: string) => precision === 'year' ? time.slice(0, 4) : precision === 'month' ? time.slice(0, 7) : time;
    const rangeStart = grain(filters.startDate);
    const rangeEnd = grain(filters.endDate);
    const actualRange = rangeStart === rangeEnd ? rangeStart : `${rangeStart} — ${rangeEnd}`;
    const entityKey = (row: StatRow) => mode === 'developer' ? row.developerId : mode === 'summary' ? 'summary' : row.gameId;
    filteredRows.forEach((row) => {
      const key = rangeMode === 'cumulative' ? entityKey(row) : `${grain(row.time)}-${entityKey(row)}`;
      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, { ...row, time: rangeMode === 'cumulative' ? actualRange : grain(row.time) });
        return;
      }
      groups.set(key, {
        ...existing,
        pendingAmount: existing.pendingAmount + row.pendingAmount,
        successAmount: existing.successAmount + row.successAmount,
        failedAmount: existing.failedAmount + row.failedAmount,
        subsidyAmount: existing.subsidyAmount + row.subsidyAmount,
        couponCount: existing.couponCount + row.couponCount,
        couponFace: existing.couponFace + row.couponFace,
        orderCount: existing.orderCount + row.orderCount,
        orderPeople: existing.orderPeople + row.orderPeople,
        successOrders: existing.successOrders + row.successOrders,
        failedOrders: existing.failedOrders + row.failedOrders,
        abnormalOrders: existing.abnormalOrders + row.abnormalOrders,
      });
    });
    const rows = Array.from(groups.values());
    if (rangeMode === 'cumulative') return rows;
    return rows.sort((left, right) => right.time.localeCompare(left.time));
  }, [filteredRows, filters.startDate, filters.endDate, mode, precision, rangeMode]);

  const totals = useMemo(() => displayRows.reduce((total, row) => ({
    pendingAmount: total.pendingAmount + row.pendingAmount,
    successAmount: total.successAmount + row.successAmount,
    failedAmount: total.failedAmount + row.failedAmount,
    subsidyAmount: total.subsidyAmount + row.subsidyAmount,
    couponCount: total.couponCount + row.couponCount,
    couponFace: total.couponFace + row.couponFace,
    orderCount: total.orderCount + row.orderCount,
    orderPeople: total.orderPeople + row.orderPeople,
  }), { pendingAmount:0, successAmount:0, failedAmount:0, subsidyAmount:0, couponCount:0, couponFace:0, orderCount:0, orderPeople:0 }), [displayRows]);
  const totalPages = Math.max(1, Math.ceil(displayRows.length / pageSize));
  const paginatedRows = useMemo(() => displayRows.slice((currentPage - 1) * pageSize, currentPage * pageSize), [currentPage, displayRows, pageSize]);
  useEffect(() => setCurrentPage(1), [filters, mode, pageSize, precision, rangeMode]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const setFilter = (key: keyof typeof initialFilters, value: string) => setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  const openOrderDrill = (type: 'count' | 'people', row: StatRow | null) => {
    setOrderDrill(type);
    setOrderDrillRow(row);
  };
  const orderDrillTotal = orderDrill === 'count'
    ? (orderDrillRow?.orderCount ?? totals.orderCount)
    : (orderDrillRow?.orderPeople ?? totals.orderPeople);
  const giftedOrderMetric = Math.round(orderDrillTotal * .08);
  const purchasedOrderMetric = orderDrillTotal - giftedOrderMetric;
  const timeText = (time: string) => time.includes('—') ? time : precision === 'year' ? time.slice(0, 4) : precision === 'month' ? time.slice(0, 7) : time;
  const chartMetrics = isIncomeStats
    ? ['总收入']
    : isPaidDownload
    ? ['待结算金额', '成功金额', '订单次数', '订单人数']
    : ['待结算金额', '成功金额', '失败金额', '订单次数', '订单人数'];
  const chartEntityCount = useMemo(() => {
    if (mode === 'summary') return 1;
    const entityIds = new Set(filteredRows.map((row) => mode === 'developer' ? row.developerId : row.gameId));
    return entityIds.size;
  }, [filteredRows, mode]);
  const singleEntityName = chartEntityCount === 1 && filteredRows.length
    ? mode === 'developer' ? filteredRows[0].developerName : mode === 'game' ? filteredRows[0].gameName : ''
    : '';
  const chartRuleLines = isIncomeStats ? [
    '「周期明细」展示“总收入”的时间趋势折线；多个统计对象默认显示 Top5，并可选择 Top15。',
    '「区间汇总」展示“总收入”柱状图；多个统计对象展示 Top15。',
    'Top15 选择逻辑：按统计对象在当前完整查询时间区间内的“总收入”汇总值降序选取 Top15。',
  ] : [
    '「周期明细」展示时间趋势折线，多个统计对象默认显示 Top5，并可选择 Top15。',
    '「区间汇总」可按“收入”或“订单数”维度查看分层柱状图；多个统计对象展示 Top15。',
    'Top15 选择逻辑：「周期明细」按当前选中指标的时间区间汇总数值后降序选取 Top15；「区间汇总」中“收入”维度按“待结算金额”降序选取 Top15；“订单数”维度按“订单次数”降序选取 Top15。',
  ];
  const chartRows = useMemo(() => {
    const groups = new Map<string, StatRow>();
    const grain = (time: string) => precision === 'year' ? time.slice(0, 4) : precision === 'month' ? time.slice(0, 7) : time;
    const entityKey = (row: StatRow) => mode === 'developer' ? row.developerId : row.gameId;
    const topEntityIds = mode === 'summary' ? new Set(['summary']) : new Set(Array.from(filteredRows.reduce((totalsByEntity, row) => {
      const id = entityKey(row);
      totalsByEntity.set(id, (totalsByEntity.get(id) ?? 0) + metricValue(row, metric));
      return totalsByEntity;
    }, new Map<string, number>()).entries()).sort((left, right) => right[1] - left[1]).slice(0, 15).map(([id]) => id));
    filteredRows.forEach((row) => {
      const id = mode === 'summary' ? 'summary' : entityKey(row);
      if (!topEntityIds.has(id)) return;
      const key = `${grain(row.time)}-${id}`;
      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, { ...row, time: grain(row.time) });
        return;
      }
      groups.set(key, {
        ...existing,
        pendingAmount: existing.pendingAmount + row.pendingAmount,
        successAmount: existing.successAmount + row.successAmount,
        failedAmount: existing.failedAmount + row.failedAmount,
        subsidyAmount: existing.subsidyAmount + row.subsidyAmount,
        couponCount: existing.couponCount + row.couponCount,
        couponFace: existing.couponFace + row.couponFace,
        orderCount: existing.orderCount + row.orderCount,
        orderPeople: existing.orderPeople + row.orderPeople,
        successOrders: existing.successOrders + row.successOrders,
        failedOrders: existing.failedOrders + row.failedOrders,
        abnormalOrders: existing.abnormalOrders + row.abnormalOrders,
      });
    });
    const rows = Array.from(groups.values());
    return rows.sort((left, right) => left.time.localeCompare(right.time));
  }, [filteredRows, metric, mode, precision]);
  const chartPeriod = precision === 'year' ? (filters.startDate.slice(0, 4) === filters.endDate.slice(0, 4) ? filters.startDate.slice(0, 4) : `${filters.startDate.slice(0, 4)} — ${filters.endDate.slice(0, 4)}`) : precision === 'month' ? `${filters.startDate.slice(0, 7)} — ${filters.endDate.slice(0, 7)}` : (filters.startDate === filters.endDate ? filters.startDate : `${filters.startDate} — ${filters.endDate}`);
  const chartTimes = useMemo(() => {
    if (precision === 'year') {
      const startYear = Number(filters.startDate.slice(0, 4));
      const endYear = Number(filters.endDate.slice(0, 4));
      return Array.from({ length: endYear - startYear + 1 }, (_, index) => String(startYear + index));
    }
    if (precision === 'month') {
      const startDate = new Date(Number(filters.startDate.slice(0, 4)), Number(filters.startDate.slice(5, 7)) - 1, 1);
      const endDate = new Date(Number(filters.endDate.slice(0, 4)), Number(filters.endDate.slice(5, 7)) - 1, 1);
      const months: string[] = [];
      for (const cursor = new Date(startDate); cursor <= endDate; cursor.setMonth(cursor.getMonth() + 1)) {
        months.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
      }
      return months;
    }
    const startDate = new Date(`${filters.startDate}T00:00:00`);
    const endDate = new Date(`${filters.endDate}T00:00:00`);
    const days: string[] = [];
    for (const cursor = new Date(startDate); cursor <= endDate; cursor.setDate(cursor.getDate() + 1)) {
      days.push(isoDate(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()));
    }
    return days;
  }, [filters.endDate, filters.startDate, precision]);

  useEffect(() => { setMetric(isIncomeStats ? '总收入' : '待结算金额'); setBarDimension('income'); }, [isIncomeStats, mode]);

  const renderTotalRow = () => {
    if (!displayRows.length) return null;
    if (isIncomeStats && mode === 'game') return <tr className="kbi-total-row"><td>查询总计</td><td></td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(Math.round(totals.successAmount * .28 / 10) * 10)}</td><td className="is-number">{money(totals.successAmount + Math.round(totals.successAmount * .28 / 10) * 10)}</td></tr>;
    if (isIncomeStats && mode === 'developer') return <tr className="kbi-total-row"><td>查询总计</td><td colSpan={2}></td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(Math.round(totals.successAmount * .28 / 10) * 10)}</td><td className="is-number">{money(totals.successAmount + Math.round(totals.successAmount * .28 / 10) * 10)}</td></tr>;
    if (isPaidDownload && mode === 'game') return <tr className="kbi-total-row"><td>查询总计</td><td colSpan={3}></td><td className="is-number">{money(totals.pendingAmount)}</td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(totals.subsidyAmount)}</td><td className="is-number">{percent(totals.subsidyAmount, totals.pendingAmount)}</td><td className="is-number">{totals.couponCount.toLocaleString('zh-CN')}</td><td className="is-number">{money(totals.couponFace)}</td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('count', null)}>{totals.orderCount.toLocaleString('zh-CN')}</button></td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('people', null)}>{totals.orderPeople.toLocaleString('zh-CN')}</button></td></tr>;
    if (isPaidDownload && mode === 'developer') return <tr className="kbi-total-row"><td>查询总计</td><td colSpan={2}></td><td className="is-number">{money(totals.pendingAmount)}</td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(totals.subsidyAmount)}</td><td className="is-number">{percent(totals.subsidyAmount, totals.pendingAmount)}</td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('count', null)}>{totals.orderCount.toLocaleString('zh-CN')}</button></td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('people', null)}>{totals.orderPeople.toLocaleString('zh-CN')}</button></td></tr>;
    if (isPaidDownload && mode === 'summary') return <tr className="kbi-total-row"><td>查询总计</td><td className="is-number">{money(totals.pendingAmount)}</td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(totals.subsidyAmount)}</td><td className="is-number">{percent(totals.subsidyAmount, totals.pendingAmount)}</td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('count', null)}>{totals.orderCount.toLocaleString('zh-CN')}</button></td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('people', null)}>{totals.orderPeople.toLocaleString('zh-CN')}</button></td></tr>;
    if (mode === 'game') return <tr className="kbi-total-row"><td>查询总计</td><td colSpan={2}></td><td className="is-number">{money(totals.pendingAmount)}</td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(totals.failedAmount)}</td><td className="is-number">{money(totals.subsidyAmount)}</td><td className="is-number">{percent(totals.subsidyAmount, totals.pendingAmount)}</td><td className="is-number">{totals.couponCount.toLocaleString('zh-CN')}</td><td className="is-number">{money(totals.couponFace)}</td><td className="is-number">{totals.orderCount.toLocaleString('zh-CN')}</td><td className="is-number">{totals.orderPeople.toLocaleString('zh-CN')}</td></tr>;
    if (mode === 'developer') return <tr className="kbi-total-row"><td>查询总计</td><td colSpan={2}></td><td className="is-number">{money(totals.pendingAmount)}</td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(totals.failedAmount)}</td><td className="is-number">{money(totals.subsidyAmount)}</td><td className="is-number">{percent(totals.subsidyAmount, totals.pendingAmount)}</td><td className="is-number">{totals.orderCount.toLocaleString('zh-CN')}</td><td className="is-number">{totals.orderPeople.toLocaleString('zh-CN')}</td></tr>;
    return <tr className="kbi-total-row"><td>查询总计</td><td className="is-number">{money(totals.pendingAmount)}</td><td className="is-number">{money(totals.successAmount)}</td><td className="is-number">{money(totals.failedAmount)}</td><td className="is-number">{money(totals.subsidyAmount)}</td><td className="is-number">{percent(totals.subsidyAmount, totals.pendingAmount)}</td><td className="is-number">{totals.orderCount.toLocaleString('zh-CN')}</td><td className="is-number">{totals.orderPeople.toLocaleString('zh-CN')}</td></tr>;
  };

  return <>
    <section className="kbi-card">
      <div className="kbi-querybar kbi-stats-querybar">
        <StatsViewSelect value={page} onChange={setPage}/>
        <button className="kbi-chart-button" aria-label="打开统计图" title="打开统计图" onClick={() => setDrawerOpen(true)}><ChartLine size={19}/></button>
        <span className="kbi-query-divider" aria-hidden="true"></span>
        <StatsCompactSelect label="展示方式" className="kbi-range-mode-select" value={rangeMode} options={[{ value:'interval', label:'周期明细' }, { value:'cumulative', label:'区间汇总' }]} onChange={(value) => setRangeMode(value as 'interval' | 'cumulative')}/>
        <StatsCompactSelect label="时间精度" className="kbi-precision-select" value={precision} options={[{ value:'day', label:'按日' }, { value:'month', label:'按月' }, { value:'year', label:'按年' }]} onChange={setPrecision}/>
        <StatsDateRangePicker start={filters.startDate} end={filters.endDate} precision={precision} onChange={(startDate, endDate) => setFilters((currentFilters) => ({ ...currentFilters, startDate, endDate }))}/>
        {(mode === 'game' || mode === 'summary') && <input aria-label="游戏ID / 名称" value={filters.game} onChange={(event) => setFilter('game', event.target.value)} placeholder="游戏ID / 名称"/>}
        {!isIncomeStats && (mode === 'game' || mode === 'developer' || mode === 'summary') && <input aria-label="开发者ID / 名称" value={filters.developer} onChange={(event) => setFilter('developer', event.target.value)} placeholder="开发者ID / 名称"/>}
        {(mode === 'developer' || (!isIncomeStats && (mode === 'game' || mode === 'summary'))) && <input aria-label="公司 / 个人名称" value={filters.company} onChange={(event) => setFilter('company', event.target.value)} placeholder="公司 / 个人名称"/>}
        <button className="kbi-btn kbi-btn-primary" onClick={() => showToast(`已创建${current.label}导出任务（原型示意）`)}>导出</button>
      </div>

      <div className="kbi-table-wrap kbi-stats-table-wrap">
        <table className={`kbi-stats-table kbi-stats-table-${mode}`}>
          <thead>{isIncomeStats && mode === 'game' ? <tr><th>时间</th><th>游戏ID / 名称</th><th className="is-number">充值待结算金额</th><th className="is-number">付费下载待结算金额</th><th className="is-number">总收入</th></tr>
            : isIncomeStats && mode === 'developer' ? <tr><th>时间</th><th>开发者ID / 名称</th><th>公司 / 个人名称</th><th className="is-number">充值待结算金额</th><th className="is-number">付费下载待结算金额</th><th className="is-number">总收入</th></tr>
            : isPaidDownload && mode === 'game' ? <tr><th>时间</th><th>游戏ID / 名称</th><th>开发者ID / 名称</th><th>公司 / 个人名称</th><th className="is-number">待结算金额</th><th className="is-number">成功金额</th><th className="is-number">平台补贴金额</th><th className="is-number">平台补贴占比</th><th className="is-number">券使用数</th><th className="is-number">券面额</th><th className="is-number">订单次数</th><th className="is-number">订单人数</th></tr>
            : isPaidDownload && mode === 'developer' ? <tr><th>时间</th><th>开发者ID / 名称</th><th>公司 / 个人名称</th><th className="is-number">待结算金额</th><th className="is-number">成功金额</th><th className="is-number">平台补贴金额</th><th className="is-number">平台补贴占比</th><th className="is-number">订单次数</th><th className="is-number">订单人数</th></tr>
            : isPaidDownload && mode === 'summary' ? <tr><th>时间</th><th className="is-number">待结算金额</th><th className="is-number">成功金额</th><th className="is-number">平台补贴金额</th><th className="is-number">平台补贴占比</th><th className="is-number">订单次数</th><th className="is-number">订单人数</th></tr>
            : mode === 'game' ? <tr><th>时间</th><th>游戏ID / 名称</th><th>开发者ID / 名称</th><th className="is-number">待结算金额</th><th className="is-number">成功金额</th><th className="is-number">失败金额</th><th className="is-number">平台补贴金额</th><th className="is-number">平台补贴占比</th><th className="is-number">券使用数</th><th className="is-number">券面额</th><th className="is-number">订单次数</th><th className="is-number">订单人数</th></tr>
            : mode === 'developer' ? <tr><th>时间</th><th>开发者ID / 名称</th><th>公司 / 个人名称</th><th className="is-number">待结算金额</th><th className="is-number">成功金额</th><th className="is-number">失败金额</th><th className="is-number">平台补贴金额</th><th className="is-number">平台补贴占比</th><th className="is-number">订单次数</th><th className="is-number">订单人数</th></tr>
            : <tr><th>时间</th><th className="is-number">待结算金额</th><th className="is-number">成功金额</th><th className="is-number">失败金额</th><th className="is-number">平台补贴金额</th><th className="is-number">平台补贴占比</th><th className="is-number">订单次数</th><th className="is-number">订单人数</th></tr>}</thead>
          <tbody>
            {renderTotalRow()}
            {paginatedRows.map((row, index) => isIncomeStats && mode === 'game' ? <tr key={`${row.time}-${row.gameId}-${index}`}><td>{timeText(row.time)}</td><td>{row.gameId} / {row.gameName}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(Math.round(row.successAmount * .28 / 10) * 10)}</td><td className="is-number">{money(row.successAmount + Math.round(row.successAmount * .28 / 10) * 10)}</td></tr>
              : isIncomeStats && mode === 'developer' ? <tr key={`${row.time}-${row.developerId}-${index}`}><td>{timeText(row.time)}</td><td>{row.developerId} / {row.developerName}</td><td>{row.companyName}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(Math.round(row.successAmount * .28 / 10) * 10)}</td><td className="is-number">{money(row.successAmount + Math.round(row.successAmount * .28 / 10) * 10)}</td></tr>
              : isPaidDownload && mode === 'game' ? <tr key={`${row.time}-${row.gameId}-${index}`}><td>{timeText(row.time)}</td><td>{row.gameId} / {row.gameName}</td><td>{row.developerId} / {row.developerName}</td><td>{row.companyName}</td><td className="is-number">{money(row.pendingAmount)}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(row.subsidyAmount)}</td><td className="is-number">{percent(row.subsidyAmount, row.pendingAmount)}</td><td className="is-number">{row.couponCount.toLocaleString('zh-CN')}</td><td className="is-number">{money(row.couponFace)}</td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('count', row)}>{row.orderCount.toLocaleString('zh-CN')}</button></td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('people', row)}>{row.orderPeople.toLocaleString('zh-CN')}</button></td></tr>
              : isPaidDownload && mode === 'developer' ? <tr key={`${row.time}-${row.developerId}-${index}`}><td>{timeText(row.time)}</td><td>{row.developerId} / {row.developerName}</td><td>{row.companyName}</td><td className="is-number">{money(row.pendingAmount)}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(row.subsidyAmount)}</td><td className="is-number">{percent(row.subsidyAmount, row.pendingAmount)}</td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('count', row)}>{row.orderCount.toLocaleString('zh-CN')}</button></td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('people', row)}>{row.orderPeople.toLocaleString('zh-CN')}</button></td></tr>
              : isPaidDownload && mode === 'summary' ? <tr key={`${row.time}-${index}`}><td>{timeText(row.time)}</td><td className="is-number">{money(row.pendingAmount)}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(row.subsidyAmount)}</td><td className="is-number">{percent(row.subsidyAmount, row.pendingAmount)}</td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('count', row)}>{row.orderCount.toLocaleString('zh-CN')}</button></td><td className="is-number"><button className="kbi-drill" onClick={() => openOrderDrill('people', row)}>{row.orderPeople.toLocaleString('zh-CN')}</button></td></tr>
              : mode === 'game' ? <tr key={`${row.time}-${row.gameId}-${index}`}><td>{timeText(row.time)}</td><td>{row.gameId} / {row.gameName}</td><td>{row.developerId} / {row.developerName}</td><td className="is-number">{money(row.pendingAmount)}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(row.failedAmount)}</td><td className="is-number">{money(row.subsidyAmount)}</td><td className="is-number">{percent(row.subsidyAmount, row.pendingAmount)}</td><td className="is-number">{row.couponCount.toLocaleString('zh-CN')}</td><td className="is-number">{money(row.couponFace)}</td><td className="is-number">{row.orderCount.toLocaleString('zh-CN')}</td><td className="is-number">{row.orderPeople.toLocaleString('zh-CN')}</td></tr>
              : mode === 'developer' ? <tr key={`${row.time}-${row.developerId}-${index}`}><td>{timeText(row.time)}</td><td>{row.developerId} / {row.developerName}</td><td>{row.companyName}</td><td className="is-number">{money(row.pendingAmount)}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(row.failedAmount)}</td><td className="is-number">{money(row.subsidyAmount)}</td><td className="is-number">{percent(row.subsidyAmount, row.pendingAmount)}</td><td className="is-number">{row.orderCount.toLocaleString('zh-CN')}</td><td className="is-number">{row.orderPeople.toLocaleString('zh-CN')}</td></tr>
              : <tr key={`${row.time}-${index}`}><td>{timeText(row.time)}</td><td className="is-number">{money(row.pendingAmount)}</td><td className="is-number">{money(row.successAmount)}</td><td className="is-number">{money(row.failedAmount)}</td><td className="is-number">{money(row.subsidyAmount)}</td><td className="is-number">{percent(row.subsidyAmount, row.pendingAmount)}</td><td className="is-number">{row.orderCount.toLocaleString('zh-CN')}</td><td className="is-number">{row.orderPeople.toLocaleString('zh-CN')}</td></tr>)}
            {!displayRows.length && <tr><td className="kbi-empty" colSpan={isIncomeStats ? (mode === 'game' ? 5 : 6) : isPaidDownload ? (mode === 'game' ? 12 : mode === 'developer' ? 9 : 7) : mode === 'game' ? 12 : mode === 'developer' ? 10 : 8}>暂无数据</td></tr>}
          </tbody>
        </table>
      </div>
      <StatsPagination count={displayRows.length} pageSize={pageSize} currentPage={currentPage} onPageSizeChange={setPageSize} onPageChange={setCurrentPage}/>
    </section>

    {drawerOpen && <div className="kbi-drawer-mask" onMouseDown={() => setDrawerOpen(false)}><aside className="kbi-chart-drawer" role="dialog" aria-modal="true" aria-label="统计图" onMouseDown={(event) => event.stopPropagation()}><header><strong>统计图</strong><button aria-label="关闭统计图" onClick={() => setDrawerOpen(false)}><X size={18}/></button></header><div className="kbi-chart-drawer-body"><div className="kbi-chart-rule">{chartRuleLines.map((line) => <p key={line}>{line}</p>)}</div><div className="kbi-chart-toolbar"><div className="kbi-chart-context"><strong>{chartPeriod}{singleEntityName && <>　{singleEntityName}</>}</strong></div>{rangeMode === 'interval' ? <select aria-label="图表指标" value={metric} onChange={(event) => setMetric(event.target.value)}>{chartMetrics.map((option) => <option key={option}>{option}</option>)}</select> : !isIncomeStats && <select aria-label="柱状图维度" value={barDimension} onChange={(event) => setBarDimension(event.target.value as 'income' | 'orders')}><option value="income">收入</option><option value="orders">订单数</option></select>}</div>{rangeMode === 'cumulative' ? <StatsBarChart rows={filteredRows} mode={mode} dimension={barDimension} includeFailedAmount={!isPaidDownload} totalIncomeOnly={isIncomeStats}/> : <StatsChart rows={chartRows} mode={mode} metric={metric} times={chartTimes}/>}</div></aside></div>}

    {isPaidDownload && orderDrill && <div className="kbi-mask" onMouseDown={() => setOrderDrill(null)}><section className="kbi-modal" role="dialog" aria-modal="true" aria-label={orderDrill === 'count' ? '订单次数详情' : '订单人数详情'} onMouseDown={(event) => event.stopPropagation()}><header><button aria-label="关闭弹窗" onClick={() => setOrderDrill(null)}><X size={18}/></button></header><div className="kbi-modal-body"><dl><div className="kbi-modal-table-head"><dt>名词</dt><dd>说明</dd></div>{orderDrill === 'count' ? <><div><dt>购买订单次数</dt><dd>{purchasedOrderMetric.toLocaleString('zh-CN')}</dd></div><div><dt>获赠订单次数</dt><dd>{giftedOrderMetric.toLocaleString('zh-CN')}</dd></div></> : <><div><dt>购买订单人数</dt><dd>{purchasedOrderMetric.toLocaleString('zh-CN')}</dd></div><div><dt>获赠订单人数</dt><dd>{giftedOrderMetric.toLocaleString('zh-CN')}</dd></div></>}</dl></div></section></div>}

  </>;
}
