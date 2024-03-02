
// config providers here


import { AppConfigProvider } from "./context/AppConfigProvider";

type ProvidersProps = {

} ;

export const Providers: FCC<ProvidersProps> = (props) => {


    return (
        <AppConfigProvider chainId={1}>
            {props.children}
        </AppConfigProvider>
    );
}