import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from 'app/shared/shared.module'
import { productPages, productRoutes } from './product.routes'
import { NgxAmapModule } from 'ngx-amap'
import { ProductService } from 'app/services/product.service'
import { ProductItemComponent } from './product-list/product-item/product-item.component'
import { RoomService } from 'app/services/room.service'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productRoutes), NgxAmapModule],
  declarations: [...productPages, ProductItemComponent],
  providers: [ProductService, RoomService]
})
export class ProductPageModule {}
