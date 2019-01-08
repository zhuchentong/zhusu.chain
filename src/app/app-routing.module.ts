import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'hotel', loadChildren: './pages/hotel/hotel.module#HotelPageModule' },
  { path: 'order', loadChildren: './pages/order/order.module#OrderPageModule' },
  { path: 'user', loadChildren: './pages/user/user.module#UserPageModule' },
  {
    path: 'wallet',
    loadChildren: './pages/wallet/wallet.module#WalletPageModule'
  },
  { path: 'common', loadChildren: './pages/common/common.module#CommonModule' },
  {
    path: 'product',
    loadChildren: './pages/product/product.module#ProductPageModule'
  },
  { path: 'order-detail', loadChildren: './pages/order/order-detail/order-detail.module#OrderDetailPageModule' }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
