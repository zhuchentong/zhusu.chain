import { Routes } from '@angular/router'
import { ProductListPage } from './product-list/product-list.page'
import { ProductDetailPage } from './product-detail/product-detail.page'

export const productRoutes: Routes = [
  { path: 'product-list', component: ProductListPage },
  { path: 'product-detail', component: ProductDetailPage }
]

export const productPages = [ProductListPage, ProductDetailPage]
