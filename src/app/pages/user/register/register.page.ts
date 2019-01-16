import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
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
      username: ['', ValidateService.phoneValidate],
      password: ['', Validators.required],
      code: ['', [Validators.required, Validators.min(4)]]
    })
  }

  /**
   * 发送短信验证码
   */
  private onSendVerifyCode() {
    // 检测手机号码
    if (!this.registerForm.controls.username.valid) {
      return
    }

    this.userService.sendSmsCode(this.registerForm.value.username).subscribe(
      ({ smsCode }) => {
        // 本地保留验证码，注册时需验证是否一致
        this.startCountdown()
        sessionStorage.setItem('smscode', smsCode)
        this.commonService.message('已发送验证码，请查收。', 5000)
      },
      () => {
        this.commonService.message('验证码发送失败', 5000)
      }
    )
  }

  /**
   * 用户注册
   */
  private async onRegister() {
    // 验证注册码
    const smscode = sessionStorage.getItem('smscode')
    // TODO:用于测试
    if (!smscode === this.registerForm.value.registercode) {
      this.commonService.message('验证码错误，请核查！', 3000)
      return
    }

    if (!this.registerForm.valid) {
      return
    }

    this.userService
      .register({
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        displayName: this.registerForm.value.username
      })
      .subscribe(
        (res: any) => {
          sessionStorage.removeItem('smscode')
          this.commonService.message('注册成功', 3000)
          this.router.navigate(['/user/login'], {
            replaceUrl: true
          })
        },
        () => {
          this.commonService.message('注册失败', 3000)
        }
      )
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
