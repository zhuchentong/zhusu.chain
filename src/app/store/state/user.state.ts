import { State, Action, StateContext } from '@ngxs/store'
import { User } from 'app/models/user.model'
import { LoginAction, UpdateAction, LogoutAction } from '../action/user.action'
import { ExtendState } from '.'

@State<User>({
  name: 'user',
  defaults: null
})
export class UserState extends ExtendState {
  @Action(LoginAction)
  public login<T>({ setState }: StateContext<User>, { user }: LoginAction) {
    // TODO:修改到auth拦截器中完成
    setState(user)
  }

  @Action(UpdateAction)
  public update<T>(state: StateContext<User>, { user }: UpdateAction) {
    // 剔除用户中的空值
    Object.entries(user).forEach(([key, value]) => {
      if (value === undefined) {
        delete user[key]
      }
    })
    // 更新用户数据
    this.updateState(state, user)
  }

  @Action(LogoutAction)
  public logout<T>({ setState }: StateContext<User>) {
    setState(null)
  }
}
