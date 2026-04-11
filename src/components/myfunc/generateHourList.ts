import dayjs from 'dayjs'

// 把 202604102000 转成 dayjs
function parseScadaNo(timeNo: string | number) {
  const str = String(timeNo)
  return dayjs(
    str.substring(0, 4) + '-' +
    str.substring(4, 6) + '-' +
    str.substring(6, 8) + ' ' +
    str.substring(8, 10) + ':' +
    str.substring(10, 12)
  )
}

/**
 * 从 start → end，每 +1小时，返回【10位】时间数组
 * 例如：202604102000 → 202604110800
 * 返回 [2026041020, 2026041021, 2026041022, ...]
 */
export function generateHourList(start: string | number, end: string | number) {
  const startDay = parseScadaNo(start)
  const endDay = parseScadaNo(end)
  const list = []

  let current = startDay
  while (current.isBefore(endDay) || current.isSame(endDay)) {
    // ✅ 只返回 10 位：YYYYMMDDHH
    const timeNo = current.format('YYYYMMDDHH') 
    list.push(timeNo)
    current = current.add(1, 'hour')
  }

  return list
}