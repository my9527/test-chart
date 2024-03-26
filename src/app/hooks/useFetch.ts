import { AxiosRequestConfig } from "axios";
import { request } from "../lib/request";
import { useAppConfig } from "./useAppConfig"
import { useUserSignedInfo } from "./useUserSignedInfo";


/**
 * 自动配置当前的http
 * @returns 
 */
export const useFetch = () => {
    const appConfig = useAppConfig();
    const { user, signed, signedAt } = useUserSignedInfo();

    return (args: AxiosRequestConfig) => {

        const {headers, ...rest} = args;
        return request({
            baseURL: appConfig.api.http,
            headers: {
                ...(headers || {}),
                Addr: user,
                Signed: signed,
                'Signed-At': signedAt
            },
            ...rest,
        });
    }

}