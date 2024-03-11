
import { FC, PropsWithChildren } from "react";
import { type Address, type Chain } from 'viem';



// export 


declare global {


    // type FC<P = {}> = React.FunctionComponent<P>
    // Custom Type for a React functional component with props AND CHILDREN
    type FCC<P = {}> = FC<PropsWithChildren<P>>

    type Maybe<T> = T | null

    type AnyFunc = (...args: any[]) => any


    type AnyObjec = { [key: string]: any } 


    type Addr = Address | undefined


    interface Window {
        ethereum: any;
    
        // okx wallet injected provider
        okxwallet?: any;
    
        configurationData:(args0: {
            exchanges: never[],
            symbolsTypes: never[],
            supported_resolutions: any,
            supports_marks: boolean,
            supports_search: boolean,
            supports_time: boolean,
            supports_timescale_marks: boolean,
            has_no_volume: boolean,
        }) => void;
    
    }


    
}