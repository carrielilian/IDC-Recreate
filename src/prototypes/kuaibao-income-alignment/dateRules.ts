export type DateRange = {
  startDate: string;
  endDate: string;
};

export function formatLocalDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getTodayText() {
  return formatLocalDate(new Date());
}

export function getDetailDefaultRange(today = new Date()): DateRange {
  return {
    startDate: formatLocalDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    endDate: formatLocalDate(today),
  };
}

export function getStatsDefaultRange(today = new Date()): DateRange {
  const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  const previousMonthDay = Math.min(today.getDate(), previousMonthEnd.getDate());
  const previousMonthSameDay = new Date(previousMonthEnd.getFullYear(), previousMonthEnd.getMonth(), previousMonthDay);
  const start = new Date(previousMonthSameDay.getFullYear(), previousMonthSameDay.getMonth(), previousMonthSameDay.getDate() + 1);
  return {
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(today),
  };
}

export function isFutureDate(date: string) {
  return date > getTodayText();
}

export function clampDateToToday(date: string) {
  const today = getTodayText();
  return date > today ? today : date;
}
