import styled, { useTheme } from "styled-components";
import Table from "@/app/components/Table";

const Details = () => {
  const theme = useTheme()
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
      primary: true,
    },
    {
      dataKey: 'volume',
      title: "Volume",
    },
    {
      dataKey: 'date',
      title: "Invitation date",
      align: 'right',
      secondary: true,
    },
  ]
  return (
    <Table hasThBorder hasTdBorder data={data} columns={columns} />
  )
}

export default Details;