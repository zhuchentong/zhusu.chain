import { Injectable } from '@angular/core';
import { STOEnum, currencyEnum, tokenEnum } from 'app/config/enum.config'
import { ToastController, AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    public toastCtrl: ToastController,
    public atrCtrl: AlertController
  ) {
  }

  public content = "请等待...";
  public from = 'tab'

  async message(message: string, duration: number) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  async showPromptAlert(title: string, textName: string, inputType: any, cancel: Function, confirm: Function) {
    let alert = await this.atrCtrl.create({
      header: title,
      inputs: [
        {
          name: textName,
          placeholder: '单行输入',
          type: inputType
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            cancel(data);
          }
        },
        {
          text: '确定',
          handler: data => {
            confirm(data);
          }
        }
      ]
    });
    alert.present();
  }

  async showCommonAlert(title: string, subTitle: string, text: string, confirm: Function) {
    let alert = await this.atrCtrl.create({
      header: title,
      subHeader: subTitle,
      buttons: [{
        text: text,
        handler: data => {
          confirm(data);
        }
      }]
    });
    alert.present();
  }

  checkPassword(password: string) {
    let message = "";
    if (password == undefined) {
      message = "密码不能位空！";
    } else if (password.length < 6) {
      message = "密码至少为6位！";
    }
    return message;
    // else{
    //   //校验规则 只允许输入8-16位数字、字母   
    //   var reg = /^[A-Za-z0-9]{6,16}$/;     
    //   if(reg.test(password)){
    //     return true;
    //   }   
    // }
  }

  checkPoneNo(phoneNo: string) {
    let pno = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    let message = "";
    if (!pno.test(phoneNo)) {
      message = "手机号码错误，请核查！";
    }
    return message;
  }

  isEmpty(obj: any) {
    if (obj == null || typeof (obj) == 'string') {
      return true;
    } else {
      return false;
    }
  }

  //=========== 操作 localStorage ======
  isFirstLogin() {
    if (localStorage.length == 0) {
      return true;
    } else if (localStorage.getItem(this.getCurrentUser()) == null) {
      return true;
    } else {
      return false;
    }
  }

  insertLocal(key: string, value: string) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, value);
    }
  }

  setCurrency(value: string) {
    localStorage.setItem(STOEnum.currentCurrency, value);
  }

  setDefaultCurrency() {
    localStorage.setItem(STOEnum.currentCurrency, currencyEnum.CNY);
  }

  getCurrency() {
    return localStorage.getItem(STOEnum.currentCurrency);
  }

  getCurrentWalletJson() {
    return this.parseWalletJson(this.getCurrentUser()).json;
  }

  insertLocalStorage(address: string, json: any, name: string) {
    let username = this.getCurrentUser();
    if (localStorage.getItem(address)) {
      let wallet = this.parseWalletJson(address);
      if (wallet.username.indexOf(username) < 0) {
        username = wallet.username + "," + username;
        name = wallet.name;
      }
    }
    var data = {
      name: name,
      address: address,
      json: json,
      username: username
    };
    localStorage.setItem(address, JSON.stringify(data));
    localStorage.setItem(this.getCurrentUser(), JSON.stringify(data));
  }

  deleteAddress(address: string) {
    let wallet = this.parseWalletJson(address);
    if (wallet.address == this.parseWalletJson(this.getCurrentUser()).address) {
      localStorage.removeItem(address);
      localStorage.removeItem(this.getCurrentUser());
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) !== STOEnum.currentCurrency) {
          localStorage.setItem(this.getCurrentUser(), localStorage.getItem(localStorage.key(i)));
          return;
        }
      }
    } else {
      localStorage.removeItem(address);
    }
  }

  setCurrentWallet(address: string) {
    let wallet = this.parseWalletJson(address);
    localStorage.setItem(this.getCurrentUser(), JSON.stringify(wallet));
  }

  getCurrentWallet() {
    let wallet = this.parseWalletJson(this.getCurrentUser());
    if (wallet) {
      return { name: wallet.name, address: wallet.address };
    } else {
      return { name: '', address: '' };
    }
  }

  getWalletList(): any[] {
    let list: any[] = [];
    let username = this.getCurrentUser();
    for (var i = 0; i < localStorage.length; i++) {
      //key(i)获得相应的键，再用getItem()方法获得对应的值
      if (localStorage.key(i)!.indexOf('0x') >= 0) {
        let wallet = this.parseWalletJson(localStorage.key(i));
        if (wallet.username.indexOf(username) >= 0) {
          list.push({ name: wallet.name, address: wallet.address, selected: false });
        }
      }
    }
    return list;
  }

  updateWalletName(address: string, name: string) {
    let wallet = this.parseWalletJson(address);
    wallet.name = name;
    localStorage.setItem(address, JSON.stringify(wallet));
  }
  //========================================
  setToken(access_token: string, refresh_token: string) {
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem("refresh_token", refresh_token);
  }

  getCurrentUser(): any {
    return 'default'//sessionStorage.getItem("current_user")  //钱包无需登录，username保存的就是 current_user，hwh
  }

  public parseWalletJson(key: string) {
    let json = localStorage.getItem(key);
    let data: any;
    if (json) {
      try {
        data = JSON.parse(json);
      } catch (error) {
        console.log(error);
      }
    }
    return data;
  }
}
