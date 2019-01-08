import { Component, OnInit } from '@angular/core'
import { Select } from '@ngxs/store'

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss']
})
export class UserInfoPage implements OnInit {
  @Select(state => state.user)
  private user$

  // constructor() {}

  public ngOnInit() {
    return
  }
}
