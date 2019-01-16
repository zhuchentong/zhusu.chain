import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService } from 'app/services/user.service'
import { CommonService } from 'app/utils/common.service'
import { ValidateService } from 'app/utils/validate.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  private registerForm: FormGroup
  private sendTime = 0
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private userService: UserService
  ) {}

  public ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [ValidateService.phoneValidate]],
      password: ['', Validators.required],
      code: ['', Validators.required]
    })
  }

  private onSubmit() {
    this.userService.getUserList().subscribe()
  }

  private onSendVerifyCode() {
    this.startCountdown()
    // // 检测手机号码
    // if (!this.commonService.checkPhoneNo(this.registerForm.value.username)) {
    //   return
    // }

    // this.userService
    //   .sendSmsCode(this.registerForm.value.username)
    //   .subscribe((res: any) => {
    //     // 本地保留验证码，注册时需验证是否一致
    //     // this.sending = true
    //     sessionStorage.setItem('smscode', res.smsCode)
    //     this.commonService.message('已发送验证码，请查收。' + res.smsCode, 5000)
    //     // this.caltimer()
    //   })
  }

  /**
   * 用户注册
   */
  private async register() {
    // 检测手机号
    // if (!this.commonService.checkPhoneNo(this.loginForm.value.username)) {
    //   return
    // }
    // // 检测密码
    // if (!this.commonService.checkPassword(this.registerForm.value.password)) {
    //   return
    // }

    // this.loading = await this.loadingCtrl.create({
    //   message: this.commonService.content
    // })

    // 验证注册码
    if (
      sessionStorage.getItem('smscode') ===
        this.registerForm.value.registercode ||
      true
    ) {
      // this.loading.present()
      this.userService
        .register({
          username: this.registerForm.value.username,
          password: this.registerForm.value.password,
          displayName: this.registerForm.value.username
        })
        .subscribe(
          (res: any) => {
            // this.loading.dismiss()
            // this.changeModel(0)
            // this.initLogin()
            sessionStorage.removeItem('smscode')
          },
          () => {
            // this.loading.dismiss()
            this.commonService.message('验证码错误，请核查！', 3000)
          }
        )
    } else {
      this.commonService.message('验证码错误，请核查！', 3000)
    }
  }

  /**
   * 开始支付倒计时
   */
  private startCountdown() {
    const timeLong = 60
    this.sendTime = timeLong
    this.commonService.setCountdown(timeLong * 1000).subscribe(
      time => {
        this.sendTime = Math.floor(time / 1000)
      },
      () => {
        this.sendTime = 0
      }
    )
  }
}
