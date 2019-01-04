import { State, Action, StateContext } from '@ngxs/store'
import { User } from 'app/models/user.model'
import { LoginAction, UpdateAction, LogoutAction } from '../action/user.action'

@State<User>({
  name: 'user',
  defaults: null
})
export class UserState {
  @Action(LoginAction)
  public login<T>({ setState }: StateContext<User>, { user }: LoginAction) {
    // TODO:修改到auth拦截器中完成
    setState(user)
  }

  @Action(UpdateAction)
  public update<T>({ getState, setState }: StateContext<User>, { user }: UpdateAction) {
    const lastUser = getState()
    setState({ ...lastUser, ...user })
  }

  @Action(LogoutAction)
  public logout<T>({ setState }: StateContext<User>) {
    setState(null)
  }

}
