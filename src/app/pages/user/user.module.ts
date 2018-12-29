import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { userRoutes, userPages } from './user.routes'

import { UserService } from 'app/services/user.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(userRoutes)
  ],
  declarations: [
    ...userPages
  ],
  providers: [
    UserService
  ]
})
export class UserPageModule { }
