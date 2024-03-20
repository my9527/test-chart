import styled from "styled-components";
import ClaimableRebate from "../ClaimableRebate";
import ReferralCode from "../ReferralCode";
import { Sidebar } from "../Sidebar";
import { useState } from "react";
import { HistoryDrawer } from "./HistoryDrawer";

const Wrapper = styled.div`
  position: relative;
  grid-area: rebate-area;
  display: flex;
  gap: 10px;
`

export const RebateArea = () => {
  //visibility of history
  const [visible, setVisible] = useState(false)
  return (
    <Wrapper>
      <ClaimableRebate onClickHistory={() => setVisible(true)} />
      <ReferralCode />
      <HistoryDrawer 
        visible={visible} 
        onHide={() => setVisible(false)} 
      />
    </Wrapper>
  );
};
