import { useChainId } from "wagmi";
import { useMemo } from "react";
import { Token, tokens } from "../config/tokens";

/**
 * 获取全部token
 * @returns
 */

export const useTokens = () => {
  const chainId = useChainId();
  
  return tokens[chainId];
};

/**
 * 根据tokenName 获取token
 * @param tokenName
 * @returns
 */
export const useTokenByName = (tokenName: string) => {
  const tokens = useTokens();

  
  const token = useMemo(() => {
    return tokens.filter((token_) => token_.symbolName.toLowerCase() === tokenName.toLowerCase());
  }, [tokens, tokenName]);

  return token[0];
};

/**
 * 根据futureId 获取token
 * @param futureId
 * @returns
 */
export const useTokenByFutureId = (futureId: number | string) => {
  const tokens = useTokens();
  const token = useMemo(() => {
    return tokens.filter((token_) => +token_.futureLongId === +futureId);
  }, [tokens, futureId]);

  return token[0];
};

/**
 * 交易对map， 直接通过名称获取
 * @returns
 */
export const useTokensMap = () => {
  const tokens = useTokens();

  return useMemo(() => {
    let result: Record<string, Token> = {};
    for (let i of tokens) {
      result[i.symbolName] = i;
    }
    return result;
  }, [tokens]);
};

/**
 * 根据futureId map
 * @returns
 */
export const useTokensIdMap = () => {
  const tokens = useTokens();

  return useMemo(() => {
    let result: Record<string, Token> = {};
    for (let i of tokens) {
      result[i.futureLongId] = i;
    }
    return result;
  }, [tokens]);
};



/**
 * 获取usdTokens
 * @returns 
 */
export const useUSDTokens = () => {
  const tokens = useTokens();
  return useMemo(() => {
    return tokens.filter(token_ => token_.exchangeStable)
  }, [tokens]);
}


export const useTradeTokens = () => {

  const tokens = useTokens();

  return useMemo(() => {
    return tokens.filter(token_ => token_.tradeable !== false)
  }, [tokens]);

}

export const useDepositableTokens = () => {
  const tokens = useTokens();

  return useMemo(() => {
    return tokens.filter(token_ => token_.deposit === true)
  }, [tokens]);
}

export const useWithdrawableTokens = () => {
  const tokens = useTokens();

  return useMemo(() => {
    return tokens.filter(token_ => token_.withdraw === true)
  }, [tokens]);
}


export const useStableTokens = () => {
  const tokens = useTokens();
  return useMemo(() => {
    return tokens.filter(token_ => token_.stable && token_.address);
  }, [tokens]);
}