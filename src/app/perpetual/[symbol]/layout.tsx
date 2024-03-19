"use client";
import Footer from "../components/Footer";
import styled from "styled-components";

import { CmptMarketSocket } from "../components/SocketMarket";
import { OpenInterestsEffects } from "../components/OpenInterestsEffects";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { recoilPerpetualToken } from "@/app/models";

const Wrapper = styled.div`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.border1};
  padding-bottom: 40px;
`;
const Content = styled.div`
  flex: 1;
 
  .react-draggable-transparent-selection {
    user-select: none;
  }

  .react-resizable-handle {
    transition: all 0.3s ease-in-out;
    &::after {
      border-right: 2px solid rgba(255, 255, 255, 0.45) !important;
      border-bottom: 2px solid rgba(255, 255, 255, 0.45) !important;
    }
    &:hover {
      opacity: 0.6;
    }
  }

  .react-resizable {
    background: ${(props) => props.theme.colors.fill1};
  }
`;
const PerpetualLayout = ({ children }: { children: React.ReactNode }) => {

  const params = useParams<{ symbol: string }>();
  const updateSymbol = useSetRecoilState(recoilPerpetualToken);

  useEffect(() => {
    updateSymbol(params.symbol);
  }, [params.symbol]);


  return (
    <Wrapper>
      <CmptMarketSocket />
      <OpenInterestsEffects />
      <Content>{children}</Content>
      <Footer />
    </Wrapper>
  );
};
export default PerpetualLayout;
