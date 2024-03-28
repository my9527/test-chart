import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { encodeTx } from "@/app/lib/txTools";
import { useCallback } from "react"



export const useCancelOrder = () => {

    const appConfig = useAppConfig();
    const StopOrderContractParams = useContractParams(appConfig.contract_address.StopOrderImplementationAddress);
    const MarketOrderContractParams = useContractParams(appConfig.contract_address.MarketOrderImplementationAddress);
    const LimitOrderContractParams = useContractParams(appConfig.contract_address.LimitOrderImplementationAddress);
    const UpdateColloteralContractParams = useContractParams(appConfig.contract_address.UpdateCollateralOrderImplementationAddress);
    const { sendByDelegate } = useSendTxByDelegate()



    const canceOrder = useCallback(async (targetOrder: any) => {
        let fn;
        let ct;

        switch (targetOrder?.type) {
            case 'futureStopOrders':
                fn = 'cancelFutureStopOrder';
                ct = StopOrderContractParams;
                break;
            case 'increaseMarketOrders':
                fn = 'cancelIncreaseMarketOrder';
                ct = MarketOrderContractParams;
                break;
            case 'increaseLimitOrders':
                fn = 'cancelIncreaseLimitOrder';
                ct = LimitOrderContractParams;
                break;
            case 'decreaseLimitOrders':
                fn = 'cancelDecreaseLimitOrder';
                ct = LimitOrderContractParams;
                break;
            case 'decreaseMarketOrders':
                fn = 'cancelDecreaseMarketOrder';
                ct = MarketOrderContractParams;
                break;
            default: // cancelUpdateCollateralOrder
                fn = 'cancelUpdateCollateralOrder';
                ct = UpdateColloteralContractParams;

        }


        try {

            const encodedData = encodeTx({
                abi: ct?.abi,
                args: [targetOrder?.nonce?.toString()],
                functionName: fn,
            });

            await sendByDelegate({
                data: [[ct.address, false, '0', encodedData]]
            });


        } catch (e) {
            console.log("error cancelOrder", e);
        }
    }, []);

    return canceOrder;

}