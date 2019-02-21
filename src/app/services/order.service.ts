import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { orderController } from 'app/config/service/order.controller'
import { Order } from 'app/models/order.model'
import { IDateRange } from 'app/config/interface.config'
import { CommonService } from 'app/utils/common.service'
import { PageService } from 'app/utils/page.service'
import { map } from 'rxjs/operators'
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
    return this.net
      .send({
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
  public addOrder(params: IAddOrderParams): Observable<any> {
    return this.net.send({
      service: orderController.addOrder,
      params: {
        user: params.user,
        room: params.room,
        beginDate: this.commonService.dateFormat(
          params.start,
          'YYYY-MM-DD 00:00:00'
        ), 
        endDate: this.commonService.dateFormat(
          params.end,
          'YYYY-MM-DD 00:00:00'
        ),
        attributes: {
          roomCount: params.count,
          personName: params.name,
          telephone: params.phone,
          email: params.email,
          arrivalTime: params.time
        }
      }
    })
  }
}

interface IAddOrderParams {
  user: number
  room: number
  count: number
  name: string
  phone: string
  email?: string
  time?: string
  start: string
  end: string
}
