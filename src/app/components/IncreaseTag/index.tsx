import { FC, ReactNode } from "react";
import styled from "styled-components";

interface IIncreaseTag {
  value: string | number;
  hasPrefix?: boolean;
  hasColor?: boolean;
  digits?: number;
  defaultEmptyText?: string;
  format?: (value: string | number) => ReactNode;
}

const Wrapper = styled.div`
  color: ${props => props.theme.colors.text1};
  &.positive {
    color: ${props => props.theme.colors.text2};
  }
  &.negative {
    color: ${props => props.theme.colors.text5};
  }
`

const IncreateTag: FC<IIncreaseTag> = ({
  value,
  hasPrefix = true,
  digits = 2,
  defaultEmptyText = '0',
  hasColor = true,
  format,
}) => {
  const prefix = hasPrefix ? (Number(value) > 0 ? '+' : '') : '';

  const transferredValue = Number(value) !== 0 ? Number(value).toFixed(digits) : defaultEmptyText;
  return (
    <Wrapper className={hasColor ? (Number(value) > 0 ? 'positive' : 'negative') : ''}>
      {`${prefix}${format ? format(transferredValue) : transferredValue}`}
    </Wrapper>
  )
}

export default IncreateTag;