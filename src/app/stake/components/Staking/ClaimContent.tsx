import { motion } from "framer-motion"
import styled from "styled-components"


const FieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
  align-items: center;
  justify-content: space-between;
`

const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const FieldLabel= styled.div`
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.small};
`

const RewardText = styled.strong`
  color: ${props => props.theme.colors.primary1};
  font-size: 24px;
`

const FieldValue = styled.strong`
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.header1};
`

const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.colors.border1};
  height: 100%;
`

const Button = styled(motion.div)`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.text1};
  line-height: 40px;
  width: 200px;
  background: linear-gradient(90deg, #634AFF 0%, #7E73FF 100%);
  border-radius: 999px;
  text-align: center;
  cursor: pointer;
  margin: 0 auto;
`

const token = 'QLP'
const coinName = 'Qcoin'
const tokenAmount = '123,123.00'
const coinAmount = '123,123.00'
export function ClaimContent () {

  const fieldsLeft = [
    {
      key: 'token',
      label: `My $st${token}`,
      value: `${tokenAmount} ${token}`,
    },
    {
      key: 'coin',
      label: `My $st${coinName}`,
      value:  `${coinAmount} ${coinName}`,
    }
  ]
 
  return (
    <>
      <FieldColumn>
        {
          fieldsLeft.map(field => (
            <FieldItem key={field.key}>
              <FieldLabel>{field.label}</FieldLabel>
              <FieldValue>{field.value}</FieldValue>
            </FieldItem>
          ))
        }
      </FieldColumn>
      <Divider />
      <FieldColumn>
        <FieldItem>
          <FieldLabel>Claimable Rewards</FieldLabel>
          <RewardText>123,123.00</RewardText>
        </FieldItem>
        <Button whileTap={{ scale: 1.1 }}>Claim</Button>
      </FieldColumn>
    </>
  )
}
