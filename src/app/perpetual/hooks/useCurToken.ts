import { useParams } from "next/navigation";
import { useTokenByName } from "@/app/hooks/useTokens";
import { useMemo } from "react";

//获取当前token信息
// 仅在 perpetual 路由下使用，否则将获取不到对应的数据
const useCurToken = () => {
  const params = useParams<{ symbol: string }>();
  const { symbol } = params;

  const symbolName = useMemo(() => {
    return symbol.split("USD")[0].toLocaleUpperCase();
  }, [symbol]);

  

  const token = useTokenByName(symbolName);

  return { symbolName, token };
};
export default useCurToken;
