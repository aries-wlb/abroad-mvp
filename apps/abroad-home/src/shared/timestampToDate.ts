import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(timezone)
dayjs.extend(utc)

const REGION = import.meta.env.APP_REGION || 'cn'

const TIMEZONES_LABEL: Record<string, string> = {
  sg: 'Asia/Singapore',
  th: 'Asia/Bangkok',
  ph: 'Asia/Manila',
  my: 'Asia/Kuala_Lumpur',
  tw: 'Asia/Taipei',
  vn: 'Asia/Ho_Chi_Minh',
  br: 'America/Bahia',
  id: 'Asia/Jakarta',
  mx: 'America/Mexico_City',
  co: 'America/Bogota',
  cl: 'America/Santiago',
  ir: 'Asia/Tehran',
  mm: 'Asia/Rangoon',
  hk: 'Asia/Hong_Kong',
  cn: 'Asia/Shanghai',
  pl: 'Europe/Warsaw',
  es: 'Europe/Madrid',
  fr: 'Europe/Paris',
  in: 'Asia/Kolkata',
}

export function timestampToDate(
  _timeStamp: string | number,
  format = 'YYYY-MM-DD HH:mm:ss'
) {
  const timeStamp = Number(_timeStamp)
  if (timeStamp <= 86400) {
    const time = Number(timeStamp) / 3600
    const convertTime = time.toFixed(2).toString()
    if (convertTime.length < 5) return `0${convertTime}`.replace('.', ':')

    return convertTime.replace('.', ':')
  }

  const domainTimezone = TIMEZONES_LABEL[REGION]

  if (domainTimezone === '-')
    return dayjs.unix(Number(timeStamp)).format(format)

  return dayjs.unix(Number(timeStamp)).tz(domainTimezone).format(format)
}
