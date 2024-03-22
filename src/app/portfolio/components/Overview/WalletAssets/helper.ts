import DexLogo from '@/app/assets/header/logo.svg'
import MetamaskLogo from '@/app/assets/header/metamask.svg'
import OkxLogo from '@/app/assets/portfolio/okx.svg'

export const allWallets = [
  {
    key: 'exchangeWallet',
    title: 'Quenta Wallet',
    icon: DexLogo,
  },
  {
    key: 'metamask',
    title: 'Metamask',
    icon: MetamaskLogo,
  },
  {
    key: 'okx',
    title: 'OKX Wallet',
    icon: OkxLogo,
  }
]


export const assetsData = [
  {
    assetSymbol: 'IOTX',
    amount: '123,123,123,00',
    value: '123,123,123.00 USD',
  },
  {
    assetSymbol: 'IOTX',
    amount: '123,123,123,00',
    value: '123,123,123.00 USD',
  },
]

export const columns = [
  {
    dataKey: 'assetSymbol',
    title: 'Asset',
  },
  {
    dataKey: 'amount',
    title: 'Amount',
  },
  {
    dataKey: 'value',
    title: 'Value',
  },
  {
    title: 'Action',
  }
]