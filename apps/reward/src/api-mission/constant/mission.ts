import { DELIVERY_METHOD, WALLET } from '@lib/mission'

export const TransformWalletMethod = {
  DIRECT_CASHBACK: {
    wallet: WALLET.CASHBACK,
    deliveryMethod: DELIVERY_METHOD.AUTO,
  },
  DIRECT_BALANCE: {
    wallet: WALLET.BALANCE,
    deliveryMethod: DELIVERY_METHOD.AUTO,
  },
  REWARD_CASHBACK: {
    wallet: WALLET.CASHBACK,
    deliveryMethod: DELIVERY_METHOD.MANUAL,
  },
  REWARD_BALANCE: {
    wallet: WALLET.BALANCE,
    deliveryMethod: DELIVERY_METHOD.MANUAL,
  },
  DIRECT_REWARD: {
    wallet: WALLET.REWARD,
    deliveryMethod: DELIVERY_METHOD.AUTO,
  },
}
