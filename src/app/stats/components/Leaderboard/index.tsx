import FlexBox from "@/app/components/FlexBox";
import { SearchInput } from "@/app/referral/components/SearchInput";
import { useState } from "react";
import styled from "styled-components";
import { columns, data } from "./helper";
import Table from "@/app/components/Table";

const Wrapper = styled.div`
  padding-top: 20px;
`

const Leaderboard = () => {
  const [searchVal, setSearchVal] = useState<string>("");
  return (
    <Wrapper>
      <FlexBox gap="20px">
        <span>selector</span>
        <SearchInput value={searchVal} onChange={setSearchVal} />
      </FlexBox>
      <Table data={data} columns={columns} />
    </Wrapper>
  );
};
export default Leaderboard;
