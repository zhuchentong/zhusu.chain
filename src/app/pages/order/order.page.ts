import { Component, OnInit } from '@angular/core'
import { OrderStateEnum } from 'app/config/enum.config'
import { Router } from '@angular/router'

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss']
})
export class OrderPage implements OnInit {
  // 当前查看状态
  private currentState = OrderStateEnum.ALL
  // 订单列表
  private orderList = []
  // 订单状态列表
  private orderStateList = [
    {
      label: '全部',
      value: OrderStateEnum.ALL
    },
    {
      label: '未支付',
      value: OrderStateEnum.ALL
    },
    {
      label: '待入住',
      value: OrderStateEnum.ALL
    },
    {
      label: '未评价',
      value: OrderStateEnum.ALL
    },
    {
      label: '已完成',
      value: OrderStateEnum.ALL
    }
  ]

  constructor(private router: Router) {}

  public ngOnInit() {
    return
  }

  /**
   * 获取订单列表
   */
  public getOrderList() {
    this.orderList = []
  }

  /**
   * 打开order详情
   */
  public onOpenDetail() {
    this.router.navigate([
      'order/order-detail',
      {
        id: 1
      }
    ])
  }
}
