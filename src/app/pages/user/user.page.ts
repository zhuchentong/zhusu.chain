import { Component, OnInit } from '@angular/core'
import { AuthService } from 'app/utils/auth.service'
import { UserState } from 'app/store/state/user.state'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { User } from 'app/models/user.model'
import { LoggerService } from '@ngx-toolkit/logger'

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss']
})
export class UserPage implements OnInit {
  private readonly userButtons = [
    {
      label: '浏览',
      icon: 'assets/icon/browser.svg',
      event: 'brower'
    },
    {
      label: '收藏',
      icon: 'assets/icon/collect.svg',
      event: 'collect'
    },
    {
      label: '钱包',
      icon: 'assets/icon/wallet.svg',
      event: 'wallet'
    }
  ]

  private readonly userMenus = [
    {
      label: '浏览',
      icon: 'assets/icon/browser.svg',
      type: 'brower'
    },
    {
      label: '收藏',
      icon: 'assets/icon/collect.svg',
      type: 'collet'
    },
    {
      label: '钱包',
      icon: 'assets/icon/wallet.svg',
      type: 'brower'
    }
  ]

  private readonly buttonHandlerMapping = {
    wallet: this.openWallet
  }

  private readonly menuHandlerMapping = {
    wallet: this.openWallet
  }

  private currentUser

  @Select(UserState)
  private user$: Observable<User>

  constructor(
    private authService: AuthService,
    private logger: LoggerService,
    private store: Store
  ) {}

  public ngOnInit() {
    // 获取当前用户信息
    const currentUser = this.store.selectSnapshot<User>(state => state.user)
    // 更新当前用户信息
    this.user$.subscribe(user => (this.currentUser = user))
  }

  /**
   * 点击按钮处理逻辑
   * @param event
   */
  private onOpenButton(event) {
    const handler = this.buttonHandlerMapping[event]
    handler && handler()
  }

  /**
   * 点击菜单处理逻辑
   * @param event
   */
  private onOpenMenu(event) {
    const handler = this.menuHandlerMapping[event]
    handler && handler()
  }

  /**
   * 打开钱包
   */
  private openWallet() {
    // TODO:用户有钱包则打开钱包
    // TODO:用户无钱包则创建钱包
  }
}
