import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomePage } from './home.page'
import { SharedModule } from 'app/shared/shared.module'
const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
]

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [HomePage],
  entryComponents: [HomePage],
  providers: []
})
export class HomePageModule {}
