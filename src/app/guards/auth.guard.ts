import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { User } from 'app/models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}
  /**
   * 验证是否可以跳转
   * @param next
   * @param state
   */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let result = true
    if (!this.checkUser()) {
      result = false
      this.router.navigate(['user/login', { redirect: state.url }])
    }
    return result
  }

  /**
   * 检查用户状态
   */
  private checkUser() {
    const user = this.store.selectSnapshot(state => state.user) as User
    return user && user.id && user.accessToken
  }
}
