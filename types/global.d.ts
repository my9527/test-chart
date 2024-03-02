
import { FC, PropsWithChildren } from "react";


declare global {

    // Custom Type for a React functional component with props AND CHILDREN
    type FCC<P={}> = FC<PropsWithChildren<P>>

    type Maybe<T> = T | null

    type AnyFunc = (...args: any[]) => any


    
}


interface Window {
    ethereum: any;

    // okx wallet injected provider
    okxwallet?: any;
}