import { Component, OnInit } from '@angular/core'
import { OrderService } from 'app/services/order.service'
import { ActivatedRoute } from '@angular/router'
import { OrderStateEnum } from 'app/config/enum.config'
import { CommonService } from 'app/utils/common.service'
import { OrderExecutionService } from 'app/services/order-execution.service'
import { Order } from 'app/models/order.model'
import { PaymentComponent } from 'app/shared/components/payment/payment.component'

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss']
})
export class OrderDetailPage implements OnInit {
  // 订单信息
  private order
  private orderStatus = OrderStateEnum
  private math = Math
  constructor(
    private commonService: CommonService,
    private orderService: OrderService,
    private orderExecutionService: OrderExecutionService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    if (id) {
      this.getOrder(id)
    }
  }

  /**
   * 获取订单
   * @param id
   */
  public getOrder(id) {
    this.orderService.getOrder(id).subscribe(
      (order: Order) => {
        this.order = order

        if (this.order.status === OrderStateEnum.CREATED) {
          this.orderExecutionService
            .getOrderExecution(id)
            .subscribe(({ orderExecutionCount, orderExecutionList }) => {
              if (!orderExecutionList) {
                return
              }

              const [orderExecution] = orderExecutionList
              this.order.payTime = this.getPayTime(orderExecution)
              if (this.order.payTime) {
                this.startCountdown()
              } else {
                this.order.status = OrderStateEnum.CLOSE
              }
            })
        }
      },
      () => {
        this.commonService.toast('获取订单失败')
      }
    )
  }

  /**
   * 进行支付
   */
  public async onPayment() {
    const modal = await this.commonService.modal({
      component:PaymentComponent,
       componentProps:{
        amount: 1000
      }, 
       callback:result => {
        if (result === true) {
          this.commonService.toast('支付成功')
        }
      }
    })
    
    modal.present()
  }

  /**
   * 开始支付倒计时
   */
  private startCountdown() {
    this.commonService.setCountdown(this.order.payTime * 1000).subscribe(
      time => {
        this.order.payTime = time
      },
      () => {
        this.order.payTime = 0
        this.order.status = OrderStateEnum.CLOSE
      }
    )
  }

  /**
   * 获取剩余支付时间
   * @param execution
   */
  private getPayTime(execution) {
    if (!execution || !execution.dateCreated) {
      return
    }

    const diff = this.commonService
      .dateParse(Date.now())
      .diff(this.commonService.dateParse(execution.dateCreated), 'second')
    return diff < 30 * 60 ? 30 * 60 - diff : 0
  }
}
