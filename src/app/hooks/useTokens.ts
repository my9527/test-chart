
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { tokens } from "../config/tokens";
import { useParams } from "next/navigation";
import { DEFAULT_TOKEN_SYMBOL } from "../config/common";





/**
 * 获取全部token
 * @returns 
 */

export const useTokens = () => {

    const chainId = useChainId();
    return tokens[chainId];

}


/**
 * 根据tokenName 获取token
 * @param tokenName 
 * @returns 
 */
export const useTokenByName = (tokenName: string) => {
    const tokens = useTokens();
    const token = useMemo(() => {
            return tokens.filter(token_ => token_.symbolName === tokenName);
    }, [tokens, tokenName]);

    return token[0];
}


/**
 * 根据futureId 获取token
 * @param futureId 
 * @returns 
 */
export const useTokenByFutureId = (futureId: number | string) => {
    const tokens = useTokens();
    const token = useMemo(() => {
            return tokens.filter(token_ => +token_.futureLongId === +futureId);
    }, [tokens, futureId]);

    return token[0];
}