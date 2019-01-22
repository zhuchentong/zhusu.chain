import { Component, OnInit, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input()
  public amount

  constructor(private modalController: ModalController) {}

  public ngOnInit() {
    return
  }
}
