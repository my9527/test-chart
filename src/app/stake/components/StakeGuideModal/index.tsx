import Modal from "@/app/components/Modal"
import SimpleText from "@/app/components/SimpleText";
import Checkbox from "@/app/referral/components/Checkbox";
import { useState } from "react";
import styled from "styled-components";
import Stepper from "../Stepper";
import { Deposit } from "./Deposit";
import { Buy } from "./Buy";
import { Claim } from "./Claim";
import { Stake } from "./Stake";
import HideIcon from '@/app/assets/stake/hide-modal.svg'
import Image from "next/image";

const StyledModal = styled(Modal)`
  color: ${props => props.theme.colors.text1};
  & > div {
    background: ${props => props.theme.colors.fill1};
    border: 1px solid ${props => props.theme.colors.text1};
    padding: 30px 50px 60px 30px;
    position: relative;
  }
`
const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  left: 30px;
  bottom: 60px;
`

const HideBtn = styled.div`
  position: absolute;
  right: 0;
  top: 0; 
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: ${props => props.theme.fontSize.min};
  cursor: pointer;
`

interface StakeGuideModalProps {
  visible: boolean;
  onClose?: () => void;
}
const StakeGuideModal = ({ visible, onClose }: StakeGuideModalProps) => {
  const [checked, setChecked] = useState(false)
  const [curStep, setCurStep] = useState(0)

  const steps = [
    {
      title: 'Deposit USDQ',
      children: <Deposit />
    },
    {
      title: 'Buy QLP',
      children: <Buy />
    },
    {
      title: 'Wait and claim your QLP',
      children: <Claim />
    },
    {
      title: 'Stake your QLP',
      children: <Stake />
    }
  ]
  return (
    <StyledModal 
      visible={visible}
      showFooter={false}
      showHeader={false}
      overlayColor="rgba(0, 0, 0, 0.50);"
      width={510}
      height={612}
    >
      <HideBtn onClick={onClose}>
        Hide
        <div>
          <Image src={HideIcon} alt="" />
          <Image src={HideIcon} alt="" />
        </div>
      </HideBtn>
      <Stepper 
        steps={steps}
        step={curStep}
        onStepChange={setCurStep}
      />
      <StyledCheckbox 
        checked={checked} 
        onChange={setChecked} 
        label={<SimpleText $color="text4" $size="medium">Don’t show this again.</SimpleText>}
      />
    </StyledModal>
  )
}
export default StakeGuideModal