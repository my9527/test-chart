import React, { FC, HTMLProps, cloneElement, useMemo } from "react";
import styled from "styled-components";


const Wrapper = styled.div`
display: inline-block;
.content {
    border-radius: 999px;
    border: ${(props) => `1px solid ${props.theme.colors.border1}`};
    background: ${(props) => props.theme.colors.fill2};
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.button {
    height: 30px;
    padding: 9px 23px;
    display: flex;
    align-items: center;
    border: ${(props) => `1px solid transparent`};
    &:active {
    border-radius: 999px;
    border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
    background: ${(props) => props.theme.colors.border1};
    color: ${(props) => props.theme.colors.primary1};
    }
.content {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    gap: 10px;
    padding: 6px 18px;
    height: 32px;
    box-sizing: border-box;
    .plus {
    font-size: 20px;
    color: ${(props) => props.theme.colors.text4};
    }
    &:active {
    border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
    background: ${(props) => props.theme.colors.border1};
    color: ${(props) => props.theme.colors.primary1};
    .plus {
        color: ${(props) => props.theme.colors.primary1};
    }
    }
}
}
`




export const ActionButtonWrapper: FCC = ({ children }) => {


    return (
        <Wrapper>
            <div className="content">

               {children}
            </div>
        </Wrapper>
    );
}

export const ActionButton: FC<{ className?: 'string' } & HTMLProps<HTMLDivElement>> = (props) => {
    

    return (
        <div  {...props} className={`button ${props.className || ''}`} >{props.children}</div>
    );
}