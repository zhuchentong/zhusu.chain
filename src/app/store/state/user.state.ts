import { State, Action, StateContext, Selector } from '@ngxs/store'
import { User } from 'app/models/user.model'
import { LoginAction, UpdateUserAction, LogoutAction } from '../action/user.action'
import { ExtendState } from '.'
import { plainToClass, classToPlain } from 'class-transformer'

@State<User>({
  name: 'user',
  defaults: null
})
export class UserState extends ExtendState {
  /**
   * 获取当前登录用户
   * @param state
   */
  @Selector()
  public static getUser(state: User) {
    if (state) {
      return plainToClass(User, state)
    } else {
      return null
    }
  }

  @Action(LoginAction)
  public login<T>({ setState }: StateContext<any>, { user }: LoginAction) {
    // TODO:修改到auth拦截器中完成
    setState(classToPlain(user))
  }

  @Action(UpdateUserAction)
  public update<T>(state: StateContext<User>, { user }: UpdateUserAction) {
    const curretUser = classToPlain(user)
    // 剔除用户中的空值
    Object.entries(curretUser).forEach(([key, value]) => {
      if (value === undefined) {
        delete curretUser[key]
      }
    })
    // 更新用户数据
    this.updateState(state, curretUser)
  }

  @Action(LogoutAction)
  public logout<T>({ setState }: StateContext<User>) {
    setState(null)
  }
}
