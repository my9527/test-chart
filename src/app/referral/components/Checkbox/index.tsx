import { motion } from "framer-motion";
import { ReactNode } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  cursor: pointer;
`

const Box = styled.button<{ width?: number, height?: number, padding?: number }>`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.primary1};
  border-radius: 2px;
  width: ${props => props.width || 14}px;
  height: ${props => props.height || 14}px;
  background: transparent;
  cursor: pointer;
  padding: ${props => props.padding || 2}px;
`

const Indicator = styled(motion.div)`
  background: ${({ theme }) => theme.colors.primary3};
  width: 100%;
  height: 100%;
`

interface IProps {
  checked: boolean;
  onChange: (checked: boolean) => void
  width?: number;
  height?: number;
  padding?: number;
  label?: ReactNode;
  className?: string;
}
function Checkbox ({ checked, onChange, width, height, padding, label, className }: IProps) {
  const handleChange = () => {
    onChange(!checked)
  }
  const tickVariants = {
    checked: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    unchecked: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }
  return (
    <Wrapper className={className} onClick={handleChange}>
      <Box width={width} height={height} padding={padding}>
        <Indicator initial={"unchecked"} animate={checked ? "checked" : "unchecked"} variants={tickVariants} />
      </Box>
      { label }
    </Wrapper>
   
  )
}

export default Checkbox