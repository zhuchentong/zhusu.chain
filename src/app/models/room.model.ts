import { Model } from 'app/models'
import { Expose, Type } from 'class-transformer'
import { User } from './user.model'
import { Hotel } from './hotel.model'

export class Room extends Model {
  // 房间ID
  public id: number
  // 房间名称
  public name: string
  // 房间价格
  public price: number
  // 房间总数
  public total: number
  // 房间属性
  public attributes: any
  // 酒店信息
  @Type(() => Hotel)
  public hotel
}
