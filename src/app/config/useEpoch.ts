import { useRecoilValue } from "recoil"
import { recoilBalanceAndPool } from "../models"



export const useEpoch = () => {
    const balanceAndPoolInfo = useRecoilValue(recoilBalanceAndPool);

    return balanceAndPoolInfo.epoch;
}