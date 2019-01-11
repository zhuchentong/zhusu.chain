import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { IonicModule } from '@ionic/angular'

import { OrderPage } from './order.page'
import { orderRoutes, orderPages } from './order.routes'
import { OrderStateEnum } from 'app/config/enum.config'
import { OrderService } from 'app/services/order.service'
import { SharedModule } from 'app/shared/shared.module'
import { NgxAmapModule } from 'ngx-amap'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(orderRoutes), NgxAmapModule],
  declarations: [...orderPages],
  providers: [OrderService]
})
export class OrderPageModule {}
