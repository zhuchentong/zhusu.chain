import { Component, OnInit, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-order-comment',
  templateUrl: './order-comment.component.html',
  styleUrls: ['./order-comment.component.scss']
})
export class OrderCommentComponent implements OnInit {
  // 订单ID
  @Input()
  public id: number
  // 用户评分
  private star = 2
  private comment = ''

  constructor(private modalController: ModalController) {
    return
  }

  public ngOnInit() {
    return
  }

  private onClose() {
    this.modalController.dismiss()
  }

  /**
   * 评论
   */
  private onCommit() {
    return
  }
}
