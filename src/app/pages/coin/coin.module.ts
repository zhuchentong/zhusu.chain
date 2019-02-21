import { NgModule } from '@angular/core'
import { SharedModule } from 'app/shared/shared.module'
import { RouterModule } from '@angular/router'
import { coinPages, coinRoutes } from './coin.routes'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(coinRoutes)],
  declarations: [...coinPages],
  providers: []
})
export class CoinModule {}
