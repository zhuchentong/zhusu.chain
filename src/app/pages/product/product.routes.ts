import { Routes } from '@angular/router'
import { ProductListPage } from './product-list/product-list.page'

export const productRoutes: Routes = [
  { path: 'product-list', component: ProductListPage }
]

export const productPages = [ProductListPage]
