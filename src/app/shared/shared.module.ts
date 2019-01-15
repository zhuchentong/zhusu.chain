import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { BackButtonComponent } from './components/back-button/back-button.component'
import { AuthService } from 'app/utils/auth.service'
import { CommonService } from 'app/utils/common.service'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { EndLineComponent } from './components/end-line/end-line.component'
import { DeviceService } from 'app/utils/decive.service'
import { WeekPipe } from './pipes/week.pipe'
import { SelectPositionComponent } from './components/select-position/select-position.component'
import { SelectDateComponent } from './components/select-date/select-date.component'
import { SelectStarComponent } from './components/select-star/select-star.component'
import { PageService } from 'app/utils/page.service'
import { ScoreStarComponent } from './components/score-star/score-star.component'
import { ClonePipe } from './pipes/clone.pipe'
@NgModule({
  declarations: [
    BackButtonComponent,
    EndLineComponent,
    SelectPositionComponent,
    SelectDateComponent,
    WeekPipe,
    ClonePipe,
    SelectStarComponent,
    ScoreStarComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BackButtonComponent,
    EndLineComponent,
    WeekPipe,
    ClonePipe,
    SelectPositionComponent,
    SelectDateComponent,
    SelectStarComponent,
    ScoreStarComponent
  ],
  providers: [
    AuthService,
    CommonService,
    DeviceService,
    Geolocation,
    PageService
  ],
  entryComponents: [SelectStarComponent]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    }
  }
}
