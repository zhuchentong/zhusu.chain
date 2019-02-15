import { Component, OnInit } from '@angular/core'
import { Store } from '@ngxs/store'
import { RecordState } from 'app/store/state/record.state'
import { Hotel } from 'app/models/hotel.model'

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss']
})
export class RecordPage implements OnInit {
  private hotelList: Hotel[] = []
  constructor(private store: Store) {}

  public ngOnInit() {
    this.hotelList = this.store.selectSnapshot(RecordState.getRecord)
  }
}
