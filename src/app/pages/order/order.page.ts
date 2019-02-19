import { Component, OnInit } from '@angular/core'
import { OrderStateEnum } from 'app/config/enum.config'
import { Router } from '@angular/router'
import { OrderService } from 'app/services/order.service'
import { PageService } from 'app/utils/page.service'
import { CommonService } from 'app/utils/common.service'

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss']
})
export class OrderPage implements OnInit {
  // 当前查看状态
  private currentState = ''
  private currentUser
  // 订单列表
  private orderList = []
  // 订单类型
  private orderStateEnum = OrderStateEnum
  // 分页服务
  private page = new PageService()
  // 订单状态列表
  private orderStateList = [
    {
      label: '全部',
      value: ''
    },
    {
      label: '未支付',
      value: OrderStateEnum.CREATED
    },
    {
      label: '已支付',
      value: OrderStateEnum.PAID
    },
    {
      label: '未评价',
      value: OrderStateEnum.CHECKIN
    },
    {
      label: '已完成',
      value: OrderStateEnum.CHECKOUT
    }
  ]

  constructor(
    private orderService: OrderService,
    private commonService: CommonService,
    private router: Router
  ) {}

  public ngOnInit() {
    return
  }

  public ionViewWillEnter() {
    this.getOrderList()
  }

  /**
   * 获取订单列表
   */
  public getOrderList(event?, type?) {
    if (this.page.complete) return event && event.target.complete()
    if (event && type) this.page[type]()
    this.orderService
      .getOrderList(
        {
          state: this.currentState
        },
        {
          page: this.page
        }
      )
      .subscribe(orderList => {
        this.orderList = orderList
        event && event.target.complete()
      })
  }

  /**
   * 打开order详情
   */
  public onOpenDetail(id) {
    this.router.navigateByUrl('order/order-detail/' + id)
  }

  /**
   * 查询对应状态订单
   * @param status
   */
  private onChangeStatus(status) {
    this.currentState = status
    this.page.reset()
    this.orderList = []
    this.getOrderList()
  }

  /**
   * 获取订单状态
   * @param status
   */
  private getOrderState(status) {
    const state = this.orderStateList.find(x => x.value === status)
    if (state) {
      return state.label
    }
  }

  private onRefresh(event) {
    this.orderList = []
    this.getOrderList(event, 'reset')
  }
}
