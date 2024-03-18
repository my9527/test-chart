import { useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components";
import { motion, Variants } from 'framer-motion'
import ArrowIcon from '@/assets/referral/arrow.svg'
import Image from "next/image";

const Wrapper = styled(motion.div)`
  position: fixed;
  height: 100%;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.50);
  color: #fff;
  padding: 0 10px;
  z-index: 1000;
  box-sizing: content-box;
  left: 0;
`;

const Title = styled.div`
  padding: 10px 0;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  font-size: ${(props) => props.theme.fontSize.medium};
  display: flex;
  gap: 10px;
  align-items: center;
`

const CloseBtn = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  background-color: ${(props) => props.theme.colors.primary1};
`

interface ISidebarProps {
  visible: boolean,
  onHide: () => void,
  width?: number,
  title?: React.ReactNode,
}

export const Sidebar: FCC<ISidebarProps> = ({
  visible = false,
  children,
  onHide,
  width = 320,
  title,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onHide()
  }, [onHide])


  const variants: Variants = {
    open:  {
      transform: `translateX(0)`,
      opacity: 1,
    },
    closed: {
      transform: `translateX(0)`,
      opacity: 1,
    }
  };
  
 
  return createPortal(
    <Wrapper 
      initial="closed"
      animate={visible ? "open" : "closed"} 
      transition={{ duration: 0.2 }} 
      variants={variants} 
      ref={ref}
      style={{ width: `${width}px`}}
    >
      { title ? <Title>{title}</Title> : null}
      {children}
      <div>
        <Image src={ArrowIcon} alt="" />
      </div>
      <CloseBtn onClick={handleClose} />
    </Wrapper>,
    document.body
  )
}