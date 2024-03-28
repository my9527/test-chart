


import { FC, memo } from "react";
import { OpenPostionsEffects } from "./PositionEffects";
import { LPEffects } from "./LPEffects";
import { OrderEffects } from "./OrderEffects";
import { BalanceAndPoolEffects } from "./BalanceAndPoolEffects";




export const GlobalEffects:FC = memo(() => {


    return (
        <>
            <OpenPostionsEffects/>
            <LPEffects />
            <OrderEffects />
            <BalanceAndPoolEffects />
        </>
    );
});