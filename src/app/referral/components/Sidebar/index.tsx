import { useCallback, useRef, forwardRef } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components";
import { motion, Variants } from 'framer-motion'
import ArrowIcon from '@/app/assets/referral/arrow-left.svg'
import Image from "next/image";

const Wrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.50);
  color: #fff;
  padding: 0 10px;
  z-index: 1000;
  left: 0;
  top: 0;
`;

const Title = styled.div`
  padding: 10px 0;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  font-size: ${(props) => props.theme.fontSize.medium};
  display: flex;
  gap: 10px;
  align-items: center;
`

const Content = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding: 0 19px;
  background-color: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
`

const Close = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
`

const CloseBtn = styled.div`
  height: 100px;
  width: 4px;
  background-color: ${(props) => props.theme.colors.primary1};
  ${Close}:hover && {
    box-shadow: -4px 0 4px ${props => props.theme.colors.primary2};
  }
`

interface ISidebarProps {
  visible: boolean,
  onHide: () => void,
  title?: React.ReactNode,
  children?: React.ReactNode,
}

export const Sidebar = ({
  visible = false,
  children,
  onHide,
  title,
}: ISidebarProps) => {

  const handleClose = useCallback(() => {
    onHide()
  }, [onHide])


  const variants: Variants = {
    open:  {
      transform: `translateX(0)`,
      opacity: 1,
    },
    closed: {
      transform: `translateX(-100%)`,
      opacity: 1,
    }
  };
  
 
  return visible ? (
    <Wrapper 
      // initial="closed"
      // animate={visible ? "open" : "closed"} 
      // transition={{ duration: 0.2 }} 
      // variants={variants} 
    >
      <Content>
        { title ? <Title>{title}</Title> : null}
        {children}
      </Content>
      <Close onClick={handleClose}>
        <Image src={ArrowIcon} alt="" />
        <CloseBtn />
      </Close>
    </Wrapper>
  ) : null
} 
 