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
    value: 0,
    label: '24H'
  },
  {
    value: 1,
    label: '1D'
  },
  {
    value: 2,
    label: '30D'
  },
  {
    value: 3,
    label: '90D'
  }
]
const Leaderboard = () => {
  const [searchVal, setSearchVal] = useState<string>("");

  const [duration, setDuration] = useState<number>(durationOptions[0]?.value);
  return (
    <Wrapper>
      <Header gap="20px">
        <DurationSelect value={duration} onChange={setDuration} options={durationOptions} />
        <StyledSearchInput value={searchVal} onChange={setSearchVal} />
      </Header>
      <TableWrapper>
        <Table hasTdBorder hasThBorder data={data} columns={columns} />
      </TableWrapper>
    </Wrapper>
  );
};
export default Leaderboard;
