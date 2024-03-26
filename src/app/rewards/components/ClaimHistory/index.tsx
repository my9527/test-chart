import Box from "@/app/components/Box";
import SimpleText from "@/app/components/SimpleText";
import Table from "@/app/components/Table";
import styled from "styled-components";

const Wrapper = styled(Box)`
  width: 570px;
  padding: 0 20px;
`

const Title = styled.div`
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.medium};
  padding: 18px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border1};
`



const ClaimHistory = () => {
  const data = [
    {
      date: '2024.10.21 22:00:00',
      tokenClaimed: '123,123,123.00',
      coinClaimed: '123,123,123.00',
    }
  ]

  const columns = [
    {
      dataKey: 'date',
      title: 'Date',
      secondary: true,
    },
    {
      dataKey: 'tokenClaimed',
      title: 'dQUTA Claimed',
    },
    {
      dataKey: 'coinClaimed',
      title: 'dIOTX Claimed',
      primary: true,
    }
  ]
  return (
    <Wrapper>
      <Title>Claim History</Title>
      <Table  
        data={data}
        columns={columns}
        hasTdBorder
        hasThBorder
        bodyCellHeight={54}
        headerCellHeight={54}
      />
    </Wrapper>
  )
}

export default ClaimHistory