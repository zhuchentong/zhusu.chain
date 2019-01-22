import { User } from 'app/models/user.model'

export class LoginAction {
  public static readonly type = '[User] UserLogin'
  constructor(public user: User) { }
}

export class UpdateUserAction {
  public static readonly type = '[User] UpdateLogin'
  constructor(public user: User) { }
}


export class LogoutAction {
  public static readonly type = '[User] UserLogout'
}
