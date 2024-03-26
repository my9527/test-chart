import styled from "styled-components";
import LGButton from '@/app/components/LinearGradientButton'

export const Wrapper = styled.div`
  padding: 0 15px;
`

export const Description = styled.div`
  padding: 0 15px 7px;
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.min};
`

export const Button = styled(LGButton)`
  font-size: ${props => props.theme.fontSize.min};
  margin-top: 4px;
  margin-bottom: 10px;
`