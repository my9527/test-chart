import styled, { useTheme } from "styled-components"
import { Sidebar } from "../Sidebar"
import { SearchInput } from "../SearchInput"
import { useState } from "react"
import Tabs from "@/app/components/Tabs"
import Table from "../../../components/Table"

const Wrapper = styled.div`
  position: relative;
  width: 474px;
`

interface IHistoryDrawerProps {
  visible: boolean,
  onHide: () => void,
}
export const HistoryDrawer = ({
  visible,
  onHide,
}: IHistoryDrawerProps) => {
  const [searchText, setSearchText] = useState("")
  const [tab, setTab] = useState("lastWeek")
  const theme = useTheme()

  const data = [
    {
      friend: 'Ox12....1234',
      rebate: '123,123.00 USD',
    }
  ]

  const columns = [
    {
      dataKey: 'friend',
      title: 'Friend',
    },
    {
      dataKey: 'rebate',
      title: 'Rebate',
      primary: true,
      align: 'right',
    },
  ]

  const renderTable = () => {
    return (
      <Table 
        data={data} 
        columns={columns} 
        headerCellHeight={34} 
        bodyCellHeight={34} 
        hasThBorder
        hasTdBorder
        headerFontSize={theme.fontSize.medium}
      />
    )
  }
  return (
    <Sidebar visible={visible} onHide={onHide}>
      <Wrapper>
        <Tabs 
          tab={tab}
          onTabChange={setTab}
          tabs={[
            {
              key: "lastWeek",
              title: "Last Week",
              children: renderTable(),
            },
            {
              key: "lastMonth",
              title: "Last Month",
              children: renderTable(),
            }
          ]}
        />
        <SearchInput value={searchText} onChange={setSearchText} />
      </Wrapper>
    </Sidebar>
  )
}