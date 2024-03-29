import { useTokenByFutureId } from "@/app/hooks/useTokens"
import { memo } from "react";



export const TokenById:FCC<{ futureId: number|string }> = memo(({ futureId }) => {

    const token = useTokenByFutureId(futureId);

    return <>
        {token?.symbolName}
    </>
})