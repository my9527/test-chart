import styled from "styled-components";
import Table from "@/app/components/Table";


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
      primary: true,
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
      secondary: true,
    }
  ]
  return (
    <Table data={data} columns={columns} />
  )
}

export default SRDetails;