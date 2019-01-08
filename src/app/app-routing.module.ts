import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  // tabs模块
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // home模块
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  // hotel模块
  { path: 'hotel', loadChildren: './pages/hotel/hotel.module#HotelPageModule' },
  // order模块
  { path: 'order', loadChildren: './pages/order/order.module#OrderPageModule' },
  // user模块
  { path: 'user', loadChildren: './pages/user/user.module#UserPageModule' },
  // 钱包模块
  {
    path: 'wallet',
    loadChildren: './pages/wallet/wallet.module#WalletPageModule'
  },
  // 公共模块
  { path: 'common', loadChildren: './pages/common/common.module#CommonModule' },
  // 产品模块
  {
    path: 'product',
    loadChildren: './pages/product/product.module#ProductPageModule'
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
