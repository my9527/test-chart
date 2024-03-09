"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.fill1};
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Title = styled.p`
  color: ${(props) => props.theme.colors.text1};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.reguar};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    .label {
      color: ${(props) => props.theme.colors.text4};
    }
    .value {
      color: ${(props) => props.theme.colors.text1};
    }
  }
`;
const Btns = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  .btn {
    flex: 1;
    border-radius: 999px;
    background: ${(props) => props.theme.colors.fill2};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 0;
    cursor: pointer;
    color: ${(props) => props.theme.colors.text2};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header2};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    border: 1px solid transparent;
  }
  .deposit {
    color: ${(props) => props.theme.colors.primary1};
    border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
    background: ${(props) => props.theme.colors.border1};
  }
`;
const Account = () => {
  const list = [
    {
      label: "Equity",
      value: "1000.00 USD",
    },
    {
      label: "Margin Usage",
      value: "80%",
    },
    {
      label: "Floating PNL",
      value: "+2000.00 USD",
    },
  ];
  return (
    <Wrapper>
      <Title>Account</Title>
      <Content>
        {list.map((i) => {
          return (
            <div className="item" key={i?.label}>
              <p className="label">{i?.label}</p>
              <p className="value">{i?.value}</p>
            </div>
          );
        })}
      </Content>
      <Btns>
        <div className="btn">Transfer</div>
        <div className="btn deposit">Deposit</div>
      </Btns>
      <DraggableIcon />
    </Wrapper>
  );
};
export default Account;
