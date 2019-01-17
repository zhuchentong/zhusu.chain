import { contractAbi } from 'app/config/contract/contract.abi'
import { environment } from '../../environments/environment'
export const contractConfig = {
  // 合约abi
  contractAbi,
  // 合约地址
  // 0xe4eb565621c284fc9df052254a8b754bf1d8dc4c
  contractAddress: '0xdf1Ec4Bd0D836c44b2870a282f07Abb4bDDe3631',
  // 网络地址
  network: environment.contract.network
}
