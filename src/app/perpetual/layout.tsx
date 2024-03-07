"use client";
import Footer from "../components/Footer";
import styled from "styled-components";

const Wrapper = styled.div`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Content = styled.div`
  flex: 1;
`;
const PerpetualLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <Content>{children}</Content>
      <Footer />
    </Wrapper>
  );
};
export default PerpetualLayout;
