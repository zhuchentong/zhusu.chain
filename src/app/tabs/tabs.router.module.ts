import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { TabsPage } from './tabs.page'

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'coin',
        loadChildren: '../pages/coin/coin.module#CoinModule'
      },
      {
        path: 'hotel',
        loadChildren: '../pages/hotel/hotel.module#HotelPageModule'
      },
      {
        path: 'invest',
        loadChildren: '../pages/invest/invest.module#InvestModule'
      },
      {
        path: 'user',
        loadChildren: '../pages/user/user.module#UserPageModule'
      },
      {
        path: '',
        redirectTo: '/tabs/coin',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/coin',
    pathMatch: 'full'
  }
  // TODO:404
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
