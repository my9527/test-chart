import styled from "styled-components";


const Container = styled.div`
  border-radius: 8px;
  background-color: ${props => props.theme.colors.fill2};

  &:hover {
    box-shadow: ${props => props.theme.colors.fill2Hover};
  }
`;


const Box: FCC<{ className?: string; }> = ({
  children,
  className,
}) => (
  <Container className={className}>
    {children}
  </Container>
);

export default Box;