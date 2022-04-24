import * as moment from 'moment'
import 'moment/locale/pt-br'

export function DateFormat(format = 'YYYY-MM-DD'): string {
  return moment().format(format)
}
