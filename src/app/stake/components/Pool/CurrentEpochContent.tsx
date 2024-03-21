import { useEpoch } from "@/app/hooks/useEpoch"
import { motion } from "framer-motion"
import styled, { css } from "styled-components"
import { useEpochEffect } from "../../effects/EpochEffect"

const Fields = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FieldItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 20px;
  border: 1px solid transparent;
  padding: 8px 17px 8px 14px;
  border-radius: 8px;
`

const FieldAnimateItem = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  border: 1px solid transparent;
  padding: 8px 17px 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    border-color: ${props => props.theme.colors.primary1};
    background-color: ${props => props.theme.colors.fill3};

    .label {
      color: ${props => props.theme.colors.text1};
    }

    .value {
      color: ${props => props.theme.colors.primary1};
    }
  }
`

const FieldLabel= styled.div<{ width?: number }>`
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.small};
  white-space: nowrap;
  ${props => props.width && css`
    width: ${props.width}px;
  `}
`

const FieldTime = styled.div`
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.small};
`

const FieldValue = styled.div`
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.header2};
`

const EpochTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.header0};
`

const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.colors.border1};
  height: 75px;
`

const token = 'QLP'
export function CurrentEpochContent () {
  const epoch = useEpoch()
  const res = useEpochEffect()

  const epochFieldsLeft = [
    {
      key: 'start-in',
      label: "Start in",
      value: "2024-2-26 00:00",
    },
    {
      key: 'end-in',
      label: "End in",
      value: "2024-2-26 00:00",
    }
  ]
  const epochFieldsMiddle = [
    {
      key: 'total',
      label: `Total ${token}`,
      value: "123,123.00",
    },
    {
      key: 'TVL',
      label: "TVL",
      value: "$123,123,123.00",
    }
  ]
  const epochFieldsRight = [
    {
      key: 'your-position',
      label: "Your Position",
      value: "123,123.00 QLP",
    },
    {
      key: 'liquidity-supplied',
      label: "Liquidity Supplied",
      value: "$123,123.00",
    }
  ]
  return (
    <>
      <EpochTitle>Current Epoch {epoch}</EpochTitle>
      <Fields>
        <FieldColumn>
          {
            epochFieldsLeft.map(field => (
              <FieldItem key={field.key}>
                <FieldLabel width={39}>{field.label}</FieldLabel>
                <FieldTime>{field.value}</FieldTime>
              </FieldItem>
            ))
          }
        </FieldColumn>
        <Divider />
        <FieldColumn>
          {
            epochFieldsMiddle.map(field => (
              <FieldAnimateItem key={field.key}>
                <FieldLabel width={53} className="label">{field.label}</FieldLabel>
                <FieldValue className="value">{field.value}</FieldValue>
              </FieldAnimateItem>
            ))
          }
        </FieldColumn>
        <Divider />
        <FieldColumn>
          {
            epochFieldsRight.map(field => (
              <FieldAnimateItem key={field.key}>
                <FieldLabel width={95} className="label">{field.label}</FieldLabel>
                <FieldValue className="value">{field.value}</FieldValue>
              </FieldAnimateItem>
            ))
          }
        </FieldColumn>
      </Fields>
    </>
  )
}