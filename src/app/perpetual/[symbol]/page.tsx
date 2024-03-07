'use client';

import styled from "styled-components";

import { CmptTradingView } from "../components/TradingViewm/chart";
import { useParams, redirect, RedirectType, useRouter } from "next/navigation";
import { memo, useCallback, useEffect } from "react";


const Wrapper = styled.div`

.test{
    color: red;
}

`;



const PagePerpetual = memo(() => {

    const params = useParams<{ symbol: string }>();

    const router = useRouter();

    if(!params?.symbol) {
        redirect('/perpetual/ETH', RedirectType.replace);
        return;
    }

    const changeSymbol = useCallback((nextSymbol: string) => {
        // redirect(`/perpetual/${nextSymbol}`, RedirectType.push);
        router.push(`/perpetual/${nextSymbol}`);
    }, []);

    return (
        <Wrapper>
            {params?.symbol}
            <div>
                <span onClick={() => changeSymbol('KAS')}>KAS</span> &nbsp;&nbsp;&nbsp;&nbsp;
                <span onClick={() => changeSymbol('PIXEL')}>PIXEL</span>
            </div>
            <CmptTradingView />
            
        </Wrapper>
    );
});

PagePerpetual.displayName = 'PagePerpetual';


export default PagePerpetual;