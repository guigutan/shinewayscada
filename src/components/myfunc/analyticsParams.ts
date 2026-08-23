import dayjs from 'dayjs'
import { getShiftInfo } from './getShiftInfo'
import type { AnalyticsParams } from '../../api/scada'

export const analyticsParams = (area:string):AnalyticsParams => {
  const now=dayjs();const nextMinute=now.add(1,'minute').startOf('minute');const shift=getShiftInfo(now.format('YYYY-MM-DD HH:mm:ss'))
  return {
    area,
    todayStart:Number(now.format('YYYYMMDD')+'0000'),todayEnd:Number(nextMinute.format('YYYYMMDDHHmm')),
    lastStart:Number(shift.LastT1),lastEnd:Number(shift.LastT2),currentStart:Number(shift.ThisT1),currentEnd:Number(nextMinute.format('YYYYMMDDHHmm')),
    hourlyStart:Number(now.subtract(23,'hour').startOf('hour').format('YYYYMMDDHHmm')),hourlyEnd:Number(nextMinute.startOf('hour').add(1,'hour').format('YYYYMMDDHHmm')),
  }
}
