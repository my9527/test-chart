
import styled, { css } from 'styled-components'
import Box from '@/app/components/Box'
import SimpleText from '@/app/components/SimpleText'
import Divider from '@/app/components/Divider'
import { useCallback } from 'react'
import FlexBox from '@/app/components/FlexBox'


const Wrapper = styled(Box)`
  padding: 0 35px;
`

const Item = styled(FlexBox)`
  width: 20%;
  border-right: 1px solid ${props => props.theme.colors.border1};
  &:last-child {
    border-right: none;
  }
`

const RowContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 20px 0;
`

const Text = styled.div<{ primary?: boolean, secondary?: boolean }>`
  font-weight: bold;
  font-size: ${props => props.theme.fontSize.header0};
  color: ${props => props.primary ? props.theme.colors.primary1 : (props.secondary ? props.theme.colors.text4 : props.theme.colors.text1)};
`

const Statistics = () => {
  const firstRowData = [
    {
      key: 'total-volumn',
      title: 'Total Volumn',
      value: '124',
      //render primary text color
      primary: true,
    },
    {
      key: 'total-fees',
      title: 'Total Fees',
      value: '124',
      primary: true,
    },
    {
      key: '24h-volumn',
      title: '24H Volumn',
      value: '123,234,234',
    },
    {
      key: '24h-trades',
      title: '24H Trades',
      value: '124,123,12',
    },
    {
      key: 'token-price',
      title: 'QLP Price',
      value: '124,123,12',
      secondary: true,
    }
  ]

  const secondRowData = [
    {
      key: 'total-trades',
      title: 'Total Trades',
      value: '124',
      primary: true,
    },
    {
      key: 'total-users',
      title: 'Total Users',
      value: '124',
      primary: true,
    },
    {
      key: '24h-fees',
      title: '24H Fees',
      value: '124',
    },
    {
      key: 'token-amount',
      title: 'QLP Amount',
      value: '124',
      secondary: true,
    },
    {
      key: 'token-locked',
      title: 'Locked QLP',
      value: '124',
      secondary: true,
    }
  ]


  const renderItem = useCallback((item: any) => {
    return (
      <Item direction='column' alignItems='center' gap="5px" key={item.key}>
        <SimpleText $color="text4" $size="small">{item.title}</SimpleText>
        <Text primary={item.primary} secondary={item.secondary}>{item.value}</Text>
      </Item>
    )
  }, [])
  
  return (
    <Wrapper>
      <RowContainer>
        { firstRowData.map(renderItem) }
      </RowContainer>
      <Divider dir="horizontal" />
      <RowContainer>
        { secondRowData.map(renderItem) }
      </RowContainer>
    </Wrapper>
  );
};
export default Statistics;
