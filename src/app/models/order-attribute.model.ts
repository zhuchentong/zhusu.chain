import { Model } from 'app/models'
import { Expose, Type } from 'class-transformer'
import { User } from './user.model'

export class OrderAttribute extends Model {
  // 邮箱
  public email: string
  // 预订房间数
  public roomCount: number
  // 预订人姓名
  public personName: string
  // 预订人手机号
  public telephone: string
  // 到达时间
  public arrivalTime: string
}
