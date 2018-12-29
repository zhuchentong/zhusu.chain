import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/utils/common.service';
import { EtherService } from 'app/utils/ether.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenEnum } from 'app/config/enum.config';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  allMoney: string;
  currentEthPrice: string;
  ethAmount: string;
  ethCount: string;
  tokenName: string;
  tokenCount: string;
  tokenPrice: string;
  tokenAmount: string;
  gasLimit: string;
  gasPrice: string;
  tokenEnum: any;
  currentWallet: any = {}
  constructor(
    private commonService: CommonService,
    private etherService: EtherService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commonService.from = this.route.snapshot.paramMap.get('from')
  }

  ngOnInit() {
    this.tokenEnum = tokenEnum;
  }

  ionViewWillEnter() {
    this.initData();
  }

  async initData() {
    let loading = await this.loadingCtrl.create({
      message: this.commonService.content
    });
    loading.present();
    this.currentWallet = this.commonService.getCurrentWallet();
    console.log(this.currentWallet)
    if (this.currentWallet.name != '' && this.currentWallet.address != '') {
      this.etherService.getEthInfo(this.currentWallet.address).then((res: any) => {
        this.currentEthPrice = res.price;
        this.ethAmount = res.amount;
        this.ethCount = res.balance;
        this.allMoney = (parseFloat(res.amount)).toString()
        //获取合约信息，暂时注销
        this.etherService.getJcoInfo(this.currentWallet.address).then((jco: any) => {
          this.tokenName = jco.name;
          this.tokenCount = jco.balance;
          this.tokenAmount = jco.amount;
          this.tokenPrice = jco.price;
          this.allMoney = (parseFloat(res.amount) + parseFloat(jco.amount)).toString();
          loading.dismiss();
        });
      }).catch(res => {
        loading.dismiss();
        console.log(res);
        this.commonService.message("加载失败！", 3000);
      });
    } else {
      loading.dismiss();
      this.tokenCount = '0'
      this.ethCount = '0'
      this.commonService.message("请添加钱包！", 3000);
    }

  }

  sendToken(name: string) {
    this.router.navigate([
      '/wallet/transfer', {
        tokenName: name
      }])
  }

  transfer() {
    this.router.navigate([
      '/wallet/transfer', {
        tokenName: tokenEnum.JCO
      }])
  }

  recive() {
    this.router.navigate([
      '/wallet/receive',
      {
        recive: "1234"
      }
    ])
  }

  wallInfo() {
    this.router.navigate([
      '/wallet/info',
      {
        walletInfo: "1234"
      }
    ])
  }

  changeWallet() {
    this.router.navigate([
      '/wallet/change-wallet',
      {
        ChangeWalletPage: "1234"
      }
    ])
  }

  recoveryWallet() {
    this.router.navigate([
      '/wallet/change-wallet',
      {
        iscreate: true
      }
    ])
  }
}
