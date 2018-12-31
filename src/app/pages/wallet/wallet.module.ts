import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { SharedModule } from 'app/shared/shared.module'

import { walletRoutes, walletPages } from './wallet.routes'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(walletRoutes),
    SharedModule
  ],
  declarations: [walletPages]
})
export class WalletPageModule {}
