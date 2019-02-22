import { Component, OnInit, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { CommentService } from 'app/services/commnet.service'
import { Order } from 'app/models/order.model'

@Component({
  selector: 'app-order-comment',
  templateUrl: './order-comment.component.html',
  styleUrls: ['./order-comment.component.scss']
})
export class OrderCommentComponent implements OnInit {
  // 订单ID
  @Input()
  public order: Order
  // 用户评分
  private star = 2
  private conetnt = ''

  constructor(
    private commentService: CommentService,
    private modalController: ModalController
  ) {
    return
  }

  public ngOnInit() {
    return
  }

  /**
   * 关闭modal
   */
  private onClose() {
    this.modalController.dismiss()
  }

  /**
   * 评论
   */
  private onCommit() {
    this.commentService
      .addComment(this.order.room.hotel.id, {
        ranking: this.star,
        content: this.conetnt
      })
      .subscribe(() => {
        this.modalController.dismiss(true)
      })
  }
}
