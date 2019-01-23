import { Component, OnInit, Input } from '@angular/core'
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {
  @Input()
  public color = 'black'

  constructor(private navCtrl: NavController) {}

  public ngOnInit() {
    return
  }

  private onClick() {
    this.navCtrl.goBack()
  }
}
