import Image from "next/image";
import { ReactNode } from "react";
import styled from "styled-components";
import ActiveStepIcon from '@/app/assets/stake/step-active.svg'
import InActiveStepIcon from '@/app/assets/stake/step-inactive.svg'
import Collapse from "@/app/components/Collapse";

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
`

const Navigator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 10px;
`
const StyledImage = styled(Image)`
  cursor: pointer;
`

const Content = styled.div`
  flex-grow: 1;
`

interface IStepperProps {
  steps: { title: string, children: ReactNode }[];
  step: number;
  onStepChange: (step: number) => void;
  className?: string;
}
const Stepper = ({ steps, onStepChange, step, className }: IStepperProps) => {


  const handleNavigate = (val: number) => () => {
    onStepChange(val);
  }
  return (
    <Wrapper className={className}>
      <Content>
        {
          steps.map((i, ind) => (
            <Collapse 
              key={ind}
              header={`${ind + 1}. ${i.title}`}
              active={step === ind}
              disabled={!(step === ind)}
              hideDivider={ind === steps.length - 1}
            >
              {i.children}
            </Collapse>
          )
        )}
      </Content>
      <Navigator>
        {
          steps.map((i, ind) => (
            <StyledImage 
              onClick={handleNavigate(ind)} 
              key={ind} src={ind > step ? InActiveStepIcon : ActiveStepIcon} 
              alt="" 
            />
          )
        )}
      </Navigator>
    </Wrapper>
  )
}

export default Stepper