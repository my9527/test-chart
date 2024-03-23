import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 200px;
  height: 20px;
  background: ${props => props.theme.colors.fill1};
  border-radius: 999px;
  border: 1px solid transparent;
  padding-left: 30px;
  outline: none;
  color: ${props => props.theme.colors.text1};

  &:hover, &:focus {
    border-color: ${props => props.theme.colors.primary1};
  }

  &:hover + svg, &:focus + svg {
    path {
      fill: ${props => props.theme.colors.primary1};
    }
  }
`

const Svg = styled.svg`
  position: absolute;
  left: 5px;
  top: 5px;
`

interface ISearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
export const SearchInput = ({ value, onChange, className }: ISearchInputProps) => {
  return (
    <Wrapper className={className}>
      <Input value={value} onChange={e => onChange(e.target.value)} type="text" placeholder="Search" />
      <Svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M12.7873 12.1853C12.7721 12.1702 12.7561 12.1559 12.7394 12.1425C13.7435 10.9309 14.3472 9.37532 14.3472 7.67871C14.3472 3.81272 11.2132 0.678711 7.34717 0.678711C3.48117 0.678711 0.347168 3.81272 0.347168 7.67871C0.347168 11.5447 3.48117 14.6787 7.34717 14.6787C9.10206 14.6787 10.7061 14.0329 11.9347 12.966C11.9455 12.9791 11.957 12.9917 11.9689 13.0037L13.3371 14.3719C13.5622 14.597 13.9305 14.597 14.1555 14.3719C14.3806 14.1469 14.3806 13.7786 14.1555 13.5535L12.7873 12.1853ZM9.65323 13.1388C8.92343 13.4475 8.14755 13.604 7.34717 13.604C6.54679 13.604 5.77091 13.4475 5.04111 13.1388C4.33565 12.8404 3.70186 12.413 3.15735 11.8685C2.61284 11.324 2.18545 10.6902 1.88707 9.98479C1.57837 9.25497 1.42186 8.47909 1.42186 7.67871C1.42186 6.87833 1.57838 6.10245 1.88706 5.37265C2.18545 4.66719 2.61283 4.03341 3.15734 3.4889C3.70186 2.94437 4.33565 2.51699 5.04109 2.21862C5.77091 1.90992 6.54678 1.7534 7.34717 1.7534C8.14756 1.7534 8.92343 1.90992 9.65323 2.2186C10.3587 2.51699 10.9925 2.94437 11.537 3.48888C12.0815 4.03339 12.5089 4.66718 12.8073 5.37263C13.1159 6.10244 13.2725 6.87832 13.2725 7.6787C13.2725 8.47908 13.1159 9.25496 12.8073 9.98476C12.5089 10.6902 12.0815 11.324 11.537 11.8685C10.9925 12.413 10.3587 12.8404 9.65323 13.1388Z" fill="white" fill-opacity="0.5"/>
      </Svg>
    </Wrapper>
  );
};
