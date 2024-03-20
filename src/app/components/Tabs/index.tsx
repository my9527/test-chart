import { FC, useState } from "react";
import styled from "styled-components";
import { motion } from 'framer-motion'

const Wrapper = styled.div`
  color: ${props => props.theme.colors.text1};
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Text = styled.div<{ active: boolean }>`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.active ? props.theme.colors.text1 : props.theme.colors.text4};
  &:hover {
    color: ${props => props.theme.colors.text1};
  }
`

const Title = styled.div`
  cursor: pointer;
  padding: 12px 25px;
  position: relative;
`
const Header = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border1};
`
const Hilight = styled(motion.div)`
  background-color: ${props => props.theme.colors.primary1};
  height: 2px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`


type TabType = {
  title: string,
  children: React.ReactNode,
  key: string,
}

type ITabsProps = {
  tabs: TabType[],
  /** key of the active tab */
  tab: string,
  onTabChange: (key: string) => void,
}
const Tabs: FC<ITabsProps> = ({ tabs, tab: activeTab, onTabChange }) => {
 
  const handleTabChange = (key: string) => () => {
    onTabChange(key)
  };

  const activeTabContent = tabs.find(tab => tab.key === activeTab)?.children ;

  const variants = { show: { opacity: 1 }, hide: { opacity: 0 } }
  return (
    <Wrapper>
      <Header>
        {
          tabs.map((tab) => {
            return (
              <Title key={tab.key} onClick={handleTabChange(tab.key)}>
                <Text active={tab.key === activeTab}>{tab.title}</Text>
                <Hilight initial="hide" animate={ tab.key === activeTab ? 'show' : 'hide' } variants={variants} />
              </Title>
            )
          })
        }
      </Header>
      { activeTabContent }
    </Wrapper>
  )
};
export default Tabs;
