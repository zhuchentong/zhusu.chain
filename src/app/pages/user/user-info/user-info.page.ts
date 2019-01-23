import { Component, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { LogoutAction } from 'app/store/action/user.action'
import { Location } from '@angular/common'
import { UserState } from 'app/store/state/user.state'

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss']
})
export class UserInfoPage implements OnInit {
  private user

  constructor(private store: Store, private location: Location) {}

  public ngOnInit() {
    this.user = this.store.selectSnapshot(UserState.getUser)
  }

  /**
   * 注销登录
   */
  private onLogout() {
    this.store.dispatch(LogoutAction).subscribe(() => {
      this.location.back()
    })
  }
}
