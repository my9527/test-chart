import FlexBox from "@/app/components/FlexBox";
import { SearchInput } from "@/app/referral/components/SearchInput";
import { useState } from "react";
import styled from "styled-components";
import { columns, data } from "./helper";
import Table from "@/app/components/Table";
import { DurationSelect } from "./DurationSelect";

const Wrapper = styled.div`
  padding-top: 20px;
`

const Header = styled(FlexBox)`
  position: relative;
`

const StyledSearchInput = styled(SearchInput)`
  input {
    background: ${props => props.theme.colors.fill2};
  }
`

const TableWrapper = styled.div`
  background: ${props => props.theme.colors.fill2};
  padding: 0 20px;
  border-radius: 8px;
  margin-top: 15px;
  height: 650px;
`


const durationOptions = [
  {
    value: 'VOLUMN_24HOUR',
    label: '24H'
  },
  {
    value: 'VOLUMN_1D',
    label: '1D'
  },
  {
    value: 'VOLUMN_30D',
    label: '30D'
  },
  {
    value: 'VOLUMN_90D',
    label: '90D'
  }
]
const Leaderboard = () => {
  const [searchVal, setSearchVal] = useState<string>("");

  const [duration, setDuration] = useState(durationOptions[0]?.value);
  return (
    <Wrapper>
      <Header gap="20px" alignItems="center">
        <DurationSelect value={duration} onChange={setDuration} options={durationOptions} />
        <StyledSearchInput value={searchVal} onChange={setSearchVal} />
      </Header>
      <TableWrapper>
        <Table 
          headerCellHeight={52} 
          bodyCellHeight={54} 
          hasTdBorder 
          hasThBorder 
          data={data} 
          columns={columns}
        />
      </TableWrapper>
    </Wrapper>
  );
};
export default Leaderboard;
