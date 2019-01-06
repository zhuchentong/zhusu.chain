import { Injectable } from '@angular/core'
import { AuthService } from 'app/utils/auth.service'
import { UserService } from 'app/services/user.service'
import { Store } from '@ngxs/store'
import { UpdateAction } from 'app/store/action/user.action'
import { DeviceService } from 'app/utils/decive.service'

@Injectable({
  providedIn: 'root'
})
export class LaunchService {
  constructor(
    private userService: UserService,
    private deviceService: DeviceService,
    private store: Store
  ) {}

  public start() {
    // 检测用户登录过期
    this.userService.getUser().subscribe(user => {
      this.store.dispatch(new UpdateAction(user))
    })

    // 初始化地理信息
    this.deviceService.getCurrentPosition(true)
  }
}
