import { Component, OnInit } from '@angular/core'
import { DeviceService } from 'app/utils/decive.service'
import { NavController } from '@ionic/angular'
import { Router } from '@angular/router'
import { Store, Select } from '@ngxs/store'
import { Observable } from 'rxjs'
import { LocationState } from 'app/store/state/location.state'

@Component({
  selector: 'app-select-position',
  templateUrl: './select-position.component.html',
  styleUrls: ['./select-position.component.scss']
})
export class SelectPositionComponent implements OnInit {
  private location = {}

  @Select()
  private location$: Observable<LocationState>

  constructor(
    private deviceService: DeviceService,
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit() {
    this.location$.subscribe(location => (this.location = location))
    this.getCurrentPosition()
  }

  private async getCurrentPosition() {
    const coords = await this.deviceService.getCurrentPosition()
    // if (coords) {
    //   this.position.coords = coords
    // }
  }

  /**
   * 选择城市
   */
  private onSelectCity() {
    this.router.navigate(['common/city-list'])
  }

  /**
   * 选择城市
   */
  private onSearchAddress() {
    this.router.navigate(['common/search-address'])
  }

  /**
   * 更新定位
   */
  private onLocation() {
    this.deviceService.getCurrentPosition()
  }
}
