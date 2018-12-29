import { Injectable } from '@angular/core';
import { CommonService } from 'app/utils/common.service';
import { ethers } from 'ethers';
import { contractConfig } from 'app/config/contract.config'
const network = ethers.providers.networks.ropsten;
let provider: any


@Injectable({
  providedIn: 'root'
})
export class EtherService {
  jcoPrice = 0.52;
  userGas = 30000;//单位gas
  gaslimit: 250000;
  private readonly provider

  constructor(public commonService: CommonService) {
    this.provider = new ethers.providers.JsonRpcProvider(contractConfig.RPC_URL, network);
  }

  /**
   * 创建钱包
   * @param password 
   */
  createWallet(password: string) {
    password = this.normalizePassword(password);

    return new Promise((resolve, reject) => {
      let wallet = ethers.Wallet.createRandom();
      wallet.encrypt(password).then(function (json: any) {
        wallet.provider = provider;
        this.commonService.insertLocalStorage(wallet.address, json, "我的钱包" + (localStorage.length > 1 ? localStorage.length - 1 : ''));
        resolve(wallet.mnemonic);
      }, (err: any) => {
        console.log(reject(err));
      });
    });
  }

  /**
   * 导入私钥
   * @param privatekey 
   * @param password 
   */
  importPrivateKey(privatekey: string, password: string) {
    return new Promise((resolve, reject) => {
      let wallet = new ethers.Wallet(privatekey);
      wallet.provider = provider;
      wallet.encrypt(password).then(function (json: any) {
        this.commonService.insertLocalStorage(wallet.address, json, "我的钱包" + (localStorage.length > 1 ? localStorage.length - 1 : ''));
        resolve(wallet.address);
      }, (err: any) => {
        console.log(reject(err));
      });
    });
  }

  /**
   * 导入助记词
   * @param mnemonic 
   * @param password 
   */
  importMnemonic(mnemonic: string, password: string) {
    return new Promise((resolve, reject) => {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic);
      wallet.provider = provider;
      wallet.encrypt(password).then(function (json: any) {
        this.commonService.insertLocalStorage(wallet.address, json, "我的钱包" + (localStorage.length > 1 ? localStorage.length - 1 : ''));
        resolve(wallet.address);
      }, (err: any) => {
        console.log(reject(err));
      });
    });
  }

  /**
   * 检查助记词
   * @param mnemonic 
   */
  checkMnemonic(mnemonic: string) {
    return ethers.HDNode.isValidMnemonic(mnemonic);
  }

  /**
   * 导出钱包
   * @param address 
   * @param password 
   */
  exportWallet(address: string, password: string) {
    let json = this.commonService.parseWalletJson(address).json;
    return ethers.Wallet.fromEncryptedWallet(json, password);
  }

  /**
   * 测试方法
   * @param address 
   * @param password 
   */
  test(address: string, password: string) {
    let json = this.commonService.parseWalletJson("0x4b3200e9650B1f34e3836247f335baf6981b9868").json;
    console.log(json)
    let jo = '{"address":"29872eb7414e91497f186477879c46264650ba31","crypto":{"cipher":"aes-128-ctr","ciphertext":"ded26727239b66bc30db2ead5d1409a6ce41cde584115b3183f9755da7317abe","cipherparams":{"iv":"69d9026b38afcb795bee93c82edea49a"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"1b4cc40895f639c22ccfa8f65334337ba95fee2e00109a9e3a7bf885dfc379c7"},"mac":"54fbd1667aae1fcdd6da4f569dabd8092a122faaf690c24bdd78978ebc3b0416"},"id":"1ae67bd3-96ad-4dd8-bc00-80af14d1a38c","version":3}';
    console.log(JSON.parse(jo));
    ethers.Wallet.fromEncryptedWallet(jo, password).then((res: any) => {
      console.log(res.privateKey);
    });
  }

  /**
   * 获取钱包余额
   * @param address 
   */
  getEtherBalance(address: string) {
    let provider = new ethers.providers.EtherscanProvider();
    return new Promise((resolve, reject) => {
      provider.getBalance(address).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        console.log(reject(err));
      });
    });
  }

  /**
   * 获取ETH对应的美元金额
   */
  getEtherPrice() {
    let provider = new ethers.providers.EtherscanProvider();
    return new Promise((resolve, reject) => {
      provider.getEtherPrice().then((res: any) => {
        resolve(res);
      }, (err: any) => {
        console.log(reject(err));
      });
    });
  }

  /**
   * 获取账户相关ETH信息 
   * @param address 
   */
  async getEthInfo(address: string) {
    let provider = new ethers.providers.EtherscanProvider()
    // 获取余额
    const balanceOfWei = await provider.getBalance(address)
    const balance = Number(ethers.utils.formatEther(balanceOfWei))
    const price = await provider.getEtherPrice()
    // bigNumber 不能和小数进行计算，所以要先将汇率变成整数
    // const rate = Math.round(price * 100);
    // const result = balanceOfWei.mul(rate).div(100);
    return {
      price,
      balance,
      amount: parseFloat((balance * price).toString()).toFixed(2).toString()
    }

    // return new Promise((resolve, reject) => {

    //   provider.getBalance(address).then((balance: any) => {
    //     let count = Number(ethers.utils.formatEther(balance))
    //     provider1.getEtherPrice().then((price: any) => {
    //       // bigNumber 不能和小数进行计算，所以要先将汇率变成整数
    //       const rate = Math.round(price * 100);
    //       const result = balance.mul(rate).div(100);
    //       let data = {
    //         price: price,
    //         balance: count,
    //         amount: parseFloat((count * price).toString()).toFixed(2).toString()
    //       }
    //       resolve(data);
    //     })
    //   }).catch((res: any) => {
    //     reject(res);
    //   });
    // });
  }

  /**
   *  获取Gas价格
   */
  getGasPrice() {
    const provider = new ethers.providers.EtherscanProvider();
    return new Promise((resolve, reject) => {
      provider.getGasPrice().then((res: any) => {
        resolve(res);
      }, (err: any) => {
        console.log(reject(err));
      });
    });
  }

  /**
   * 获取代币信息
   * @param address 
   */
  getJcoInfo(address: string) {
    // 实例化合约
    const contract = new ethers.Contract(
      contractConfig.contractAddress,
      contractConfig.contractAbi,
      provider
    );
    const price = this.jcoPrice;
    return new Promise((resolve, reject) => {
      contract.symbol().then((token: any) => {
        contract.balanceOf(address).then((balance: any) => {
          let data = {
            name: token,
            balance: balance,
            price: price,
            amount: balance.mul(price * 100).div(100)
          }
          console.log('getJcoInfo!!!!')
          console.log(data)
          resolve(data);
        });
      }, (err: any) => {
        console.log(reject(err));
      });
    });
  }

  /**
   * 获取交易参数
   * @param gasPrice 
   * @param toAddress 
   * @param value 
   * @param data 
   */
  private getTransaction(gasPrice: string, toAddress: string, value: string, data: any) {
    let transaction = {
      gasLimit: this.gaslimit,
      gasPrice: ethers.utils.bigNumberify(gasPrice)
      //to: toAddress,
      // data: "0x",
      // value: ethers.utils.parseEther(value)
    };
    return transaction;
  }

  /**
   * 预估需要的Gas 
   * @param password 
   * @param transaction 
   */
  estimateGas(password: string, transaction: any) {
    // let transaction = {
    //   gasLimit: 1000000,
    //   to: "0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290",
    //   data: "0x",
    //   value: this.etherService.parseEther("1.0")
    // };
    let json = this.commonService.getCurrentWalletJson();
    return new Promise(function (resolve, reject) {
      ethers.Wallet.fromEncryptedWallet(json, password).then((wallet: any) => {
        wallet.provider = provider;
        resolve(wallet.estimateGas(transaction));
      }, (err: any) => {
        console.log(reject(err));
      })
    });
  }

  /**
   * 发送ETH
   * @param toAddress 
   * @param amount 
   * @param password 
   * @param remark 
   */
  sendETH(toAddress: string, amount: string, password: string, remark: string) {
    let json = this.commonService.getCurrentWalletJson();
    return new Promise((resolve, reject) => {
      ethers.Wallet.fromEncryptedWallet(json, password).then((wallet: any) => {
        wallet.provider = provider;
        let signature = "0x";
        if (typeof (remark) == "string") {
          signature = wallet.signMessage(remark);
        }
        let transaction = {
          gasLimit: this.gaslimit,
          to: toAddress,
          data: signature,
          value: this.parseEther(amount)
        };
        console.log('sendTh')
        console.log(transaction)
        console.log(amount)
        //resolve(wallet.sendTransaction(transaction));  //给contracts转
        resolve(wallet.send(toAddress, this.parseEther(amount)));
      }, (err: any) => {
        console.log(reject(err));
      })
    });
  }

  /**
   * 发送交易
   * @param toAddress 
   * @param amount 
   * @param password 
   * @param gasPrice 
   * @param remark 
   */
  sendTransaction(toAddress: string, amount: string, password: string, gasPrice: string, remark: string) {
    let json = this.commonService.getCurrentWalletJson();
    let count = ethers.utils.bigNumberify(amount);
    return new Promise((resolve, reject) => {
      ethers.Wallet.fromEncryptedWallet(json, password).then((wallet: any) => {
        wallet.provider = provider;
        let signature = "0x";
        if (typeof (remark) == "string") {
          signature = wallet.signMessage(remark);
        }
        let tx = this.getTransaction(gasPrice, toAddress, amount, signature)
        let contract = new ethers.Contract(
          contractConfig.contractAddress,
          contractConfig.contractAbi,
          wallet
        );
        contract.balanceOf(wallet.address).then((balance: any) => {
          // 余额与gas的数量是否需要大于转账数量？
          if (balance.gt(count)) {
            resolve(contract.transfer(toAddress, count, tx));
          }
        }, (err: any) => {
          console.log("====1===")
          console.log(err)
          console.log(reject(err));
        });
      }, (err: any) => {
        console.log("====2===")
        console.log(reject(err));
      });
    });
  }

  /**
   * 测试方法
   */
  testSend() {
    let wallet = new ethers.Wallet('0x127771ffc51c970d961228aefcc7d8ecfc5f78c8257d88cdb4fad54fdac29731');
    wallet.provider = provider;
    let contract = new ethers.Contract(
      contractConfig.contractAddress,
      contractConfig.contractAbi,
      wallet
    );
    // let ownaddress = '0x24B05248349Ef47083C4B54ea951D38373721FDF';
    let address = '0x4b3200e9650B1f34e3836247f335baf6981b9868';//'0x4AEc3392536004134f493d763AE61e7E5450950b';

    // contract.balanceOf(ownaddress).then(res => {
    //   console.log("owner balance:" + res);
    // });
    contract.balanceOf(address).then((res: any) => {
      console.log("balance:" + res);
    });
    // contract.totalSupply().then(res => {
    //   console.log("total:" + res);
    // });
    // contract.symbol().then(res => {
    //   console.log("name:" + res);
    // });
    // contract.name().then(res => {
    //   console.log("res:" + res);
    // });
    let gas = ethers.utils.bigNumberify("4100");
    // console.log(gas.toString());
    console.log(contract.functions);
    let overrideOptions = {
      gasLimit: 250000,
      gasPrice: 90000,
      nonce: 0
    };
    contract.transfer(address, gas, overrideOptions).then((res: any) => {

      contract.balanceOf(address).then((res: any) => {
        console.log("balance22222:" + res);
      });
      console.log('2222');
    }, (err: any) => {
      console.log('55');
      console.log(err);
    });
  }

  /**
   * 格式化Ether
   * @param balance 
   */
  frommatEther(balance: any) {
    return ethers.utils.formatEther(balance);
  }

  /**
   * 转化Ether
   * @param value 
   */
  parseEther(value: string) {
    return ethers.utils.parseEther(value);
  }

  /**
   * 计算账户金额
   * 币数乘以单价
   * @param balance 
   * @param price 
   */
  calAmount(balance: any, price: number) {
    let count = ethers.utils.bigNumberify(balance);
    let currencyPrice = ethers.utils.bigNumberify(Math.round(price * 100));
    return (count.mul(currencyPrice) / 100).toFixed(2).toString();
  }

  /**
   * 计算Gas金额
   * @param gwei 
   */
  calGas(gwei: number) {
    let wei = ethers.utils.bigNumberify(gwei).mul(1000000000);
    let gas = ethers.utils.bigNumberify(this.userGas);
    return ethers.utils.formatEther(wei.mul(gas));
  }

  /**
   * 序列化密码
   * @param password 
   */
  private normalizePassword(password: string): string {
    return ethers.utils.toUtf8Bytes(password.normalize('NFKC'));
  }
}
