import { Component, OnInit } from '@angular/core'
import { cityConfig } from 'app/config/city.config'
import { Store } from '@ngxs/store'
import { UpdateLocationAction } from 'app/store/action/location.action'
import { NavController } from '@ionic/angular'
@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.page.html',
  styleUrls: ['./city-list.page.scss']
})
export class CityListPage implements OnInit {
  private readonly cityData = cityConfig

  constructor(private store: Store, private navCtrl: NavController) {}

  public ngOnInit() {
    return
  }

  /**
   * 选择城市
   * @param city
   */
  public onSelectCity({ code, name }) {
    this.store.dispatch(
      new UpdateLocationAction({
        city: {
          name,
          code
        }
      })
    )
    this.navCtrl.goBack()
  }
}
