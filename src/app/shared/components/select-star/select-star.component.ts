import { Component, OnInit } from '@angular/core'
import { LevelList } from 'app/config/dict.config'
import { ModalController } from '@ionic/angular'
import { Level } from '@ngx-toolkit/logger'
@Component({
  selector: 'app-select-star',
  templateUrl: './select-star.component.html',
  styleUrls: ['./select-star.component.scss']
})
export class SelectStarComponent implements OnInit {
  private readonly levelList = LevelList
  private level = []
  constructor(private modalController: ModalController) {}

  public ngOnInit() {
    // Dismiss the top modal returning some data object
  }

  private onSelectLevel(value) {
    // 处理选择不限
    if (value === 0) {
      return (this.level = [0])
    } else {
      this.level = this.level.filter(x => x !== 0)
    }

    // 选择其他星级
    const index = this.level.indexOf(value)
    index >= 0 ? this.level.splice(index, 1) : this.level.push(value)
  }

  private onSubmit() {
    this.modalController.dismiss(
      this.level.length === this.levelList.length - 1
        ? []
        : this.level.filter(x => x > 0).sort()
    )
  }
}
