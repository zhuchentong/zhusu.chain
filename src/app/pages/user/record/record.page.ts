import { Component, OnInit } from '@angular/core'
import { Store, Select } from '@ngxs/store'
import { RecordState } from 'app/store/state/record.state'
import { Hotel } from 'app/models/hotel.model'
import { plainToClass } from 'class-transformer'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss']
})
export class RecordPage implements OnInit {
  @Select(RecordState) private hotelList$: Observable<Hotel[]>
  private hotelList: Hotel[] = []
  constructor(private store: Store) {}

  public ngOnInit() {
    this.hotelList$.subscribe(list => {
      this.hotelList = plainToClass(Hotel, list)
    })
  }
}
