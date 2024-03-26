import styled from "styled-components";
import Rewards from "../Rewards";
import Box from "@/app/components/Box";
import FlexBox from "@/app/components/FlexBox";
import Divider from "@/app/components/Divider";
import LinearGradientButton from "@/app/components/LinearGradientButton";

const Wrapper = styled(Box)`
  padding: 20px 20px 0;
  width: 100%;
  background-color: ${props => props.theme.colors.fill2};
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(124, 103, 255, 0.10) 0%, rgba(27, 27, 33, 0.00) 77%);
  }
`


const Footer = styled(FlexBox)`
  margin-top: 98px;
  border-top: 1px solid ${props => props.theme.colors.border1};
  height: 77px;
`


const Inner = styled.div`
  position: relative;
  z-index: 1;
`
const StakingRewards = () => {
  return (
    <Wrapper>
      <Inner>
        <FlexBox gap="50px">
          <Rewards 
            title="QUTA Rewards"
            claimable="123,123,123.00"
            earned="123,123,123.00 / 123,123,123.00"
          />
          <Divider height={100} />
          <Rewards 
            title="QUTA Rewards"
            claimable="123,123,123.00"
            earned="123,123,123.00 / 123,123,123.00"
          />
        </FlexBox>
        <Footer alignItems="center" gap="20px">
          <LinearGradientButton>Claim Rewards</LinearGradientButton>
          <LinearGradientButton minWidth={100}>Stake</LinearGradientButton>
        </Footer>
      </Inner>
    </Wrapper>
  )
}

export default StakingRewards