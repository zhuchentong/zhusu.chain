import { Model } from 'app/models'
import { User } from './user.model'
import { Type } from 'class-transformer'
import { Hotel } from './hotel.model'

export class Comment extends Model {
  // ID
  public id: number
  // 评分
  public ranking: number
  // 评论内容
  public content
  // 评论时间
  public dateCreated
  // 评论酒店
  @Type(() => Hotel)
  public hotel
  // 评论人
  @Type(() => User)
  public writer
}
