import { motion } from "framer-motion";
import styled, { css } from "styled-components";

const Box = styled.button<{ width?: number, height?: number, padding?: number }>`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.primary1};
  border-radius: 2px;
  width: ${props => props.width || 14}px;
  height: ${props => props.height || 14}px;
  background: transparent;
  cursor: pointer;
  ${props => props.padding && css`
    padding: ${props.padding}px;
  `}
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
}
function Checkbox ({ checked, onChange, width, height, padding }: IProps) {
  const handleChange = () => {
    onChange(!checked)
  }
  const tickVariants = {
    checked: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.2,
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
    <Box onClick={handleChange} width={width} height={height} padding={padding}>
      <Indicator initial={"unchecked"} animate={checked ? "checked" : "unchecked"} variants={tickVariants} />
    </Box>
  )
}

export default Checkbox