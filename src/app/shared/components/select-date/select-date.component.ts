import { Component, OnInit } from '@angular/core'
import { CommonService } from 'app/utils/common.service'
@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss']
})
export class SelectDateComponent implements OnInit {
  private startDate
  private endDate
  private days: number
  private today

  constructor(private commonService: CommonService) {
    this.today = this.commonService.dateFormat(Date.now())
  }

  public ngOnInit() {
    this.startDate = this.today
    this.endDate = this.commonService
      .dateParse(Date.now())
      .add(1, 'day')
      .format('YYYY-MM-DD')
    this.onDateChange()
  }

  public getDateRange() {
    return {
      start: this.startDate,
      end: this.endDate
    }
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

    // 计算日期差
    this.days = this.commonService
      .dateParse(this.endDate)
      .diff(this.commonService.dateParse(this.startDate), 'day')
  }
}
