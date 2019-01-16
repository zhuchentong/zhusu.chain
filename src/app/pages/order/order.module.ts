import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { orderRoutes, orderPages } from './order.routes'
import { SharedModule } from 'app/shared/shared.module'
import { NgxAmapModule } from 'ngx-amap'
import { OrderService } from 'app/services/order.service'
import { OrderExecutionService } from 'app/services/order-execution.service'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(orderRoutes), NgxAmapModule],
  declarations: [...orderPages],
  providers: [OrderService, OrderExecutionService]
})
export class OrderPageModule {}
