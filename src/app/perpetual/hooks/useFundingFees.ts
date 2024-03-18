import { FutureType } from "@/app/config/common";
import { recoilOpenInterests } from "@/app/models"
import { useMemo } from "react";
import { useRecoilValue } from "recoil"



export const useFundingFees = () => {


    const openInterests = useRecoilValue(recoilOpenInterests);

    return openInterests.fundingFees;

}

export const useFundingFeeByAddressSide = (address: string, side: FutureType) => {
    const openInterests = useRecoilValue(recoilOpenInterests);

    return useMemo(() => {
        return openInterests.fundingFees.filter((fee: any) => fee.address.toLowerCase() === address?.toLowerCase() && side === fee.side);
    }, [address, side, openInterests]);

}