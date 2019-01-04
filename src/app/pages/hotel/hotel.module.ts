import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { IonicModule } from '@ionic/angular'

import { HotelPage } from './hotel.page'
import { SharedModule } from 'app/shared/shared.module'

const routes: Routes = [
  {
    path: '',
    component: HotelPage
  }
]

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [HotelPage ],
  providers: []
})
export class HotelPageModule {}
