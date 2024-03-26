import Box from "@/app/components/Box";
import FlexBox from "@/app/components/FlexBox";
import SimpleText from "@/app/components/SimpleText";
import Image from "next/image";
import styled from "styled-components";

const Title = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.header2};
`

interface RewardsProps {
  title: string;
  claimable: string;
  earned: string;
  icon?: string
}
const Rewards = ({
  title,
  claimable,
  earned,
  icon
}: RewardsProps) => {
  return (
    <FlexBox direction="column" justifyContent="space-between" gap="50px">
      <FlexBox gap="10px">
        { icon ? <Image src={icon} alt="" /> : null}
        <Title>{title}</Title>
      </FlexBox>
      <FlexBox gap="30px">
        <FlexBox direction="column">
          <SimpleText $color="text4" $size="small">Claimable</SimpleText>
          <SimpleText $color="text1" $size="medium">{claimable}</SimpleText>
        </FlexBox>
        <FlexBox direction="column">
          <SimpleText $color="text4" $size="small">Claimed / Total earned</SimpleText>
          <SimpleText $color="text1" $size="medium">{earned}</SimpleText>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default Rewards;