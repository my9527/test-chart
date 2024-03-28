import React, { cloneElement, useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import Modal from "../../Modal";
import BalanceInput from "../../BalanceInput";
import CurrencySelect from "../../CurrencySelect";
import { Col } from "../../Col";
import { Row } from "../../Row";
import { useDepositableTokens, useUSDTokens } from "@/app/hooks/useTokens";
import { useExchangeBalance, useWalletBalance } from "@/app/hooks/useBalance";
import { Token } from "@/app/config/tokens";
import { useBalanceMethods } from "@/app/hooks/useBalanceMethods";



const Wrapper = styled(Col)`
    width: 100%;

    .balance-input{
        width: 100%;
    }
    .currency-select{
        height: auto;
    }
`;

const ExplainText = styled(Row)`
// color: var(--text4, rgba(255, 255, 255, 0.50));
color: ${(props) => props.theme.colors.text4};
font-family: Arial;
font-size: ${(props) => props.theme.fontSize.small};
font-style: normal;
font-weight: 400;
line-height: normal;
`



export const WithdrawModal: FCC = ({ children }) => {

    const depositTokens = useDepositableTokens();
    const [visible, updateModalVisible] = useState(false);

    const [depositAmount, updateDepositAmount] = useState('');


    const { deposit } = useBalanceMethods();

    const [currentDepositToken, updateCurrentDepositToken] = useState<Token>(depositTokens[0]);

    const onClose = useCallback(() => {

        updateModalVisible(false);
        updateDepositAmount('');
    }, []);
    const onConfirm = useCallback(async () => {

        await deposit(currentDepositToken, depositAmount);


        onClose();
    }, [depositAmount, currentDepositToken]);

    const onCancel = useCallback(() => {
        onClose();
    }, []);

    const [USDX] = useUSDTokens();

    const handleDepositTokenChange = useCallback((nextCurrency: string) => {
        console.log("change: ", nextCurrency);
        updateCurrentDepositToken(depositTokens.find(tk => tk.symbolName === nextCurrency) as Token);
    }, [depositTokens]);



    const exchangeBalance = useExchangeBalance();
    const walletBalance = useWalletBalance();


    const depositTokensSymbols = useMemo(() => {
        return depositTokens.map(tk => tk.symbolName);
    }, [depositTokens]);





    return (
        <Modal
            height={600}
            onClose={onClose}
            visible={visible}
            title="Deposit"
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            <Wrapper gap="10px">
                <BalanceInput
                    title="amount"
                    currency={<CurrencySelect className="currency-select" curCurrency={currentDepositToken.symbolName} list={depositTokensSymbols} handleClick={handleDepositTokenChange} />}
                    balance={walletBalance[currentDepositToken.symbolName]?.balanceReadable}
                    value={depositAmount}
                    onChange={(v) => { updateDepositAmount(v) }}
                />
                <Row justify="center" align="center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                        <circle cx="20.0771" cy="20.5554" r="20" fill="#272341" />
                        <path d="M10.4365 16.979L20.0773 26.6197L29.718 16.979" stroke="#7C67FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </Row>
                <BalanceInput
                    title="receive"
                    currency={<CurrencySelect className="currency-select" showSelect={false} curCurrency={USDX.symbolName} list={[USDX.symbolName]} />}
                    balance={exchangeBalance[USDX.symbolName as string]?.balanceReadable ?? '0'}
                    value={depositAmount}
                    onChange={(v) => { updateDepositAmount(v) }}
                />
                <ExplainText justify="flex-start">1 USDT = 1.000000 USDQ</ExplainText>
            </Wrapper>

        </Modal>

    );
}