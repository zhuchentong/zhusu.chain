import { Dayjs } from 'dayjs'

export interface ILatLng {
  latitude: number
  longitude: number
}

export interface IDateRange {
  start: string
  end: string
}

export interface IToken {
  name?: string
  balance
  amount
  price
}

export interface ITransferParams {
  address
  amount
  password
  remark
  gasPrice?
}
