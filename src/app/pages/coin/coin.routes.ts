import { Routes } from '@angular/router'
import { CoinPage } from './coin.page'

export const coinRoutes: Routes = [
  {
    path: '',
    component: CoinPage,
    pathMatch: 'full'
  }
]

export const coinPages = [CoinPage]
