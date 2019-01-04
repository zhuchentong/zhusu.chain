import { Routes } from '@angular/router'
import { CityListPage } from './city-list/city-list.page'
import { SearchAddressPage } from './search-address/search-address.page'

export const commonRoutes: Routes = [
  {
    path: 'city-list',
    component: CityListPage
  },
  {
    path: 'search-address',
    component: SearchAddressPage
  }
]

export const commonPages = [CityListPage, SearchAddressPage]
