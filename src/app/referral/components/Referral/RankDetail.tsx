import styled from "styled-components"
import { Sidebar } from "../Sidebar"
import { useState } from "react"
import Table from "../../../components/Table"

const Wrapper = styled.div`
  width: 470px;
  padding-top: 18px;
`

const Title = styled.h3`
  font-size: ${props => props.theme.fontSize.header0};
  color: ${props => props.theme.colors.primary1};
  line-height: 20px;
  margin-bottom: 18px;
`

interface IRankDetailProps {
  visible: boolean,
  onHide: () => void,
}
export const RankDetail = ({
  visible,
  onHide,
}: IRankDetailProps) => {
  const [searchText, setSearchText] = useState("")
  const [tab, setTab] = useState("lastWeek")

  const data = [
    {
      rank: 0,
      active: '<10',
      total: '10%',
    }
  ]

  const columns = [
    {
      dataKey: 'rank',
      title: 'Rank',
      width: '10%',
      align: 'center',
      secondary: true
    },
    {
      dataKey: 'active',
      title: 'Active Friends Referred',
      align: 'center',
      secondary: true,
      headerPrimary: true,
    },
    {
      dataKey: 'total',
      title: 'Total Rebate Ratio',
      align: 'center',
      secondary: true,
      headerPrimary: true,
    },
  ]
  return (
    <Sidebar visible={visible} onHide={onHide}>
      <Wrapper>
        <Title>Rank Details</Title>
        <Table 
          hasTdBorder
          hasThBorder
          data={data} 
          columns={columns} 
        />
      </Wrapper>
    </Sidebar>
  )
}