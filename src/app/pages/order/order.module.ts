import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { orderRoutes, orderPages } from './order.routes'
import { SharedModule } from 'app/shared/shared.module'
import { NgxAmapModule } from 'ngx-amap'
import { OrderService } from 'app/services/order.service'
import { OrderExecutionService } from 'app/services/order-execution.service'
import { OrderCommentComponent } from './order-detail/order-comment/order-comment.component'
import { CommentService } from 'app/services/commnet.service'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(orderRoutes), NgxAmapModule],
  declarations: [...orderPages, OrderCommentComponent],
  providers: [OrderService, OrderExecutionService, CommentService]
})
export class OrderPageModule {}
