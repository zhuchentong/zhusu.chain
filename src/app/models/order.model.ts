import { Model } from 'app/models'
import { Expose, Type } from 'class-transformer'
import { User } from './user.model'
import { OrderStateEnum } from 'app/config/enum.config'
import { OrderAttribute } from './order-attribute.model'
import { Room } from './room.model'
import * as dayjs from 'dayjs'
export class Order extends Model {
  // 订单ID
  public id: number
  // 预订房间
  public room: Room
  // 预订用户
  @Type(() => User)
  @Expose({ name: 'buyer' })
  public user: User
  // 入住日期
  public beginDate: string
  // 离店日期
  public endDate: string
  // 订单属性
  public attributes: OrderAttribute
  // 订单状态
  public status: OrderStateEnum
  // 预订时长
  public get days() {
    return dayjs(this.endDate).diff(dayjs(this.beginDate), 'day')
  }
  // 订单金额
  public get price() {
    return (this.days * this.room.price).toFixed(2)
  }
}
