import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { hotelController } from 'app/config/service/hotel.controller'
import { User } from 'app/models/user.model'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { HotelEnum } from 'app/config/enum.config'
import { PageService } from 'app/utils/page.service'
import { Hotel } from 'app/models/hotel.model'
import { commentController } from 'app/config/service/commnet.controller'

@Injectable()
export class CommentService {
  constructor(private net: NetService, private store: Store) {}

  /**
   * 获取酒店评论
   */
  public getCommentByHotel(hotelId): Observable<Hotel> {
    return this.net.send({
      service: commentController.getCommentsByHotel,
      model: Comment,
      params: {
        hotelId
      }
    })
  }

  /**
   * 获取酒店评论统计
   * @param hotelId
   */
  public commentDetail(hotelId) {
    return this.net.send({
      service: commentController.commentDetail,
      params: {
        hotelId
      }
    })
  }

  /**
   * 获取酒店评论
   */
  public addComment(hotelId, { ranking, content }): Observable<Hotel> {
    return this.net.send({
      service: commentController.addComment,
      params: {
        hotelId,
        ranking,
        content
      }
    })
  }
}
