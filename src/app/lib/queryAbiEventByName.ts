import { AbiEvent } from "abitype";
import { Abi, AbiItem } from "viem";



export const queryAbiEventByName = (evenName: string, abi: AbiItem[]) => {

    const target = abi.find(v => v.type === 'event' && v.name === evenName) as AbiEvent;
    return {
        type: target.type,
        name: target.name,
        inputs: target.inputs,
        anonymous: target.anonymous,

    }
}