import { Injectable } from '@angular/core'
import { CommonService } from 'app/utils/common.service'
import { ethers, Contract } from 'ethers'
import { contractConfig } from 'app/config/contract.config'
import { Provider } from 'ethers/providers'
import { LoggerService } from '@ngx-toolkit/logger'
import { IToken } from 'app/config/interface.config'
import { Wallet } from 'app/models/wallet.model'
import { IContract } from 'app/config/contract/contract.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EtherService {
  private jcoPrice = 0.52
  private provider: Provider
  private contractInstance
  private contractOwner
  private userGas = 30000 // 单位gas
  private gaslimit: 250000 // gas限制

  constructor(
    private commonService: CommonService,
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
    // 获取合约拥有者
    this.contractInstance
      .owner()
      .then(address => (this.contractOwner = address))
  }

  /**
   * 执行合约
   */
  public transaction(): Observable<Transaction> {
    return Observable.create(observer => {
      observer.next({
        contract: this.contractInstance,
        result: []
      })
    })
  }

  /**
   * 签名钱包
   * @param wallet
   */
  public signWallet(wallet: Wallet) {
    return <T>(source: Observable<T>) =>
      new Observable<T>(observer => {
        return source.subscribe({
          next: (tx: any) => {
            this.commonService
              .showPromptAlert('请输入密码', 'password', 'password')
              .then(async ([{ password }]) => {
                const loading = await this.commonService.loading(
                  '验证签名中,请稍后...'
                )
                // 获取以太坊钱包
                ethers.Wallet.fromEncryptedJson(
                  wallet.data,
                  this.normalizePassword(password)
                )
                  .then(ehterWallet => {
                    // 设置钱包provider
                    ehterWallet = ehterWallet.connect(this.provider)
                    // 设置合约钱包
                    const contract = this.contractInstance.connect(ehterWallet)
                    // 添加签名后的合约
                    tx.contract = contract
                    // 添加签名的钱包
                    tx.wallet = ehterWallet
                    observer.next(tx)
                  })
                  .catch(err => {
                    observer.error(err)
                  })
                  .finally(() => loading.dismiss())
              })
          },
          error(err) {
            observer.error(err)
          },
          complete() {
            observer.complete()
          }
        })
      })
  }

  /**
   * 执行call方法
   */
  public call(transaction: (contract: IContract) => Promise<any>) {
    return <T>(source: Observable<Transaction>) =>
      new Observable<Transaction>(observer => {
        return source.subscribe({
          next: async (tx: Transaction) => {
            // 调用合约
            const loading = await this.commonService.loading('执行中,请稍候...')
            transaction(tx.contract as IContract)
              .then(data => {
                tx.result.push(data)
                observer.next(tx)
              })
              .catch(err => {
                observer.error(err)
              })
              .finally(() => loading.dismiss())
          },
          error(err) {
            observer.error(err)
          },
          complete() {
            observer.complete()
          }
        })
      })
  }

  /**
   * 执行send方法
   * TODO:
   * 验证SIGN,估算GAS
   */
  public send(transaction: (contract: IContract) => Promise<any>) {
    return <T>(source: Observable<Transaction>) =>
      new Observable<Transaction>(observer => {
        return source.subscribe({
          next: async (tx: Transaction) => {
            const loading = await this.commonService.loading('执行中,请稍候...')
            transaction(tx.contract as IContract)
              .then(data => {
                tx.result.push(data)
                observer.next(tx)
              })
              .catch(err => {
                observer.error(err)
              })
              .finally(() => loading.dismiss())
          },
          error(err) {
            observer.error(err)
          },
          complete() {
            observer.complete()
          }
        })
      })
  }

  /**
   * ETH交易
   */
  public transfer(address: string, amount: string) {
    return <T>(source: Observable<Transaction>) =>
      new Observable<Transaction>(observer => {
        return source.subscribe({
          next: async (tx: Transaction) => {
            const loading = await this.commonService.loading('执行中,请稍候...')
            tx.wallet
              .sendTransaction({
                to: address,
                value: ethers.utils.parseEther(amount)
              })
              .then(data => {
                tx.result.push(data)
                observer.next(tx)
              })
              .finally(() => loading.dismiss())
          },
          error(err) {
            observer.error(err)
          },
          complete() {
            observer.complete()
          }
        })
      })
  }

  /**
   * Token转账交易
   * @param wallet
   * @param address
   * @param amount
   */
  public sendToken(wallet: Wallet, address: string, amount: string | number) {
    return this.transaction().pipe(
      this.signWallet(wallet),
      this.send(contract =>
        contract.transfer(address, ethers.utils.bigNumberify(amount))
      )
    )
  }

  /**
   * ETH转账交易
   * @param wallet
   * @param address
   * @param amount
   */
  public sendETH(wallet: Wallet, address: string, amount: number) {
    return this.transaction().pipe(
      this.signWallet(wallet),
      this.transfer(address, amount.toString())
    )
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
    // 从localstorage获取钱包数据
    // const json = this.commonService.parseWalletJson(address).json
    // return ethers.Wallet.fromEncryptedWallet(json, password);
    // return ethers.Wallet.fromEncryptedJson(json, password)
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
    // 获取主网ETH价格
    const price = await mainProvider.getEtherPrice()
    // bigNumber 不能和小数进行计算，所以要先将汇率变成整数
    return {
      address,
      price,
      balance,
      amount: balance * price
    }
  }

  /**
   * 获取代币信息
   * @param address
   */
  public async getTokenInfo(address: string): Promise<IToken> {
    const price = this.jcoPrice
    const [token, balance] = await Promise.all([
      this.contractInstance.symbol(), // 获取Token名称
      this.contractInstance.balanceOf(address) // 获取Token余额
    ])

    return {
      address,
      balance,
      price,
      name: token,
      amount: balance.mul(price * 100).div(100)
    }
  }

  /**
   * 获取合约拥有者
   */
  public async getContractOwner() {
    if (!this.contractOwner) {
      const address = await this.contractInstance.owner()
      this.contractOwner = address
    }

    return this.contractOwner
  }

  /**
   * 预估需要的Gas
   * @param password
   * @param transaction
   */
  private estimateGas(password: string, transaction: any) {
    return this.provider.estimateGas(transaction)
  }

  /**
   * 格式化Ether
   * @param balance
   */
  private frommatEther(balance: any) {
    return ethers.utils.formatEther(balance)
  }

  /**
   * 转化Ether
   * @param value
   */
  private parseEther(value: string) {
    return ethers.utils.parseEther(value)
  }

  /**
   * 计算账户金额
   * 币数乘以单价
   * @param balance
   * @param price
   */
  private calAmount(balance: any, price: number) {
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
  private calGas(gwei: number) {
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
   * 获取实例化合约
   */
  private getContract() {
    return this.contractInstance as IContract
  }
}

class Transaction {
  public wallet?: ethers.Wallet
  public contract: Contract | IContract
  public result?: any[]
}
