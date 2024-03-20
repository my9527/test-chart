import { useRecoilValue } from "recoil"
import { recoilBalanceAndPool } from "../models"



export const useBalanceAndPool = () => {

    const balanceAndPoolInfo = useRecoilValue(recoilBalanceAndPool);

    return balanceAndPoolInfo;
}



export const useWalletBalance = () => {
    const balanceAndPoolInfo = useRecoilValue(recoilBalanceAndPool);

    return balanceAndPoolInfo.walletBalance;
}


export const useExchangeBalance = () => {
    const balanceAndPoolInfo = useRecoilValue(recoilBalanceAndPool);

    return balanceAndPoolInfo.exchangeBalance;
}
