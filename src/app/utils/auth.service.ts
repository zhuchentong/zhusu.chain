import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { User } from 'app/models/user'
import { UserService } from 'app/services/user.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: Observable<User>
  private currentUserSubject: BehaviorSubject<User>

  constructor(private userService: UserService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value
  }

  /**
   * 更新用户数据
   * 检测认证是否过期
   */
  public update() {
    this.userService.getUser().subscribe(
      // 登录成功
      () => {
        return
      },
      // 登录过期
      () => {
        return
      }
    )
  }

  /**
   * 用户登录获取用户信息
   * @param username
   * @param password
   */
  public login(username: string, password: string) {
    return this.userService
      .login({
        username,
        password
      })
      .pipe(
        map(user => {
          if (user && user.access_token) {
            user.token = user.access_token
            localStorage.setItem('currentUser', JSON.stringify(user))
            this.currentUserSubject.next(user)
          }
          return user
        })
      )
  }

  /**
   * 用户登出
   */
  public logout() {
    localStorage.removeItem('currentUser')
    this.currentUserSubject.next(null)
  }
}
