import { Component, OnInit, Input } from '@angular/core'
import { LevelList } from 'app/config/dict.config'
import cloneDeep from 'lodash.clonedeep'

@Component({
  selector: 'app-hotel-filter',
  templateUrl: './hotel-filter.component.html',
  styleUrls: ['./hotel-filter.component.scss']
})
export class HotelFilterComponent implements OnInit {
  @Input()
  private filter = {}
  private originFilter = {}
  private readonly levelList = LevelList.filter(x => x.key > 0)

  // constructor() { }

  public ngOnInit() {
    this.originFilter = cloneDeep(this.filter)
  }

  private onCheckFilterItem(list: any[], value) {
    const index = list.findIndex(x => x === value)
    if (index >= 0) {
      list.splice(index, 1)
    } else {
      list.push(value)
    }
  }

  private getFilter() {
    this.originFilter = cloneDeep(this.filter)
    return this.filter
  }

  private reset() {
    this.filter = cloneDeep(this.originFilter)
  }
}
