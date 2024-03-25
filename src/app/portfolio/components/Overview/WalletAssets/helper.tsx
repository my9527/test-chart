import DexLogo from '@/app/assets/header/logo.svg'
import MetamaskLogo from '@/app/assets/header/metamask.svg'
import OkxLogo from '@/app/assets/portfolio/okx.svg'
import Button from '@/app/components/Button'
import FlexBox from '@/app/components/FlexBox'
import SimpleText from '@/app/components/SimpleText'
import Image from 'next/image'
import styled from 'styled-components'



const IconButton = styled.button`
  outline: none;
  background: unset;
  border: none;
  cursor: pointer;
`

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
    token: 'IOTX',
    amount: '123,123,123,00',
    value: '123,123,123.00 USD',
  },
  {
    token: 'IOTX',
    amount: '123,123,123,00',
    value: '123,123,123.00 USD',
  },
]


const TokenIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #D9D9D9;
`

export const columns = [
  {
    dataKey: 'token',
    title: 'Asset',
    width: '10%',
    render: (data: {[key: string]: any}) => {
      return (
        <FlexBox gap="8px" alignItems='center'>
          <TokenIcon />
          <SimpleText $color="primary1" $size='small'>{data.token}</SimpleText>
        </FlexBox>
      )
    }
  },
  {
    width: '10%',
    dataKey: 'amount',
    title: 'Amount',
  },
  {
    dataKey: 'value',
    title: 'Value',
  },
  {
    title: 'Action',
    align: 'right',
    render: () => {
      return (
        <FlexBox gap="20px" alignItems='center' justifyContent='flex-end'>
          <Button minWidth={85} padding="5px 10px" secondary>Deposit</Button>
          <Button minWidth={85} padding="5px 10px" secondary>Stake</Button>
          <Button minWidth={85} padding="5px 10px" secondary>Buy</Button>
          <IconButton>
            <Image width={25} height={25} src={MetamaskLogo} alt="" />
          </IconButton>
        </FlexBox>
      )
    }
  }
]