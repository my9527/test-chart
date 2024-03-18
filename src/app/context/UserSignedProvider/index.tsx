'use client';

import { compareAddress } from "@/app/lib/compareAddress";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";








const defaultUserContext = {
    user: '',
    signed: '',
    signedAt: 0,

};


export const UserSignedContext = createContext({
    ...defaultUserContext,
    updateUserSigned: (args: typeof defaultUserContext) => {
        console.log("updateUserSigned default", args);
    }
});



export const UserSignedProvider: FCC = ({ children }) => {


    
    const [context, updateContext] = useState({
        user: window?.localStorage.getItem('usr.signedUsr') ?? '',
        signed: window?.localStorage.getItem('usr.signed') ?? '',
        signedAt: window?.localStorage.getItem('usr.signedAt') ?? 0,
    });


    const { address } = useAccount();

    const addressRef = useRef(address);

    const clearUserCtx = useCallback(() => {
        localStorage.removeItem('usr.signedUsr');
                localStorage.removeItem('usr.signedAt');
                localStorage.removeItem('usr.signed');
                updateContext({
                    user: '',
                    signed: '',
                    signedAt: 0,
                });
    }, [])

    useEffect(() => {
        if (address) {
            addressRef.current = address;
            const localUsr = localStorage.getItem('usr.signedUsr');

            // 如果变更了用户
            if (address && !compareAddress(localUsr ?? '', address)) {
                clearUserCtx()
            }
        } else if (!address && addressRef.current) {
            // 如果退出登陆
            clearUserCtx();
        }
    }, [address]);


    const updateUserSigned = useCallback((ctx_: typeof defaultUserContext) => {
        window.localStorage.setItem('usr.signed', ctx_.signed);
        window.localStorage.setItem('usr.signedAt', JSON.stringify(ctx_.signedAt));
        window.localStorage.setItem('usr.signedUsr', ctx_.user);

        updateContext(ctx_);
        return undefined;
    }, []);


    return (
        <UserSignedContext.Provider value={{
            user: context.user,
            signed: context.signed,
            signedAt: +context.signedAt,
            updateUserSigned: updateUserSigned,
        }}>
            {children}
        </UserSignedContext.Provider>
    );
}

// export default UserSignedProvider;