import { useRecoilValue } from "recoil"
import { recoilExecutionFee } from "../models"




export const useExecutionFee = () => {

    const _executionFee = useRecoilValue(recoilExecutionFee);

    return _executionFee;
}