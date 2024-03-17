


import { FC, memo } from "react";
import { OpenPostionsEffects } from "./PositionEffects";
import { LPEffects } from "./LPEffects";




export const GlobalEffects:FC = memo(() => {


    return (
        <>
            <OpenPostionsEffects/>
            <LPEffects />
        </>
    );
});