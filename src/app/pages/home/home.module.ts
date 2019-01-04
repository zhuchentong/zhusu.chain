import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomePage } from './home.page'
import { SharedModule } from 'app/shared/shared.module'
import { SearchAddressPage } from '../common/search-address/search-address.page'
const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
]

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [HomePage, SearchAddressPage],
  entryComponents: [HomePage, SearchAddressPage],
  providers: []
})
export class HomePageModule {}
