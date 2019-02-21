import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { WalletState } from 'app/store/state/wallet.state'

@Injectable({
  providedIn: 'root'
})
export class WalletGrand implements CanActivate {
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
    // 获取当前钱包
    const wallet = !!this.store.selectSnapshot(WalletState.getCurrentWallet())
    // 获取当前无，则跳转钱包列表
    if (!wallet) {
      this.router.navigate(['/wallet/wallet-change'])
    }
    return wallet
  }
}
