import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from 'app/shared/shared.module'
import { productPages, productRoutes } from './product.routes'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productRoutes)],
  declarations: [...productPages],
  providers: []
})
export class ProductPageModule {}
