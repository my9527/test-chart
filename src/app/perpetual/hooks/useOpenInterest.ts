import { FutureType } from "@/app/config/common";
import { recoilOpenInterests } from "@/app/models"
import { useMemo } from "react";
import { useRecoilValue } from "recoil"



export const useOpenInterests = () => {


    const openInterests = useRecoilValue(recoilOpenInterests);

    return openInterests.openInterests;

}

export const useOpenInterestsByAddressId = (address: string | `0x${string}`, futureId: number | string) => {
    const openInterests = useRecoilValue(recoilOpenInterests);

    return useMemo(() => {
        return openInterests.openInterests.filter((interest: any) => interest.address.toLowerCase() === address?.toLowerCase() && futureId === interest.futureId);
    }, [address, futureId, openInterests]);

}

export const useOpenInterestsBySideId = (side: FutureType, futureId: number | string) => {
    const openInterests = useRecoilValue(recoilOpenInterests);

    return useMemo(() => {
        return openInterests.openInterests.filter((interest: any) => interest.side === side && futureId === interest.futureId);
    }, [side, futureId, openInterests]);
    

    

}