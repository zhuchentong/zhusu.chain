import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'hotel',
        loadChildren: '../pages/hotel/hotel.module#HotelPageModule'
      },
      {
        path: 'home',
        loadChildren: '../pages/home/home.module#HomePageModule'
      },
      {
        path: 'order',
        loadChildren: '../pages/order/order.module#OrderPageModule'
      },{
        path: 'user',
        loadChildren: '../pages/user/user.module#UserPageModule'
      },
      {
        path: '',
        redirectTo: '/tabs/hotel',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/hotel',
    pathMatch: 'full'
  }
  // TODO:404
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
