import { Routes } from '@angular/router'
import { OrderPage } from './order.page'
import { OrderDetailPage } from './order-detail/order-detail.page'

export const orderRoutes: Routes = [
  {
    path: '',
    component: OrderPage,
    pathMatch: 'full'
  },
  { path: 'order-detail/:id', component: OrderDetailPage }
]

export const orderPages = [OrderPage, OrderDetailPage]
