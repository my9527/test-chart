import { FutureType } from "@/app/config/common";
import { recoilOpenInterests } from "@/app/models"
import { useMemo } from "react";
import { useRecoilValue } from "recoil"



export const useBorrowingFees = () => {


    const openInterests = useRecoilValue(recoilOpenInterests);

    return openInterests.borrowingFees;

}

export const useBorrowingFeeByAddressSide = (address: string, side: FutureType) => {
    const openInterests = useRecoilValue(recoilOpenInterests);

    return useMemo(() => {
        return openInterests.borrowingFees.filter((fee: any) => fee.address.toLowerCase() === address?.toLowerCase() && side === fee.side);
    }, [address, side, openInterests]);

}