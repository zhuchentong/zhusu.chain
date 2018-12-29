import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetService } from 'app/utils/net.service'
import { LaunchService } from './services/launch.service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    NetService,
    LaunchService
  ]
})
export class CoreModule {
  constructor(private launchService: LaunchService) {
    launchService.launch()
  }
}
