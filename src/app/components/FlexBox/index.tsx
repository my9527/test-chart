import styled, { css } from "styled-components";
import { Aligns, Justify } from "../BaseFlex";

interface FlexContainerProps {
  $alignItems?: Aligns;
  $justifyContent?: Justify;
  $gap?: string;
  $direction?: string;
  $flexWrap?: string;
}

const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  align-items: ${({ $alignItems }) => $alignItems || 'flex-start'};
  justify-content: ${({ $justifyContent }) => $justifyContent || 'flex-start'};
  flex-direction: ${({ $direction }) => $direction || 'row'};
  gap: ${({ $gap }) => $gap || '0'};
  flex-wrap: ${({ $flexWrap }) => $flexWrap || 'nowrap'};
`;

interface FlexBoxProps {
  className?: string;
  alignItems?: Aligns;
  justifyContent?: Justify;
  gap?: string;
  direction?: string;
  flexWrap?: string;
}

const FlexBox: FCC<FlexBoxProps> = ({
  children,
  alignItems,
  justifyContent,
  direction,
  flexWrap,
  className,
  gap,
}) => (
  <FlexContainer
    $alignItems={alignItems}
    $justifyContent={justifyContent}
    $direction={direction}
    $flexWrap={flexWrap}
    className={className}
    $gap={gap}
  >
    {children}
  </FlexContainer>
);

export default FlexBox;