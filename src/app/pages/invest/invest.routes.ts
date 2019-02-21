import { Routes } from '@angular/router'
import { InvestPage } from './invest.page'

export const investRoutes: Routes = [
  {
    path: '',
    component: InvestPage,
    pathMatch: 'full'
  }
]

export const InvestPages = [InvestPage]
