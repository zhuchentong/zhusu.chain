import { Component, OnInit } from '@angular/core'
import { Store } from '@ngxs/store'
import { Hotel } from 'app/models/hotel.model'
import { CollectState } from 'app/store/state/collect.state'

@Component({
  selector: 'app-collect',
  templateUrl: './collect.page.html',
  styleUrls: ['./collect.page.scss']
})
export class CollectPage implements OnInit {
  private hotelList: Hotel[] = []
  constructor(private store: Store) {}

  public ngOnInit() {
    this.hotelList = this.store.selectSnapshot(CollectState.getCollect)
  }
}
