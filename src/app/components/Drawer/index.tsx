import { useClickOutside } from "@/app/hooks/useClickOutside";
import { useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components";
import { motion, Variants } from 'framer-motion'

/** direction of the drawer comes out */
export enum DirectionEnum {
  LEFT = "left",
  RIGHT = "right"
}

const Wrapper = styled(motion.div)`
  position: fixed;
  height: 100%;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.fill2};
  color: #fff;
  padding: 0 10px;
  z-index: 1000;
  box-sizing: content-box;

  &.placement-right {
    right: 0;
  }

  &.placement-left {
    left: 0;
  }
`;

const Title = styled.div`
  padding: 10px 0;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  font-size: ${(props) => props.theme.fontSize.medium};
  display: flex;
  gap: 10px;
  align-items: center;
`

interface IDrawerProps extends React.PropsWithChildren {
  placement?: DirectionEnum.LEFT | DirectionEnum.RIGHT,
  visible: boolean,
  onHide: () => void,
  width?: number,
  title?: React.ReactNode,
}

export const Drawer = ({
  placement = DirectionEnum.RIGHT, 
  visible = false,
  children,
  onHide,
  width = 320,
  title,
}: IDrawerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    onHide()
  }, [onHide])

  /** 'open' state of horizontal(left & right) transformation */
  const openTransHorizontal = {
    transform: `translateX(0)`,
    opacity: 1,
  }

  /** 'closed' state of horizontal transformation */
  const closedTransMapsByPlacement = {
    [DirectionEnum.LEFT]: {
      transform: `translateX(-${width}px)`,
      opacity: 0,
    },
    [DirectionEnum.RIGHT]: {
      transform: `translateX(${width}px)`,
      opacity: 0,
    }
  }

  const variants: Variants = {
    open: openTransHorizontal,
    closed: closedTransMapsByPlacement[placement]
  };
  
  useClickOutside(ref, handleClickOutside);
 
  return createPortal(
    <Wrapper 
      initial="closed"
      animate={visible ? "open" : "closed"} 
      transition={{ duration: 0.2 }} 
      variants={variants} 
      ref={ref}
      className={`placement-${placement}`}
      style={{ width: `${width}px`}}
    >
      { title ? <Title>{title}</Title> : null}
      {children}
    </Wrapper>,
    document.body
  )
}