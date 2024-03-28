import { useRecoilValue } from "recoil"
import { recoilPositions } from "../models"
import { useMemo } from "react";



export const usePositions = () => {


    const positions = useRecoilValue(recoilPositions);


    return positions;

}


export const usePositionsById = (futureId: string | number) => {
    const positions = useRecoilValue(recoilPositions);

    return useMemo(() => {
        return positions.filter(pos => +pos.futureId === +futureId);
    }, [positions, futureId]);
}