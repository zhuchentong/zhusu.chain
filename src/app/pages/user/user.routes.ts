import { Routes } from '@angular/router'

import { UserPage } from './user.page'
import { LoginPage } from './login/login.page'
import { RegisterPage } from './register/register.page'
import { ForgetPasswordPage } from './forget-password/forget-password.page'

import { AuthPage } from './auth/auth.page'
import { ContactPage } from './contact/contact.page'
import { RecordPage } from './record/record.page'
import { SettingPage } from './setting/setting.page'
import { UserInfoPage } from './user-info/user-info.page'
import { CollectPage } from './collect/collect.page'

export const userRoutes: Routes = [
  { path: '', component: UserPage, pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forget-password', component: ForgetPasswordPage },
  { path: 'auth', component: AuthPage },
  { path: 'contact', component: ContactPage },
  { path: 'record', component: RecordPage },
  { path: 'setting', component: SettingPage },
  { path: 'auth', component: AuthPage },
  { path: 'info', component: UserInfoPage },
  { path: 'collect', component: CollectPage }
]

export const userPages = [
  UserPage,
  LoginPage,
  RegisterPage,
  ForgetPasswordPage,
  UserInfoPage,
  AuthPage,
  ContactPage,
  RecordPage,
  SettingPage,
  CollectPage
]
