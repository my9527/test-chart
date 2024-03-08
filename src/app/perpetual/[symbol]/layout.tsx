"use client";
import Footer from "../../components/Footer";
import styled from "styled-components";

import { CmptMarketSocket } from "../components/SocketMarket";


const Wrapper = styled.div`
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.fill1};
  padding-bottom: 80px;
`;
const Content = styled.div`
  flex: 1;
`;
const PerpetualLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <CmptMarketSocket />
      <Content>{children}</Content>
      <Footer />
    </Wrapper>
  );
};
export default PerpetualLayout;
