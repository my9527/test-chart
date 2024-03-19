import styled from "styled-components";
import { useAccount, useDisconnect } from "wagmi";
import { walletsMap } from "./contants";
import { shortenString } from "@/app/lib/shortenString";
import { CopyBtn } from "../../CopyBtn";
import { Row } from "../../Row";
import { Col } from "../../Col";
import { FC, ReactNode } from "react";
import Image from "next/image";

import IconDepositSvg from "@/app/assets/header/icon-deposit.svg";
import IconIotxSvg from "@/app/assets/header/icon-iotx.svg";
import IconArrowOuterSvg from "@/app/assets/header/icon-arrow-outer.svg";




const Wrapper = styled(Col)`
    height: 100%;

    .part-name {

        color: ${(props) => props.theme.colors.text1};
        /* header2 */
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.header2};
        font-style: normal;
        font-weight: 700;
        line-height: 100%; /* 16px */
    }

    .part-item {
        border-radius: 8px;
        background: ${(props) => props.theme.colors.fill3};
    }

    .row-disconnect{
        cursor: pointer;
        color: ${(props) => props.theme.colors.text4};
        /* small */
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.small};
        font-style: normal;
        font-weight: 400;
        line-height: 120%; /* 14.4px */
        padding: 13px 0;
        &:hover{
            border-radius: 8px;
            background: ${(props) => props.theme.colors.fill3};
            background: ${(props) => props.theme.colors.primary3};
            svg path{
                fill: ${(props) => props.theme.colors.text1};
                fill-opacity: 1;
            }
            color: ${(props) => props.theme.colors.text1};
        }
    }

`;


const WalletStatus = styled(Row)`

    gap: 10px;

`

const Divider = styled.div`

    width: 100%;
    height: 2px;
    background: ${(props) => props.theme.colors.border1};
`


const BalanceInfoWrapper = styled(Col)`
    padding: 10px 9px;
    border-radius: 8px;
    background: ${(props) => props.theme.colors.fill3};
    width: 150px;
    cursor: pointer;

    .wallet-name {
        color: ${(props) => props.theme.colors.text4};

        /* small */
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.small};
        font-style: normal;
        font-weight: 400;
        line-height: 120%; /* 14.4px */
    }
    .wallet-base{
        color: ${(props) => props.theme.colors.primary1};
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.min};
        font-style: normal;
        font-weight: 400;
        line-height: 120%; /* 12px */
    }
`


const BalanceInfo: FCC<{ name: string, amount: string }> = ({ name, amount }) => {


    return (
        <BalanceInfoWrapper gap="14px" >
            <Row className="full" justify="space-between">
                <span className="wallet-name">{name}</span> <span className="wallet-base">USD</span>
            </Row>
            <Row className="full" >
                <div className="wallet-balance">
                    ≈ {amount ?? '-'}
                </div>
            </Row>
        </BalanceInfoWrapper>
    );
}


const ToolBtnWrapper = styled(Row)`
border-radius: 8px;
background: ${(props) => props.theme.colors.fill3};
padding: 13px 9px;
width: 100%;
cursor: pointer;

.tool-icon {

}
.tool-name{
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
}

`

// const PartWrapper = styled.div`
//     border-radius: 8px;
//     background: var(--fill3, #16161C);
// `


const ToolBtn: FC<{ iconUrl: any, name: string }> = ({ iconUrl, name}) => {

    return (
        <ToolBtnWrapper gap="10px">
            <Image alt={name} src={iconUrl} />
            <span className="tool-name">{name}</span>
        </ToolBtnWrapper>
    );
}


const FastTradeInfoWrapper = styled(Col)`

width: 100%;
.iotx-balance{
    white-space: nowrap;
    color: ${(props) => props.theme.colors.text4};
    /* small */
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
    text-align: left;
}
.iotx-name{
    
    color: ${(props) => props.theme.colors.text2};
    /* min */
    font-family: Arial;
    
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 12px */
    font-size: ${(props) => props.theme.fontSize.min};
}
.fast-trade-balance{
    // color: var(--Quenta--FFFFFF, var(--text1, #FFF));
    color: ${(props) => props.theme.colors.text1};

    /* header2 */
    font-family: Arial;
    // font-size: 16px;
    font-size: ${(props) => props.theme.fontSize.header2};
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 16px */
}
.f-part-item{
    padding: 14px 10px;
    border-radius: 8px;
    background: ${(props) => props.theme.colors.fill3};
    cursor: pointer;
}
.reset-item{
    background: none;
}

.f-part-title {
    
    color: ${(props) => props.theme.colors.text4};
    /* small */
    font-family: Arial;
    
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
}
    
`


const FastTradeInfo = () => {


    return (
        <FastTradeInfoWrapper gap="10px">
            <Col  className="f-part-item full" gap="10px">
                <Row justify="space-between" className="full">
                    <div className="iotx-balance full">IOTX Balance</div>
                    <Row justify="flex-end">
                        <Image width={20} height={20} alt="iotx" src={IconIotxSvg} />
                        <span className="iotx-name">IOTX</span>
                    </Row>
                </Row>
                <Row justify="flex-start" className="full">
                    <span className="fast-trade-balance">234234</span>
                </Row>
            </Col>
            <Row className="full" justify="space-between" gap="20px">
                <Row className="f-part-item" justify="space-between">
                    <span className="f-part-title">Deposit IOTX</span>
                    <Image src={IconArrowOuterSvg} alt="Deposit IOTX" />
                </Row>
                <Row className="f-part-item" justify="space-between">
                    <span className="f-part-title">Withdraw IOTX</span>
                    <Image src={IconArrowOuterSvg} alt="Deposit IOTX" />
                </Row>
            </Row>
            <Row className="full" justify="space-between" gap="20px">
                <Row className="f-part-item full" justify="space-between">
                    <span className="f-part-title">Buy IOTX</span>
                    <Image src={IconArrowOuterSvg} alt="Deposit IOTX" />
                </Row>
                <Row justify="flex-end" className="f-part-item reset-item full">
                    <span className="f-part-title">Reset</span>
                </Row>
            </Row>


        </FastTradeInfoWrapper>
    );
}




export const UserWalletInfo: FC<{ address: `0x${string}` | undefined }> = ({ address }) => {

    const { connector, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    console.log("isConnectedisConnected", isConnected);

    if(!isConnected) {
        return null;
    }


    return (

        <Wrapper align="flex-start" gap="10px">
            <WalletStatus>
                {
                    walletsMap[connector?.name as string]?.icon
                }
                <span>{shortenString(address as string)}</span>
                <CopyBtn content={address as string} />
            </WalletStatus>
            <Divider />
            <div className="part-name">
                Quenta Balance
            </div>
            <Row className="full" justify="space-between">
                <BalanceInfo name="Exchange Wallet" amount="1231"></BalanceInfo>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" transform="rotate(-90 9 9)" fill="#272341" />
                    <path d="M4.5 6.79736L13.5 6.79736L11.1316 4.66578" stroke="#7C67FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.5 10.8474L4.5 10.8474L6.86842 12.979" stroke="#7C67FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <BalanceInfo name="Exchange Wallet" amount="1231"></BalanceInfo>
            </Row>
            <Divider />
            <Col gap="10px" className="full" >
                <Row className="full" gap="20px">
                    <ToolBtn iconUrl={IconDepositSvg} name="Deposit" />
                    <ToolBtn iconUrl={IconDepositSvg} name="Withdraw" />
                </Row>
                <Row className="full" gap="20px">
                    <ToolBtn iconUrl={IconDepositSvg} name="Language" />
                    <ToolBtn iconUrl={IconDepositSvg} name="View on explorer" />
                </Row>
            </Col>
            <Divider />
            <FastTradeInfo />
            <Divider />
            <div style={{ flex: 1 }}></div>


            <Row onClick={() => disconnect()} className="row-disconnect part-item" justify="center" gap="10px">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M6.70377 1.03024C6.70377 0.46125 7.20535 0.000244141 7.82387 0.000244141C8.44249 0.000244141 8.94379 0.46125 8.94379 1.03024V6.75988C8.94379 7.3287 8.44249 7.78979 7.82387 7.78979C7.20533 7.78979 6.70377 7.3287 6.70377 6.75988V1.03024ZM7.54378 15.0002C3.67777 15.0002 0.543701 12.1178 0.543701 8.56233C0.543701 5.82506 2.40469 3.49288 5.02376 2.5616V4.85343C3.6803 5.62725 2.78374 6.99698 2.78374 8.56233C2.78374 10.9801 4.91504 12.9401 7.5438 12.9401C10.1728 12.9401 12.3038 10.9801 12.3038 8.56233C12.3038 7.2257 11.6506 6.03107 10.6238 5.22797V2.78789C12.9433 3.83661 14.5437 6.02488 14.5437 8.56252C14.5439 12.1178 11.4098 15.0002 7.54378 15.0002Z" fill="white" fill-opacity="0.5"/>
                </svg>
                <div>Disconnect</div>
            </Row>


        </Wrapper>
    );
}