import { Pipe, PipeTransform } from '@angular/core'
import * as dayjs from 'dayjs'
@Pipe({
  name: 'week'
})
export class WeekPipe implements PipeTransform {
  private readonly weekForDay = [
    '周日',
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六'
  ]
  public transform(value: any, args?: any): any {
    const day = dayjs(value)

    if (
      value &&
      args &&
      args === 'today' &&
      day.date() === dayjs(new Date()).date()
    ) {
      return '今天'
    }

    if (value) {
      return this.weekForDay[day.day()]
    }

    return null
  }
}
