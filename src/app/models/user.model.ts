import { Model } from 'app/models'
import { Expose } from 'class-transformer'

export class User extends Model {
  // 用户ID
  // self接口返回为id
  // login接口返回为userId
  public get id() {
    return this._id || this._userId
  }
  // 用户名
  public username: string
  // 显示名称
  public displayName?: string
  // 密码
  public password: string
  // accessToken
  @Expose({ name: 'access_token' })
  public accessToken?: string
  // rsfreshToken
  @Expose({ name: 'refresh_token' })
  public refreshToken?: string
  // 用户ID
  @Expose({ name: 'id' })
  private _id: number

  @Expose({ name: 'userId' })
  private _userId: number
}
