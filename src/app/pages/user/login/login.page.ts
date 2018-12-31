import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService } from 'app/services/user.service'
import { AuthService } from 'app/utils/auth.service'
import { NavController, LoadingController } from '@ionic/angular'
import { CommonService } from 'app/utils/common.service'
import { LoggerService } from '@ngx-toolkit/logger'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  // private currentUser
  // private loginForm: FormGroup;

  // constructor(
  //   private userService: UserService,
  //   public formBuilder: FormBuilder,
  //   private authService: AuthService,
  //   private router: Router,
  //   private navCtrl: NavController
  // ) {

  // }

  // ngOnInit() {
  //   this.loginForm = this.formBuilder.group({
  //     username: new FormControl('', Validators.required),
  //     password: new FormControl('', Validators.required)
  //   });
  // }

  // onSubmit() {
  //   this.authService.login(
  //     this.loginForm.value.username,
  //     this.loginForm.value.password
  //   ).subscribe(data => {
  //   })
  // }
  // back() {
  //   this.navCtrl.goBack()
  // }

  // TODO: 提取loading为装饰器
  @Input('serverUrl')
  private serverUrl: string = 'http://localhost:9002' // 服务器地址
  @Input('rpcURL')
  private rpcURL: string = 'http://localhost:9545' // 合约地址
  @Input('contractAdress')
  private contractAdress: string = '0x345ca3e014aaf5dca488057592ee47305d9b3e10' // 合约账户

  private selectLine: string
  private isloginModel: boolean
  private loginForm: FormGroup
  private registerForm: FormGroup
  private selectRegisterLine: string
  private codestring: string
  private loading: any
  private timer: any // 定时器取消
  private counter = 30
  private sending = false

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public commonService: CommonService,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {}

  public ngOnInit() {
    this.initLogin()
  }

  private initLogin() {
    this.loginForm = this.formBuilder.group({
      username: ['13572209183', Validators.required],
      password: ['admin', Validators.required]
    })

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      registercode: ['', Validators.required]
    })

    this.changeModel(0)
    this.codestring = '获取验证码'
    // TODO:修改地址
    // this.global.SERVER_URL = this.serverUrl
    // this.global.RPC_URL = this.rpcURL
    // this.global.CONTRACT_ADRESS = this.contractAdress
  }

  private async login() {
    // 验证表单，发起http请求
    this.loading = await this.loadingCtrl.create({
      message: this.commonService.content
    })

    // 检测手机号
    if (!this.commonService.checkPhoneNo(this.loginForm.value.username)) {
      return
    }

    if (this.loginForm.valid) {
      this.loading.present()
      this.authService
        .login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe(
          (res: any) => {
            // TODO:修改到auth拦截器中完成
            // sessionStorage.setItem('access_token', res.access_token);
            // sessionStorage.setItem("refresh_token", res.refresh_token);
            // sessionStorage.setItem("current_user", this.loginForm.value.username);
            if (this.commonService.isFirstLogin()) {
              this.commonService.setDefaultCurrency()
              // TODO: 首次登录进入钱包
              // TODO: 首次登录注册钱包
              this.router.navigate(['/wallet'], { replaceUrl: true })
            } else {
              // 登录成功，返回之前页面
              this.navCtrl.goBack()
            }
            this.loading.dismiss()
          },
          (err: any) => {
            this.logger.error(err)
            this.loading.dismiss()
            this.commonService.message('登陆失败，请重试！', 3000)
          }
        )
    }
  }

  private changeModel(par: number): void {
    // 切换注=册和登陆模块
    if (par === 0) {
      this.isloginModel = true
      this.selectLine = 'sub_button_select'
      this.selectRegisterLine = ''
    } else {
      this.isloginModel = false
      this.selectRegisterLine = 'sub_button_select'
      this.selectLine = ''
    }
  }

  private getSmsCode() {
    // 检测手机号码
    if (!this.commonService.checkPhoneNo(this.registerForm.value.username)) {
      return
    }

    this.userService
      .sendSmsCode(this.registerForm.value.username)
      .subscribe((res: any) => {
        // 本地保留验证码，注册时需验证是否一致
        this.sending = true
        sessionStorage.setItem('smscode', res.smsCode)
        this.commonService.message('已发送验证码，请查收。' + res.smsCode, 5000)
        this.caltimer()
      })
  }

  /**
   * 用户注册
   */
  private register(): void {
    // 检测手机号
    if (!this.commonService.checkPhoneNo(this.loginForm.value.username)) {
      return
    }
    // 检测密码
    if (!this.commonService.checkPassword(this.registerForm.value.password)) {
      return
    }

    this.loading = this.loadingCtrl.create({
      message: this.commonService.content
    })

    // 验证注册码
    if (
      sessionStorage.getItem('smscode') === this.registerForm.value.registercode
    ) {
      this.loading.present()
      this.userService
        .register({
          username: this.registerForm.value.username,
          password: this.registerForm.value.password,
          displayName: this.registerForm.value.username
        })
        .subscribe(
          (res: any) => {
            this.loading.dismiss()
            this.changeModel(0)
            this.initLogin()
            sessionStorage.removeItem('smscode')
          },
          () => {
            this.loading.dismiss()
            this.commonService.message('验证码错误，请核查！', 3000)
          }
        )
    } else {
      this.commonService.message('验证码错误，请核查！', 3000)
    }
  }

  private findPassword() {
    // TODO:前往找回密码页面
    this.router.navigate(['user/forget-password'])
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
