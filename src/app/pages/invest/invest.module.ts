import { NgModule } from '@angular/core'
import { SharedModule } from 'app/shared/shared.module'
import { RouterModule } from '@angular/router'
import { InvestPages, investRoutes } from './invest.routes'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(investRoutes)],
  declarations: [...InvestPages],
  providers: []
})
export class InvestModule {}
