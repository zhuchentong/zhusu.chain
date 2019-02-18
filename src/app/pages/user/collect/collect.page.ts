import { Component, OnInit } from '@angular/core'
import { Store, Select } from '@ngxs/store'
import { Hotel } from 'app/models/hotel.model'
import { CollectState } from 'app/store/state/collect.state'
import { Observable } from 'rxjs'
import { plainToClass } from 'class-transformer'

@Component({
  selector: 'app-collect',
  templateUrl: './collect.page.html',
  styleUrls: ['./collect.page.scss']
})
export class CollectPage implements OnInit {
  @Select(CollectState) private hotelList$: Observable<Hotel[]>
  private hotelList: Hotel[] = []
  constructor(private store: Store) {}

  public ngOnInit() {
    this.hotelList$.subscribe(list => {
      this.hotelList = plainToClass(Hotel, list)
    })
  }
}
