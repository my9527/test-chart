import { useSetRecoilState } from "recoil"
import { PositionType, recoilPositions } from "../models"
import { useCallback } from "react";



export const useUpdatePositionList = () => {

    const updateRecoilPositionList = useSetRecoilState(recoilPositions);



    const updatePositions = useCallback((newPos: PositionType[]) => {

        updateRecoilPositionList((lastPositions: PositionType[]) => {

            

            return [];
        })

    }, []);


    return updatePositions;

}