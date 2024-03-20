import styled, { css } from "styled-components"

const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.text1};
  margin-bottom: 10px;
`
const FieldFlex = styled.div<{ pr?: number }>`
  display: flex;
  justify-content: space-between;
  ${props => props.pr && css`padding-right: ${props.pr}px;`}
`

const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FieldLabel = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
  line-height: 14px;
`

const FieldValue = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
`

const Button = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.primary1};
  line-height: 20px;
  padding: 0 14px;
  background: ${props => props.theme.colors.fill3};
  border-radius: 99px;
  min-width: 60px;
  &:hover {
    background: ${props => props.theme.colors.primary1};
    color: ${props => props.theme.colors.text1};
  }
`

const Actions = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  cursor: pointer;
`

const token = 'QLP'
export function AssetsContent() {
  return (
    <div>
      <Title>Pending Assets</Title>
      <FieldBox>
        <FieldFlex>
          <FieldLabel>Current Epoch Remaining</FieldLabel>
          <FieldValue>00:00:00</FieldValue>
        </FieldFlex>
        <FieldFlex>
          <FieldLabel>{`Bought ${token}`}</FieldLabel>
          <Actions>
            <FieldValue>0</FieldValue>
            <Button>Claim</Button>
          </Actions>
        </FieldFlex>
        <FieldFlex>
          <FieldLabel>Sold USDX</FieldLabel>
          <Actions>
            <FieldValue>0</FieldValue>
            <Button>Claim</Button>
          </Actions>
        </FieldFlex>
        <FieldFlex pr={80}>
          <FieldLabel>{`Returned ${token}`}</FieldLabel>
          <FieldValue>0</FieldValue>
        </FieldFlex>
      </FieldBox>
    </div>
  )
}