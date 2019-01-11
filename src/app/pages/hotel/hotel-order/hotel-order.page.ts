import { Component, OnInit } from '@angular/core'
import { Store } from '@ngxs/store'
import { CommonService } from 'app/utils/common.service'
import { FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-hotel-order',
  templateUrl: './hotel-order.page.html',
  styleUrls: ['./hotel-order.page.scss']
})
export class HotelOrderPage implements OnInit {
  private hotel
  private room
  private dateRange
  private orderForm
  private paymentForm
  private readonly array = Array
  private arriveTime = []
  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private store: Store
  ) {}

  public ngOnInit() {
    this.initFormGroup()
    // 获取待预订房间酒店信息
    const currentOrder = this.store.selectSnapshot(state => state.hotel)
    this.hotel = currentOrder.hotel
    this.room = currentOrder.room
    this.dateRange = {
      start: this.commonService.dateParse(currentOrder.dateRange.start),
      end: this.commonService.dateParse(currentOrder.dateRange.end),
      days: this.commonService
        .dateParse(currentOrder.dateRange.end)
        .diff(this.commonService.dateParse(currentOrder.dateRange.start), 'day')
    }

    // 获取预订时间范围
    this.arriveTime = this.getArriveTime()
  }

  private initFormGroup() {
    this.orderForm = this.formBuilder.group({
      count: [1, Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      time: ['']
    })
  }

  private getArriveTime() {
    const formatTimeRange = hour => {
      const start = hour.toString().padStart(2, '0')
      const end = ((hour + 1) % 24).toString().padStart(2, '0')
      return `${start}:00 ~ ${end}:00`
    }
    // 显示前3条时间
    return Array.from(new Array(3), (item, index) => {
      return formatTimeRange(
        (this.commonService.dateParse(Date.now()).hour() + index) % 24
      )
    })
  }
}
