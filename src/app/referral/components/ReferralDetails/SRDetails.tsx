import styled from "styled-components";
import Table from "../Table";
import { Row } from "@/app/components/Row";

const PrimaryText = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.colors.primary1};
`
const SRDetails = () => {

  const data = [
    {
      account: '0x12·····1234',
      rebate: '123,123.00 USD',
      volume: '123,123.00 USD',
      total: 1123,
      active: 1123,
    }
  ]
  const columns = [
    {
      dataKey: 'account',
      title: 'Friend',
    },
    {
      dataKey: 'rebate',
      title: "SR friends' rebate",
      render: (row: {[key: string]: any}) => <PrimaryText>{row.rebate}</PrimaryText>
    },
    {
      dataKey: 'volume',
      title: "SR friends' volume",
    },
    {
      dataKey: 'total',
      title: "Total friends",
    },
    {
      dataKey: 'active',
      title: "Active friends",
    }
  ]
  return (
    <Table data={data} columns={columns} />
  )
}

export default SRDetails;