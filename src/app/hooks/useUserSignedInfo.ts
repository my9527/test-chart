import { useContext } from "react"
import { UserSignedContext } from "../context/UserSignedProvider"



export const useUserSignedInfo = () => {
    
    const { signed, signedAt, user } = useContext(UserSignedContext);

    return {
        signed, signedAt, user
    }
}