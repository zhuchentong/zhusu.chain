export enum STOEnum {
  // currentAddress = "currentAddress",
  currentCurrency = 'currentCurrency'
}

export enum CurrencyEnum {
  CNY = '人民币',
  USD = '美元'
}

export enum TokenEnum {
  ETH = 'ETH',
  JCO = 'JCO'
}

export enum HotelEnum {
  HOME = 'HOMESTAY',
  HOTEL = 'HOTEL'
}

export enum OrderStateEnum {
  // 未支付
  CREATED = 'CREATED',
  // 支付超时
  CLOSE = 'CLOSE',
  // 已支付
  PAID = 'PAID',
  // 待入住
  CONFIRMED = 'CONFIRMED',
  // 已入住
  CHECKIN = 'CHECKIN',
  // 已结束
  CHECKOUT = 'CHECKOUT',
  // 已取消
  CANCELED = 'CANCELED'
}
