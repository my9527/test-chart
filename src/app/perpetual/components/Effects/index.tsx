

import { DepthAndBorrowingRateEffect } from "./DepthAndBorrowingRateEffects";
import { OpenInterestsEffects } from "./OpenInterersEffect";



export const PerpetualEffects = () => {

    return (
        <>
            <DepthAndBorrowingRateEffect />
            <OpenInterestsEffects />
        </>
    );
}