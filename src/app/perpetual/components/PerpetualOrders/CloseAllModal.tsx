import Modal from "@/app/components/Modal";
import { FutureType } from "@/app/config/common";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useIndexPrices } from "@/app/hooks/useIndexPrices";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { useTokensIdMap } from "@/app/hooks/useTokens";
import { encodeTx } from "@/app/lib/txTools";
import { recoilPositions } from "@/app/models";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { ethers } from "ethers";
import { FC, useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";


const ModalContent = styled.div`

padding: 10px 0;
// color: var(--Quenta--FFFFFF, var(--text1, #FFF));
color: ${(props) => props.theme.colors.text1};
font-size: ${(props) => props.theme.fontSize.medium};
/* medium */
font-family: Arial;
// font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 100%; /* 14px */

`



export const CloseAllModal: FC<{ visible: boolean, onCancel: AnyFunc, onConfirm: AnyFunc}> = ({ visible,onCancel, onConfirm  }) => {

    const [slippage] = useState(localStorage.getItem('slippage') ?? 0.5);
    const appConfig = useAppConfig();
    const MarketOrderContract = useContractParams(appConfig.contract_address.MarketOrderImplementationAddress);
    const positions = useRecoilValue(recoilPositions);
    const indexPrices = useIndexPrices();
    const tokens = useTokensIdMap();
    console.log("render CloseAllModal")

    const { sendByDelegate } = useSendTxByDelegate();

    const createCloseTx = useCallback((pos: any, tickerPrice: any) => {

        const isLong = pos.isLong;
        return encodeTx({
            abi: MarketOrderContract.abi,
            functionName: 'makeDecreaseMarketOrder',
            args: [
                pos.futureId,
                ethers.utils.parseUnits(
                    BigNumber(tickerPrice?.price || 0)
                    .multipliedBy(1 + ((isLong ? -1 : 1) * (+slippage)) / 100)
                    .toFixed(6, BigNumber.ROUND_DOWN),
                    6,
                )
                .toString(),
                pos.tokenSize,
                +dayjs().unix() + 300,
                isLong ? FutureType.LONG : FutureType.SHORT
            ]
        });
    }, []);

    const confirmCloseAll = useCallback(async () => {
        console.log("close all");
        const txs = positions.map(pos => {
            const tk = tokens[pos.futureId];
            return [MarketOrderContract.address, false, appConfig.executionFee, createCloseTx(pos, indexPrices[tk.symbolName])]
        });
        

        try {
            await sendByDelegate({
                data: txs,
                value: txs.reduce((p, s) => BigNumber(p).plus(BigNumber(s[2] as string)), BigNumber(0)).toString(),
                showMsg: false,
            });
            return true;
            
        } catch(e) {
            console.log("close all pos error:", e);
            return false;
           
        }




    }, [positions, indexPrices, appConfig]);

    const handleConfirm = useCallback( async () => {
        const result = await confirmCloseAll();
        if(result) {
            onConfirm();
        }
        
    }, [onConfirm]);




    return (
        <Modal 
        visible={true}
        title="Close All"
        onCancel={onCancel}
        onClose={onCancel}
        onConfirm={handleConfirm}
    >
        <ModalContent>are you sure to close all at market price</ModalContent>
    </Modal>
    );
}