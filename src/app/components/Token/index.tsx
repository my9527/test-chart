import { useTokenByFutureId } from "@/app/hooks/useTokens"



export const TokenById:FCC<{ futureId: number|string }> = ({ futureId }) => {

    console.log("futureId", futureId);

    const token = useTokenByFutureId(futureId);

    return <>
        {token?.symbolName}
    </>
}