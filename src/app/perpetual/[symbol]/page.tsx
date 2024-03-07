'use client';

import styled from "styled-components";

import { CmptTradingView } from "../components/TradingViewm/chart";
import { useParams, redirect, RedirectType } from "next/navigation";


const Wrapper = styled.div`

.test{
    color: red;
}

`;



const PagePerpetual: FCC<{}> = () => {

    const params = useParams<{ symbol: string }>();

    
    console.log("asdfasdfasdf")


    if(!params?.symbol) {
        redirect('/perpetual/ETH', RedirectType.replace);
        return;
    }

    return (
        <Wrapper>
            {params?.symbol}
            <CmptTradingView symbol={params?.symbol as string} />
            
        </Wrapper>
    );
}

PagePerpetual.displayName = 'PagePerpetual';


export default PagePerpetual;