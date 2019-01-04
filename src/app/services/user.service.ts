import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { UserController } from 'app/config/service/user.controller'
import { User } from 'app/models/user.model'
import { Observable } from 'rxjs'

@Injectable()
export class UserService {
  constructor(private net: NetService) { }

  /**
   * 获取用户
   */
  public getUser(): Observable<User> {
    return this.net.send({
      service: UserController.getUser,
      model: User
    })
  }

  /**
   * 获取用户列表
   */
  public getUserList() {
    return this.net.send({
      service: UserController.getUserList
    })
  }

  /**
   * 用户注册
   * @param user
   */
  public register(user) {
    return this.net.send({
      service: UserController.register,
      params: {
        username: user.username,
        password: user.password,
        displayName: user.displayName
      }
    })
  }

  /**
   * 用户登录
   * @param user
   */
  public login(user): Observable<User> {
    return this.net.send({
      service: UserController.login,
      params: user,
      model: User
    })
  }

  /**
   *  向用户发送短信验证码
   * @param username 用户名(手机号)
   */
  public sendSmsCode(username) {
    return this.net.send({
      service: UserController.sendSmsCode,
      params: {
        username
      }
    })
  }

  /**
   *  重置密码
   * @param username 用户名(手机号)
   */
  public resetPassword(username) {
    return this.net.send({
      service: UserController.resetPassowrd,
      params: {
        username
      }
    })
  }
}
