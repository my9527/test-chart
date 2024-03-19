import { useParams } from "next/navigation";
import { useTokenByName } from "@/app/hooks/useTokens";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { recoilPerpetualToken } from "@/app/models";

//获取当前token信息
// 仅在 perpetual 路由下使用，否则将获取不到对应的数据
const useCurToken = () => {

  const perpetualToken = useRecoilValue(recoilPerpetualToken);

  // const params = useParams<{ symbol: string }>();
  // const { symbol } = params;

  const symbolName = useMemo(() => {
    return perpetualToken.split("USD")[0].toLocaleUpperCase();
  }, [perpetualToken]);

  

  const token = useTokenByName(symbolName);

  return { symbolName, token: token ?? {} };
};
export default useCurToken;
