import { NgModule } from '@angular/core'
import { SharedModule } from 'app/shared/shared.module'
import { RouterModule } from '@angular/router'
import { commonRoutes, commonPages } from './common.routes'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(commonRoutes)],
  declarations: [...commonPages],
  providers: []
})
export class CommonModule {}
