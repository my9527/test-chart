import styled, { css } from "styled-components"


const Title = styled.h2<{ active: boolean }>`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.active ? props.theme.colors.primary1 : props.theme.colors.text4};
`

const SubTitle = styled.span`
font-size: ${props => props.theme.fontSize.header2};
color: ${props => props.theme.colors.text4};
`

const Box = styled.div`
  display: flex;
`

const TabPanel = styled.div<{ active: boolean, $disabled: boolean }>`
  flex-grow: 1;
  text-align: center;
  line-height: 55px;
  background: ${props => props.active ? 'unset' : props.theme.colors.fill3};
  cursor: pointer;
  position: relative;
  ${props => props.$disabled && css`
    cursor: not-allowed;
  `}
  ${props => !props.$disabled && css`
    &:hover ${Title} {
      color: ${props => props.theme.colors.primary1};
    }
  `};
`

const Hilight = styled.div<{ active: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 2px;
  width: 100%;
  background: ${props => props.active ? props.theme.colors.primary1 : 'transparent'};
`

type TTabType = {
  key: string,
  title: string,
  subTitle?: string
  disabled?: boolean
}
interface ITwoTabsProps {
  tabs: TTabType[]
  /** key of the active tab */
  activeTab: string,
  onTabChange: (v: string) => void
}
export function TwoTabs({ tabs, activeTab, onTabChange }: ITwoTabsProps) {
  const handleTabChange = (v: TTabType) => () => {
    if (v.disabled) return
    onTabChange(v.key)
  }

  return (
    <Box>
      {
        tabs.map(i => (
          <TabPanel $disabled={!!i.disabled} key={i.key} active={i.key === activeTab} onClick={handleTabChange(i)}>
            <Title active={i.key === activeTab}>{i.title}</Title>
            {/* { i.subTitle ? <SubTitle>{i.subTitle}</SubTitle> : null } */}
            <Hilight active={i.key === activeTab} />
          </TabPanel>
        ))
      }
    </Box>
  )
}