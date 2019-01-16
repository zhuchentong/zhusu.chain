import { Model } from 'app/models'
import { Expose, Type } from 'class-transformer'
import { User } from './user.model'

export class Wallet extends Model {
  // 钱包名称
  public name: string
  // 钱包数据
  public data: string
  // 钱包地址
  public address: string
  // 钱包所属用户
  public user
}
