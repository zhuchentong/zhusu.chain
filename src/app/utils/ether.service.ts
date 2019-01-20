import { Injectable } from '@angular/core'
import { CommonService } from 'app/utils/common.service'
import { ethers } from 'ethers'
import { contractConfig } from 'app/config/contract.config'
import { Provider } from 'ethers/providers'
import { LoggerService } from '@ngx-toolkit/logger'
import { IToken } from 'app/config/interface.config'
import { Store } from '@ngxs/store'
import { AddWalletAction } from 'app/store/action/wallet.action'
import { Wallet } from 'app/models/wallet.model'

@Injectable({
  providedIn: 'root'
})
export class EtherService {
  private jcoPrice = 0.52
  private userGas = 30000 // 单位gas
  private gaslimit: 250000
  private provider: Provider
  private contractInstance

  constructor(
    private commonService: CommonService,
    private store: Store,
    private logger: LoggerService
  ) {
    // v4中自动确定网络
    this.provider = new ethers.providers.JsonRpcProvider(contractConfig.network)
    // 实例化合约
    this.contractInstance = new ethers.Contract(
      contractConfig.contractAddress,
      contractConfig.contractAbi,
      this.provider
    )
  }

  /**
   * 使用钱包签名合约
   * @param wallet
   */
  public signWithWallet(wallet: ethers.Wallet): ethers.Contract {
    return this.contractInstance.connect(wallet.connect(this.provider))
  }

  /**
   * 执行合约事务
   * @param tran
   */
  public async transaction(tran) {
    const tx = await tran
    this.logger.log(tx.hash)
    await tx.wait()
  }

  /**
   * 获取实例化合约
   */
  public getContract() {
    return this.contractInstance
  }

  /**
   * 创建钱包
   * @param password
   */
  public async createWallet(password: string) {
    // 序列化密码
    password = this.normalizePassword(password)
    // 创建钱包
    const wallet = ethers.Wallet.createRandom()
    try {
      const encrypt = await wallet.encrypt(password)
      return {
        wallet,
        encrypt
      }
    } catch (ex) {
      this.logger.error(ex)
      throw Error('创建失败')
    }
  }

  /**
   * 导入私钥
   * @param privatekey
   * @param password
   */
  public importPrivateKey(privatekey: string, password: string) {
    return new Promise((resolve, reject) => {
      const wallet = new ethers.Wallet(privatekey, this.provider)
      // wallet.provider = provider;
      wallet.encrypt(password).then(
        function(json: any) {
          this.commonService.insertLocalStorage(
            wallet.address,
            json,
            '我的钱包' +
              (localStorage.length > 1 ? localStorage.length - 1 : '')
          )
          resolve(wallet.address)
        },
        (err: any) => {
          this.logger.error(reject(err))
        }
      )
    })
  }

  /**
   * 导入助记词
   * @param mnemonic
   * @param password
   */
  public async importMnemonic(mnemonic: string, password: string) {
    // 序列化密码
    password = this.normalizePassword(password)
    // 创建钱包
    const wallet = ethers.Wallet.fromMnemonic(mnemonic)
    try {
      const encrypt = await wallet.encrypt(password)
      return {
        wallet,
        encrypt
      }
    } catch (ex) {
      this.logger.error(ex)
      throw Error('创建失败')
    }
  }

  /**
   * 检查助记词
   * @param mnemonic
   */
  public checkMnemonic(mnemonic: string) {
    return ethers.utils.HDNode.isValidMnemonic(mnemonic)
  }

  /**
   * 导出钱包
   * @param address
   * @param password
   */
  public exportWallet(address: string, password: string) {
    const json = this.commonService.parseWalletJson(address).json
    // return ethers.Wallet.fromEncryptedWallet(json, password);
    return ethers.Wallet.fromEncryptedJson(json, password)
  }

  /**
   * 测试方法
   * @param address
   * @param password
   */
  public test(address: string, password: string) {
    const json = this.commonService.parseWalletJson(
      '0x4b3200e9650B1f34e3836247f335baf6981b9868'
    ).json
    this.logger.log(json)
    const jo =
      '{"address":"29872eb7414e91497f186477879c46264650ba31","crypto":{"cipher":"aes-128-ctr","ciphertext":"ded26727239b66bc30db2ead5d1409a6ce41cde584115b3183f9755da7317abe","cipherparams":{"iv":"69d9026b38afcb795bee93c82edea49a"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"1b4cc40895f639c22ccfa8f65334337ba95fee2e00109a9e3a7bf885dfc379c7"},"mac":"54fbd1667aae1fcdd6da4f569dabd8092a122faaf690c24bdd78978ebc3b0416"},"id":"1ae67bd3-96ad-4dd8-bc00-80af14d1a38c","version":3}'
    this.logger.log(JSON.parse(jo))
    // ethers.Wallet.fromEncryptedWallet(jo, password).then((res: any) => {
    ethers.Wallet.fromEncryptedJson(jo, password).then(
      (res: any) => {
        this.logger.log(res.privateKey)
      },
      () => {
        return
      }
    )
  }

  /**
   * 获取钱包余额
   * @param address
   */
  public async getEtherBalance(address: string) {
    const provider = new ethers.providers.EtherscanProvider()
    const balance = provider.getBalance(address)
    return balance
  }

  /**
   * 获取ETH对应的美元金额
   */
  public getEtherPrice() {
    const provider = new ethers.providers.EtherscanProvider()
    return new Promise((resolve, reject) => {
      provider.getEtherPrice().then(
        (res: any) => {
          resolve(res)
        },
        (err: any) => {
          this.logger.error(reject(err))
        }
      )
    })
  }

  /**
   * 获取账户相关ETH信息
   * @param address
   */
  public async getEthInfo(address: string) {
    const mainProvider = new ethers.providers.EtherscanProvider()
    // 获取余额
    const balanceOfWei = await this.provider.getBalance(address)
    const balance = Number(ethers.utils.formatEther(balanceOfWei))
    const price = await mainProvider.getEtherPrice()
    // bigNumber 不能和小数进行计算，所以要先将汇率变成整数
    // const rate = Math.round(price * 100);
    // const result = balanceOfWei.mul(rate).div(100);
    return {
      price,
      balance,
      amount: balance * price
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
  public getGasPrice() {
    const provider = new ethers.providers.EtherscanProvider()
    return new Promise((resolve, reject) => {
      provider.getGasPrice().then(
        (res: any) => {
          resolve(res)
        },
        (err: any) => {
          this.logger.error(reject(err))
        }
      )
    })
  }

  /**
   * 获取代币信息
   * @param address
   */
  public async getJcoInfo(address: string): Promise<IToken> {
    const price = this.jcoPrice
    const [token, balance] = await Promise.all([
      this.contractInstance.symbol(), // 获取Token名称
      this.contractInstance.balanceOf(address) // 获取Token余额
    ])

    return {
      balance,
      price,
      name: token,
      amount: balance.mul(price * 100).div(100)
    }
  }

  /**
   * 获取交易参数
   * @param gasPrice
   * @param toAddress
   * @param value
   * @param data
   */
  public getTransaction(
    gasPrice: string,
    toAddress: string,
    value: string,
    data: any
  ) {
    const transaction = {
      gasLimit: this.gaslimit,
      gasPrice: ethers.utils.bigNumberify(gasPrice)
      // to: toAddress,
      // data: "0x",
      // value: ethers.utils.parseEther(value)
    }
    return transaction
  }

  /**
   * 预估需要的Gas
   * @param password
   * @param transaction
   */
  public estimateGas(password: string, transaction: any) {
    // let transaction = {
    //   gasLimit: 1000000,
    //   to: "0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290",
    //   data: "0x",
    //   value: this.etherService.parseEther("1.0")
    // };
    // let json = this.commonService.getCurrentWalletJson();
    // return new Promise(function (resolve, reject) {
    //   // ethers.Wallet.fromEncryptedWallet(json, password).then((wallet: any) => {
    //   ethers.Wallet.fromEncryptedJson(json, password).then((wallet) => {
    //     wallet.connect(this.provider)

    //   }, (err: any) => {
    //     console.log(reject(err));
    //   })
    // });
    return this.provider.estimateGas(transaction)
  }

  /**
   * 发送ETH
   * @param toAddress
   * @param amount
   * @param password
   * @param remark
   */
  public sendETH(
    toAddress: string,
    amount: string,
    password: string,
    remark: string
  ) {
    const json = this.commonService.getCurrentWalletJson()
    return new Promise((resolve, reject) => {
      // ethers.Wallet.fromEncryptedWallet(json, password).then((wallet: any) => {
      ethers.Wallet.fromEncryptedJson(json, password).then(
        (wallet: any) => {
          wallet = wallet.connect(this.provider)
          let signature = '0x'
          if (typeof remark === 'string') {
            signature = wallet.signMessage(remark)
          }
          const transaction = {
            gasLimit: this.gaslimit,
            to: toAddress,
            data: signature,
            value: this.parseEther(amount)
          }
          this.logger.log('sendTh')
          this.logger.log(transaction)
          this.logger.log(amount)
          // resolve(wallet.sendTransaction(transaction));  //给contracts转
          resolve(wallet.send(toAddress, this.parseEther(amount)))
        },
        (err: any) => {
          this.logger.error(reject(err))
        }
      )
    })
  }

  /**
   * 发送交易
   * @param toAddress
   * @param amount
   * @param password
   * @param gasPrice
   * @param remark
   */
  public async sendTransaction(
    wallet: Wallet,
    toAddress: string,
    amount: string,
    password: string
    // gasPrice: string,
    // remark: string
  ) {
    try {
      this.logger.log(wallet, password, toAddress)
      const ehterWallet = await ethers.Wallet.fromEncryptedJson(
        wallet.data,
        this.normalizePassword('123123123')
      )
      this.logger.log(ehterWallet)
      const contract = this.signWithWallet(ehterWallet)
      const count = ethers.utils.bigNumberify(amount)
      return await contract.transfer(toAddress, count)
     
    } catch (ex) {
      this.logger.log(ex)
    }

    // const count = ethers.utils.bigNumberify(amount)
    // return new Promise((resolve, reject) => {
    //   // ethers.Wallet.fromEncryptedWallet(json, password).then((wallet: any) => {
    //  .then(
    //     async wallet => {
    //       wallet = wallet.connect(this.provider)
    //       let signature = '0x'
    //       if (typeof remark === 'string') {
    //         signature = await wallet.signMessage(remark)
    //       }
    //       const tx = this.getTransaction(gasPrice, toAddress, amount, signature)
    //       const contract = new ethers.Contract(
    //         contractConfig.contractAddress,
    //         contractConfig.contractAbi,
    //         wallet
    //       )
    //       contract.balanceOf(wallet.address).then(
    //         (balance: any) => {
    //           // 余额与gas的数量是否需要大于转账数量？
    //           if (balance.gt(count)) {
    //             resolve(contract.transfer(toAddress, count, tx))
    //           }
    //         },
    //         (err: any) => {
    //           reject(err)
    //         }
    //       )
    //     },
    //     (err: any) => {
    //       reject(err)
    //     }
    //   )
    // })
  }

  /**
   * 测试方法
   */
  public testSend() {
    // let wallet = new ethers.Wallet('0x127771ffc51c970d961228aefcc7d8ecfc5f78c8257d88cdb4fad54fdac29731');
    const wallet = new ethers.Wallet(
      '0x127771ffc51c970d961228aefcc7d8ecfc5f78c8257d88cdb4fad54fdac29731',
      this.provider
    )
    const contract = new ethers.Contract(
      contractConfig.contractAddress,
      contractConfig.contractAbi,
      wallet
    )
    // let ownaddress = '0x24B05248349Ef47083C4B54ea951D38373721FDF';
    const address = '0x4b3200e9650B1f34e3836247f335baf6981b9868' // '0x4AEc3392536004134f493d763AE61e7E5450950b';

    // contract.balanceOf(ownaddress).then(res => {
    //   console.log("owner balance:" + res);
    // });
    contract.balanceOf(address).then((res: any) => {
      this.logger.info('balance:' + res)
    })
    // contract.totalSupply().then(res => {
    //   console.log("total:" + res);
    // });
    // contract.symbol().then(res => {
    //   console.log("name:" + res);
    // });
    // contract.name().then(res => {
    //   console.log("res:" + res);
    // });
    const gas = ethers.utils.bigNumberify('4100')
    // console.log(gas.toString());
    this.logger.log(contract.functions)
    const overrideOptions = {
      gasLimit: 250000,
      gasPrice: 90000,
      nonce: 0
    }
    contract.transfer(address, gas, overrideOptions).then(
      (res: any) => {
        contract.balanceOf(address).then((balance: any) => {
          this.logger.log('balance22222:' + balance)
        })
        this.logger.log('2222')
      },
      (err: any) => {
        this.logger.error(err)
      }
    )
  }

  /**
   * 格式化Ether
   * @param balance
   */
  public frommatEther(balance: any) {
    return ethers.utils.formatEther(balance)
  }

  /**
   * 转化Ether
   * @param value
   */
  public parseEther(value: string) {
    return ethers.utils.parseEther(value)
  }

  /**
   * 计算账户金额
   * 币数乘以单价
   * @param balance
   * @param price
   */
  public calAmount(balance: any, price: number) {
    const count = ethers.utils.bigNumberify(balance)
    const currencyPrice = ethers.utils.bigNumberify(Math.round(price * 100))
    // return (count.mul(currencyPrice) / 100).toFixed(2).toString();
    return count
      .mul(currencyPrice)
      .div(100)
      .toNumber()
      .toFixed(2)
      .toString()
  }

  /**
   * 计算Gas金额
   * @param gwei
   */
  public calGas(gwei: number) {
    const wei = ethers.utils.bigNumberify(gwei).mul(1000000000)
    const gas = ethers.utils.bigNumberify(this.userGas)
    return ethers.utils.formatEther(wei.mul(gas))
  }

  /**
   * 序列化密码
   * @param password
   */
  private normalizePassword(password: string): string {
    return ethers.utils.toUtf8Bytes(password.normalize('NFKC')).toString()
  }

  /**
   *
   * @param password
   */
  private async getUserWallet(password): Promise<ethers.Wallet> {
    // 获取用户本地存储的钱包json
    const json = this.commonService.getCurrentWalletJson()
    const wallet = await ethers.Wallet.fromEncryptedJson(json, password)
    return wallet.connect(this.provider)
  }
}
