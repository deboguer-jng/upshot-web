import { formatDistance as formatDistanceFn } from 'date-fns'
import locale from 'date-fns/locale/en-US'

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

export const formatDistance = (datems: number, fromms?: number) =>
  formatDistanceFn(datems, fromms || Date.now(), {
    locale: {
      ...locale,
      formatDistance: (token, count, options) => {
        options = options || {}

        const result = formatDistanceLocale[token].replace('{{count}}', count)

        return result
      },
    },
  })
