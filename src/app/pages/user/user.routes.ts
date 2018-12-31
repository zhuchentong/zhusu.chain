import { Routes } from '@angular/router'

import { UserPage } from './user.page'
import { LoginPage } from './login/login.page'
import { RegisterPage } from './register/register.page'
import { ForgetPasswordPage } from './forget-password/forget-password.page'

export const userRoutes: Routes = [
  { path: '', component: UserPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forget-password', component: ForgetPasswordPage }
]

export const userPages = [UserPage, LoginPage, RegisterPage, ForgetPasswordPage]
