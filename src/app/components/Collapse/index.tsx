import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import ExpandIcon from '@/app/assets/stake/expand.svg'
import Divider from "../Divider";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
`

const Content = styled.div<{ $active?: boolean }>`
  height: auto;
  display: ${props => props.$active ? 'block' : 'none'};
  margin-top: -8px;
`

const StyledImage = styled(Image)<{ $active?: boolean }>`
  transform: ${props => props.$active ? 'rotate(180deg)' : ''};
  transition: 0.2s;
`


interface ICollapseProps {
  header: ReactNode;
  expandIcon?: string | StaticImport;
  active?: boolean;
  disabled?: boolean;
  hideDivider?: boolean;
}
const Collapse: FCC<ICollapseProps> = ({
  header,
  children,
  expandIcon,
  active = false,
  disabled = false,
  hideDivider,
}) => {
  const [visible, setVisible] = useState(active)

  useEffect(() => {
    setVisible(active)
  }, [active])

  const toggle = () => {
    if (disabled) return
    setVisible(v => !v)
  }
  return (
    <div>
      <Header onClick={toggle}>
        { header }
        <StyledImage $active={visible} src={expandIcon || ExpandIcon} alt=""  />
      </Header>
      <Content $active={visible}>
       { children }
      </Content>
      { !hideDivider ? <Divider dir="horizontal" /> : null }
    </div>
  )
}


export default Collapse