import { Component, OnInit } from '@angular/core'
import { Store } from '@ngxs/store'
import { CommonService } from 'app/utils/common.service'
import { FormBuilder, Validators } from '@angular/forms'
import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'
import { OrderService } from 'app/services/order.service'
import { User } from 'app/models/user.model'
import { Router } from '@angular/router'
import { UserState } from 'app/store/state/user.state'
import { Order } from 'app/models/order.model'

@Component({
  selector: 'app-hotel-order',
  templateUrl: './hotel-order.page.html',
  styleUrls: ['./hotel-order.page.scss']
})
export class HotelOrderPage implements OnInit {
  private hotel: Hotel
  private room: Room
  private order
  private dateRange = { start: '', end: '', days: 1 }
  private orderForm
  private today
  private priceTotal
  private readonly array = Array
  private arriveTime = []
  private user: User
  private paymentMethod = 'HOME'
  constructor(
    private orderService: OrderService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  public ngOnInit() {
    this.user = this.store.selectSnapshot(UserState.getUser)
    // 获取待预订房间酒店信息
    const order = (this.order = this.store.selectSnapshot(state => state.hotel))
    // 获取酒店/房价信息
    this.hotel = order.hotel
    this.room = order.room
    // 获取预订时间
    this.dateRange.start = order.dateRange.start
    this.dateRange.end = order.dateRange.end
    // 获取预订时间范围
    this.arriveTime = this.getArriveTime()
    this.today = this.commonService.dateFormat(Date.now())
    // 初始化表单
    this.initFormGroup()
    this.onUpdatePriceTotal()
  }

  /**
   * 初始化表单
   */
  private initFormGroup() {
    this.orderForm = this.formBuilder.group({
      count: [1, Validators.required],
      name: [this.user.displayName, Validators.required],
      phone: [this.user.username, Validators.required], // username即手机号
      time: [this.arriveTime[0]]
    })
  }

  private getDayDiff() {
    if (this.dateRange.end === this.dateRange.start) return 1
    this.dateRange.days = this.commonService
      .dateParse(this.dateRange.end)
      .diff(this.commonService.dateParse(this.dateRange.start), 'day')
    return this.dateRange.days
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
  private onUpdatePriceTotal() {
    this.priceTotal =
      this.room.price * this.orderForm.value.count * this.getDayDiff()
  }

  /**
   * 提交订单
   */
  private onSubmitOrder() {
    const user = this.store.selectSnapshot(UserState.getUser)
    this.orderService
      .addOrder({
        user: user.id,
        room: this.room.id,
        count: this.orderForm.value.count,
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        time: this.orderForm.value.time,
        start: this.dateRange.start,
        end: this.dateRange.end
      })
      .subscribe(
        data => {
          // TODO:进入订单详情
          this.router.navigate(['/order', { replaceUrl: true }])
        },
        () => {
          this.commonService.toast('预订失败')
        }
      )
  }
}
