
import styled from 'styled-components'
import FlexBox from '@/app/components/FlexBox'
import Image from 'next/image'
import { useState } from 'react'
import { allWallets, assetsData, columns } from './helper'
import Table from '@/app/components/Table'


const Item = styled.div<{ $active: boolean }>`
  border-radius: 8px;
  background: ${props => props.theme.colors.fill3};
  padding: 10px 12px;
  cursor: pointer;
  border: 1px solid ${props =>props.$active ? props.theme.colors.primary1 : 'transparent'};
  display: flex;
  gap: 20px;
  align-items: center;

  img {
    opacity: ${props => props.$active ? 1 : .5};
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary1};
  }
`
const WalletAssets = () => {
  const [selectedWallet, setSelectedWallet] = useState<string>('exchangeWallet')

  
  return (
    <>
      <FlexBox gap="20px">
        {
          allWallets.map(i => (
            <Item 
              key={i.key} 
              $active={selectedWallet === i.key}
              onClick={() => setSelectedWallet(i.key)}
            >
              <Image width={24} src={i.icon} alt={i.title} />
              {i.title}
            </Item>
          ))
        }
      </FlexBox>
      <Table 
        data={assetsData} 
        columns={columns} 
        bodyCellHeight={67}
        headerCellHeight={54}
        hasTdBorder
        hasThBorder
      />
    </>
  );
};
export default WalletAssets;
