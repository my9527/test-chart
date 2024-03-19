import styled from "styled-components";
import Table from "../Table";


const PrimaryText = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.colors.primary1};
`
const Details = () => {

  const data = [
    {
      account: '0x12·····1234',
      rebate: '123,123.00 USD',
      volume: '123,123.00 USD',
      date: '2024/02/07',
    }
  ]
  const columns = [
    {
      dataKey: 'account',
      title: 'Friend',
    },
    {
      dataKey: 'rebate',
      title: "Contributed rebate",
      render: (row: {[key: string]: any}) => <PrimaryText>{row.rebate}</PrimaryText>
    },
    {
      dataKey: 'volume',
      title: "Volume",
    },
    {
      dataKey: 'date',
      title: "Invitation date",
    },
  ]
  return (
    <Table data={data} columns={columns} />
  )
}

export default Details;