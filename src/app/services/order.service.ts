import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { orderController } from 'app/config/service/order.controller'
import { Order } from 'app/models/order.model'
import { IDateRange } from 'app/config/interface.config'
import { CommonService } from 'app/utils/common.service'
import { PageService } from 'app/utils/page.service'
@Injectable()
export class OrderService {
  constructor(
    private net: NetService,
    private commonService: CommonService,
    private store: Store
  ) {}

  /**
   * 获取订单列表
   */
  public getOrderList(
    { state },
    { page }: { page: PageService }
  ): Observable<Order[]> {
    return this.net.send({
      service: orderController.getOrderList,
      model: Order,
      params: {
        status: state
      },
      page
    })
  }

  /**
   * 获取订单
   */
  public getOrder(id): Observable<Order> {
    return this.net.send({
      service: orderController.getOrderList,
      model: Order,
      params: {},
      append: [id]
    })
  }

  /**
   * 添加订单
   * @param param0
   */
  public addOrder({
    user,
    room,
    count,
    name,
    phone,
    email,
    time
  }: {
    user: number
    room: number
    count: number
    name: string
    phone: string
    email?: string
    time?: string
  }): Observable<any> {
    const dateRange = this.store.selectSnapshot(
      state => state.hotel.dateRange
    ) as IDateRange
    return this.net.send({
      service: orderController.addOrder,
      params: {
        user,
        room,
        beginDate: this.commonService.dateFormat(
          dateRange.start,
          'YYYY-MM-DD hh:mm:ss'
        ),
        endDate: this.commonService.dateFormat(
          dateRange.end,
          'YYYY-MM-DD hh:mm:ss'
        ),
        attributes: {
          roomCount: count,
          personName: name,
          telephone: phone,
          email,
          arrivalTime: time
        }
      }
    })
  }
}
