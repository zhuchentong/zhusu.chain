import { Component, OnInit } from '@angular/core'
import { OrderService } from 'app/services/order.service'
import { ActivatedRoute } from '@angular/router'
import { OrderStateEnum } from 'app/config/enum.config'
import { CommonService } from 'app/utils/common.service'

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss']
})
export class OrderDetailPage implements OnInit {
  // 订单信息
  private order
  private orderStatus = OrderStateEnum
  constructor(
    private commonService: CommonService,
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    this.getOrder(id)
  }

  /**
   * 获取订单
   * @param id
   */
  public getOrder(id) {
    this.orderService.getOrder(id).subscribe(order => {
      this.order = order
      this.startCountdown()
    })
  }

  public startCountdown() {
    // this.commonService.dateParse(this.order.)
    // this.commonService.setCountdown(10000).subscribe(data => console.log(data))
  }
}
