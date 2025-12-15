/**
 * 班次信息返回值类型定义
 */
export interface ShiftInfo {
  LastShift: "白班" | "夜班";
  LastT1: string;
  LastT2: string;
  ThisShift: "白班" | "夜班";
  ThisT1: string;
  ThisT2: string;
}

/**
 * 根据当前时间计算白班/夜班的班次信息
 * @param currentTime - 输入时间字符串（格式：YYYY-MM-DD HH:mm:ss）
 * @returns 包含上一班/当前班的班次名称和时间区间的对象
 * @throws 输入时间格式不合法时抛出错误
 */
export function getShiftInfo(currentTime: string): ShiftInfo {
  // 解析输入时间
  const time = new Date(currentTime);
  if (isNaN(time.getTime())) {
    throw new Error("输入时间格式不合法，请使用 YYYY-MM-DD HH:mm:ss 格式");
  }

  // 获取时间组件
  const year = time.getFullYear();
  const month = time.getMonth() + 1; // 月份从 0 开始，需 +1
  const day = time.getDate();
  const hours = time.getHours();

  // 格式化日期为 YYYYMMDD 格式（补零）
  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  };

  // 格式化时间区间（拼接 0800/2000）
  const getTimeRange = (baseDate: Date, isDayShift: boolean): { t1: string; t2: string } => {
    const baseStr = formatDate(baseDate);
    if (isDayShift) {
      // 白班：08:00 ~ 20:00
      return { t1: `${baseStr}0800`, t2: `${baseStr}2000` };
    } else {
      // 夜班：20:00 ~ 次日 08:00
      const nextDay = new Date(baseDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = formatDate(nextDay);
      return { t1: `${baseStr}2000`, t2: `${nextDayStr}0800` };
    }
  };

  // 判断当前班次
  let thisShift: "白班" | "夜班";
  let thisT1: string;
  let thisT2: string;
  let lastShift: "白班" | "夜班";
  let lastT1: string;
  let lastT2: string;

  if (hours >= 8 && hours < 20) {
    // 当前时间在 08:00~20:00 之间 → 当前是白班
    thisShift = "白班";
    const { t1, t2 } = getTimeRange(time, true);
    thisT1 = t1;
    thisT2 = t2;

    // 上一班是前一天的夜班
    const lastDay = new Date(time);
    lastDay.setDate(lastDay.getDate() - 1);
    lastShift = "夜班";
    const lastRange = getTimeRange(lastDay, false);
    lastT1 = lastRange.t1;
    lastT2 = lastRange.t2;
  } else {
    // 当前时间在 20:00~次日 08:00 之间 → 当前是夜班
    thisShift = "夜班";
    const baseDay = hours >= 20 ? time : new Date(time.setDate(time.getDate() - 1)); // 夜班的基准日是 20:00 所在的日期
    const { t1, t2 } = getTimeRange(baseDay, false);
    thisT1 = t1;
    thisT2 = t2;

    // 上一班是当天的白班
    lastShift = "白班";
    const lastRange = getTimeRange(baseDay, true);
    lastT1 = lastRange.t1;
    lastT2 = lastRange.t2;
  }

  return {
    LastShift: lastShift,
    LastT1: lastT1,
    LastT2: lastT2,
    ThisShift: thisShift,
    ThisT1: thisT1,
    ThisT2: thisT2,
  };
}

// 测试代码（可选，若不需要可删除）
// const testTime = "2025-12-15 23:25:13";
// const shiftInfo = getShiftInfo(testTime);
// console.log(shiftInfo);