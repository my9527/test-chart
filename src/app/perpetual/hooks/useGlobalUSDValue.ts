import { FutureType } from "@/app/config/common";
import { recoilOpenInterests } from "@/app/models"
import { useMemo } from "react";
import { useRecoilValue } from "recoil"



export const useGlobalUSDValue = () => {

    const openInterests = useRecoilValue(recoilOpenInterests);


    return openInterests.globalUsdValues;
}


export const useGlobalUSDValueByIdAddress = (address: string, futureId: number | string) => {
    const openInterests = useRecoilValue(recoilOpenInterests);

    return useMemo(() => {
        return openInterests.globalUsdValues.filter((v: any) => v.futureId === futureId && v.address === address);

    }, [ address, futureId, openInterests]);

}

export const useGlobalUSDValueByIdSide = (futureId: number | string, side: FutureType) => {
    const openInterests = useRecoilValue(recoilOpenInterests);

    return useMemo(() => {
        return openInterests.globalUsdValues.filter((v: any) => v.futureId === futureId && v.side === side);

    }, [ side, futureId, openInterests]);

}