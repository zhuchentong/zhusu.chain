import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from 'app/shared/shared.module'
import { hotelRoutes, hotelPages } from './hotel.routes'
import { NgxAmapModule } from 'ngx-amap'
import { HotelItemComponent } from './hotel-list/hotel-item/hotel-item.component'
import { HotelService } from 'app/services/hotel.service'
import { RoomService } from 'app/services/room.service'
import { OrderService } from 'app/services/order.service'

@NgModule({
  imports: [SharedModule, RouterModule.forChild(hotelRoutes), NgxAmapModule],
  declarations: [...hotelPages, HotelItemComponent],
  providers: [HotelService, RoomService, OrderService]
})
export class HotelPageModule {}
