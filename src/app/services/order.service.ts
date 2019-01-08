import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { productController } from 'app/config/service/product.controller'
import { User } from 'app/models/user.model'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { orderController } from 'app/config/service/order.controller'
import { Order } from 'app/models/order.model'
@Injectable()
export class OrderService {
  constructor(private net: NetService, private store: Store) {}

  /**
   * 获取订单列表
   */
  public getOrderList(): Observable<Order[]> {
    return this.net.send({
      service: orderController.getOrderList,
      model: Order,
      params: {}
    })
  }
}
