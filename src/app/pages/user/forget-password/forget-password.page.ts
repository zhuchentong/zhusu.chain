import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'app/utils/common.service';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  constructor(
    public commonService: CommonService,
    public loadingCtrl: LoadingController,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
  }

  name: string;
  smsCode: string;
  loading: any;
  sending: boolean = false;
  timer: any;//定时器取消
  counter = 30;
  codestring = "获取验证码";





  complite() {
    let phoneMessage = this.commonService.checkPoneNo(this.name);

    if (!this.commonService.isEmpty(phoneMessage)) {
      this.commonService.message(phoneMessage, 3000);
      return;
    }
    if (sessionStorage.getItem("smscode") != this.smsCode) {
      this.commonService.message("验证码错误！", 3000);
      return;
    }
    this.loading = this.loadingCtrl.create({
      message: this.commonService.content
    });
    this.loading.present();
    this.userService.resetPassword(this.name).subscribe((res: any) => {
      // 返回登录页面
      this.router.navigate(['/user/login'])
      sessionStorage.removeItem("smscode");
      this.loading.dismiss();
    }, (err: any) => {
      console.log(err);
      this.loading.dismiss();
    });
  }

  getSmsCode() {
    //验证手机号是否合法
    let message = this.commonService.checkPoneNo(this.name);
    if (this.commonService.isEmpty(message)) {
      this.userService.sendSmsCode(this.name).subscribe((res: any) => {
        //本地保留验证码，注册时需验证是否一致
        this.sending = true;
        sessionStorage.setItem("smscode", res.smsCode);
        this.commonService.message("已发送验证码，请查收。" + res.smsCode, 3000);
        this.caltimer();
      });
    } else {
      this.commonService.message(message, 3000);
    }
  }

  caltimer(): void {//切换注册和登陆模块
    this.timer = setInterval((s: any) => {
      if (this.counter <= 0) {
        this.sending = false;
        clearInterval(this.timer);
        this.codestring = "获取验证码";
        this.counter = 30;
      } else {
        this.counter--;
        this.codestring = this.counter.toString() + "s";
      }
    }, 1000);
  }

}
