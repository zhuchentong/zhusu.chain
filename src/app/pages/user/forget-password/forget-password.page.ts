import { Component, OnInit } from '@angular/core'
import { LoadingController } from '@ionic/angular'
import { CommonService } from 'app/utils/common.service'
import { UserService } from 'app/services/user.service'
import { Router } from '@angular/router'
import { LoggerService } from '@ngx-toolkit/logger'

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss']
})
export class ForgetPasswordPage implements OnInit {
  private name: string
  private smsCode: string
  private loading: any
  private sending: boolean = false
  private timer: any // 定时器取消
  private counter = 30
  private codestring = '获取验证码'

  constructor(
    public commonService: CommonService,
    public loadingCtrl: LoadingController,
    private userService: UserService,
    private router: Router,
    private logger: LoggerService
  ) {}

  // private ionViewDidLoad() {}

  public ngOnInit() {
    return
  }

  private async complite() {
    // 检测手机号码
    if (!this.commonService.checkPhoneNo(this.name)) {
      return
    }

    // 检测验证码
    if (sessionStorage.getItem('smscode') !== this.smsCode) {
      this.commonService.message('验证码错误！', 3000)
      return
    }

    this.loading = await this.loadingCtrl.create({
      message: this.commonService.content
    })
    this.loading.present()
    this.userService.resetPassword(this.name).subscribe(
      (res: any) => {
        // 返回登录页面
        this.router.navigate(['/user/login'])
        sessionStorage.removeItem('smscode')
        this.loading.dismiss()
      },
      (err: any) => {
        this.logger.error(err)
        this.loading.dismiss()
      }
    )
  }

  /**
   * 获取验证码
   */
  private getSmsCode() {
    // 检测手机号码
    if (!this.commonService.checkPhoneNo(this.name)) {
      return
    }

    this.userService.sendSmsCode(this.name).subscribe((res: any) => {
      // 本地保留验证码，注册时需验证是否一致
      this.sending = true
      sessionStorage.setItem('smscode', res.smsCode)
      this.commonService.message('已发送验证码，请查收。' + res.smsCode, 3000)
      this.caltimer()
    })
  }

  private caltimer(): void {
    // 切换注册和登陆模块
    this.timer = setInterval((s: any) => {
      if (this.counter <= 0) {
        this.sending = false
        clearInterval(this.timer)
        this.codestring = '获取验证码'
        this.counter = 30
      } else {
        this.counter--
        this.codestring = this.counter.toString() + 's'
      }
    }, 1000)
  }
}
