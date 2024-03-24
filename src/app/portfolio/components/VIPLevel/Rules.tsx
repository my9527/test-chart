import Box from "@/app/components/Box"
import SimpleText from "@/app/components/SimpleText"
import styled from "styled-components"

const Wrapper = styled(Box)`
  padding: 13px 25px 20px;
  width: 420px;
` 

const Title = styled.h2`
  color: ${props => props.theme.colors.primary1};
  font-size: ${props => props.theme.fontSize.header0};
  margin-bottom: 13px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${props => props.theme.colors.border1};
  padding: 12px 0;
`

const rules = [
  {
    level: 0,
    volumn: '<50,000',
    discount: '0'
  },
  {
    level: 1,
    volumn: '≥50,000',
    discount: '10%'
  },
  {
    level: 2,
    volumn: '≥500,000',
    discount: '15%'
  },
  {
    level: 3,
    volumn: '≥2,500,000',
    discount: '20%'
  },
  {
    level: 4,
    volumn: '≥5,000,000',
    discount: '30%'
  },
  {
    level: 5,
    volumn: '≥10,000,000',
    discount: '50%'
  },
  {
    level: 6,
    volumn: '≥25,000,000',
    discount: '80%'
  }
]

export const Rules = () => {
  return (
    <Wrapper>
      <Title>VIP Rules</Title>
      {
        rules.map((rule, index) => (
          <Row key={index}>
            <SimpleText $size="medium" $color="text1">{`VIP ${rule.level}`}</SimpleText>
            <SimpleText $size="medium" $color="primary1">{rule.volumn}</SimpleText>
            <SimpleText $size="medium" $color="text1">{`VIP ${rule.level}`}</SimpleText>
          </Row>
        ))
      }
    </Wrapper>
  )
}