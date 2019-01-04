import { Model } from 'app/models'
import { Expose } from 'class-transformer'

export class User extends Model {
  // 用户ID
  public id: number
  // 用户名
  public username: string
  // 密码
  public password: string
  // accessToken
  @Expose({ name: 'access_token' })
  public accessToken?: string
  // rsfreshToken
  @Expose({ name: 'refresh_token' })
  public refreshToken?: string
}
