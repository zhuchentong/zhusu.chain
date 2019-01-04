import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { LaunchService } from './core/services/launch.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private launchService: LaunchService
  ) {
    this.initializeApp()
  }

  private initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleDefault()
        this.splashScreen.hide()
        this.launchService.start()
      })
      .catch()
  }
}
