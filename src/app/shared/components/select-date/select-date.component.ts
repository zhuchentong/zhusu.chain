import { Component, OnInit } from '@angular/core'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss']
})
export class SelectDateComponent implements OnInit {
  private startDate
  private endDate
  private days: number

  private readonly today = dayjs(new Date()).format('YYYY-MM-DD')
  // constructor() {}

  public ngOnInit() {
    dayjs.extend(relativeTime)
    return
  }

  /**
   * 计算住宿时间
   */
  private onDateChange() {
    if (!this.startDate || !this.endDate) {
      this.days = null
      return
    }

    if (this.startDate === this.endDate) {
      this.days = 1
      return
    }

    this.days = dayjs(this.endDate).diff(dayjs(this.startDate), 'day')
  }
}
