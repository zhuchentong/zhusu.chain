import { Component, OnInit } from '@angular/core'
import { Store } from '@ngxs/store'
import { CommonService } from 'app/utils/common.service'
import { FormBuilder, Validators } from '@angular/forms'
import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'
import { OrderService } from 'app/services/order.service'
import { User } from 'app/models/user.model'
import { Router } from '@angular/router'

@Component({
  selector: 'app-hotel-order',
  templateUrl: './hotel-order.page.html',
  styleUrls: ['./hotel-order.page.scss']
})
export class HotelOrderPage implements OnInit {
  private hotel: Hotel
  private room: Room
  private dateRange
  private orderForm
  private paymentMethod = 'HOME'
  private readonly array = Array
  private arriveTime = []
  constructor(
    private orderService: OrderService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  public ngOnInit() {
    // 初始化表单
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

  /**
   * 初始化表单
   */
  private initFormGroup() {
    this.orderForm = this.formBuilder.group({
      count: [1, Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      time: ['']
    })
  }

  /**
   * 获取到达时间范围
   */
  private getArriveTime() {
    const formatTimeRange = hour => {
      const start = hour.toString().padStart(2, '0')
      const end = ((hour + 1) % 24).toString().padStart(2, '0')
      return `${start}:00~${end}:00`
    }
    // 显示前3条时间
    return Array.from(new Array(3), (item, index) => {
      return formatTimeRange(
        (this.commonService.dateParse(Date.now()).hour() + index) % 24
      )
    })
  }

  /**
   * 计算价格
   */
  private getriceTotal() {
    return (this.room.price * this.orderForm.value.count).toFixed(2)
  }

  private onSubmitOrder() {
    const user = this.store.selectSnapshot(state => state.user) as User
    this.orderService
      .addOrder({
        user: user.id,
        room: this.room.id,
        count: this.orderForm.value.count,
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        time: this.orderForm.value.time
      })
      .subscribe(
        data => {
          // TODO:进行支付操作x432
          this.router.navigate(['tabs/order'])
        },
        () => {
          this.commonService.toast('预订失败，请确认房间数量是否充足')
        }
      )
  }
}
