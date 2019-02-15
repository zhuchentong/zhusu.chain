import { HotelEnum } from 'app/config/enum.config'
import { Type } from 'class-transformer'
import { User } from './user.model'
import { UpdateHotelAction } from 'app/store/action/hotel.action'
import { Model } from 'app/models'
import { AddRecord } from 'app/store/action/record.action'

export class Hotel extends Model {
  // ID
  public id: number
  // 产品类型
  public hotelType: HotelEnum
  // 产品名称
  public name
  // 评论人数
  public commenterCount: number
  // 联系电话
  public contact: string
  // 创建时间
  public dateCreated
  // 英文名称
  public englishName: string
  // 设施列表
  public facilities: string[]
  // 描述信息
  public description: string
  // 星级
  public grand: number
  // 位置
  public location
  // 经纬度
  public position
  // 标签
  public tags: string[]
  // 排名
  public totalRanking
  // 管理者
  @Type(() => User)
  public manager

  /**
   * 更新store
   * @param store
   */
  public updateStore(store) {
    store.dispatch(new UpdateHotelAction(this))
    store.dispatch(new AddRecord(this))
  }
}
