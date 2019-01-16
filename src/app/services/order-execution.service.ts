import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { Observable } from 'rxjs'
import { orderExecutionController } from 'app/config/service/order-execution.controller'
@Injectable()
export class OrderExecutionService {
  constructor(private net: NetService) {}

  /**
   * 获取订单扩展数据
   */
  public getOrderExecution(id): Observable<any> {
    return this.net.send({
      service: orderExecutionController.getOrderExecutions,
      params: {
        orderId: id
      }
    })
  }
}
