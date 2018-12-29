import { Injectable } from '@angular/core';
import { AuthService } from 'app/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LaunchService {

  constructor(
    private authService:AuthService
  ) { }

  launch() {
    //检测用户登录过期
    this.authService.update()
  }
}
