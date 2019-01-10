import { Routes } from '@angular/router'
import { HotelListPage } from './hotel-list/hotel-list.page'
import { HotelDetailPage } from './hotel-detail/hotel-detail.page'
import { HotelOrderPage } from './hotel-order/hotel-order.page'
import { AuthGuard } from 'app/guards/auth.guard'
import { HotelPage } from './hotel.page'

export const hotelRoutes: Routes = [
  {
    path: '',
    component: HotelPage,
    pathMatch: 'full'
  },
  { path: 'hotel-list', component: HotelListPage },
  { path: 'hotel-detail', component: HotelDetailPage },
  {
    path: 'hotel-order',
    canActivate: [AuthGuard],
    component: HotelOrderPage
  }
]

export const hotelPages = [
  HotelPage,
  HotelListPage,
  HotelDetailPage,
  HotelOrderPage
]
