import { Routes } from '@angular/router'
import { ProductListPage } from './product-list/product-list.page'
import { ProductDetailPage } from './product-detail/product-detail.page'
import { ProductOrderPage } from './product-order/product-order.page'
import { AuthGuard } from 'app/guards/auth.guard'

export const productRoutes: Routes = [
  { path: 'product-list', component: ProductListPage },
  { path: 'product-detail', component: ProductDetailPage },
  {
    path: 'product-order',
    canActivate: [AuthGuard],
    component: ProductOrderPage
  }
]

export const productPages = [
  ProductListPage,
  ProductDetailPage,
  ProductOrderPage
]
