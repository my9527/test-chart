import { useParams } from "next/navigation";
import { useTokenByName } from "@/app/hooks/useTokens";
import { useMemo } from "react";

//获取当前token信息
const useCurToken = () => {
  const params = useParams<{ symbol: string }>();
  const { symbol } = params;

  const symbolName = useMemo(() => {
    return symbol.split("USD")[0].toLocaleUpperCase();
  }, [symbol]);

  const curToken = useTokenByName(symbolName);

  return { symbolName, curToken };
};
export default useCurToken;
