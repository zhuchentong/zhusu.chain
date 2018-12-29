import { Injectable } from '@angular/core';
import { NetService } from 'app/utils/net.service';
import { UserController } from 'app/config/service/user.controller'
import { AuthService } from 'app/utils/auth.service';

@Injectable()
export class UserService {
  constructor(
    private net: NetService
  ) {
  }

  public getUser() {
    return this.net.send({
      service: UserController.getUser
    })
  }

  public getUserList() {
    return this.net.send({
      service: UserController.getUserList
    })
  }

  public register(user) {
    return this.net.send({
      service: UserController.register,
      params: {
        username: '001',
        password: 'test01',
        displayName: 'test01'
      }
    })
  }


  public login(user) {
    return this.net.send({
      service: UserController.login,
      params: user
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
