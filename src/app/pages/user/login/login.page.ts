import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { UserService } from 'app/services/user.service'
import { NavController } from '@ionic/angular'
import { CommonService } from 'app/utils/common.service'
import { LoggerService } from '@ngx-toolkit/logger'
import { Store } from '@ngxs/store'
import { LoginAction } from 'app/store/action/user.action'
import { ValidateService } from 'app/utils/validate.service'
import { WalletState } from 'app/store/state/wallet.state'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  @Input('serverUrl')
  private serverUrl: string = 'http://localhost:9002' // 服务器地址
  @Input('rpcURL')
  private rpcURL: string = 'http://localhost:9545' // 合约地址
  @Input('contractAdress')
  private contractAdress: string = '0x345ca3e014aaf5dca488057592ee47305d9b3e10' // 合约账户
  private boxState = 'inactive'
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
  private redirect
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private store: Store
  ) {}

  public ngOnInit() {
    // 获取待跳转页面
    this.redirect = this.route.snapshot.paramMap.get('redirect')
    // TODO:for dev
    this.loginForm = this.formBuilder.group({
      username: ['18000000000', ValidateService.phoneValidate],
      password: ['123123', Validators.required]
    })
  }

  /**
   * 用户登录
   */
  private onLogin() {
    if (!this.loginForm.valid) {
      return
    }

    this.userService.login(this.loginForm.value).subscribe(
      user => {
        // 存储用户登录信息
        this.store.dispatch(new LoginAction(user))
        // 如果存在待跳转页面直接跳转
        if (this.redirect) {
          this.router.navigate([this.redirect], {
            replaceUrl: true
          })
          return
        }
        // 获取当前钱包
        const wallet = this.store.selectSnapshot(WalletState.getCurrentWallet())

        if (!wallet) {
          // this.commonService.setDefaultCurrency()
          // TODO: 首次登录进入钱包
          // TODO: 首次登录注册钱包
          this.commonService.toast('未发现用户钱包,请导入或创建钱包')
          this.router.navigate(['/wallet/wallet-change'], { replaceUrl: true })
        } else {
          // 登录成功，返回之前页面
          this.navCtrl.goBack()
        }
      },
      (err: any) => {
        this.logger.error(err)
        this.commonService.message('登陆失败，请重试！', 3000)
      }
    )
  }
}
