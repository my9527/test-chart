'use client'

// config providers here

import { RainbowProvider } from "./context/RainbowProvider";
import { AppConfigProvider } from "./context/AppConfigProvider";
import ThemeConfigProvider from "./context/ThemeProvider";
import GlobalMessage from "@/app/components/Message";
import { RecoilRoot } from "recoil";
import { GlobalEffects } from "./components/GlobalEffects";
import { UserSignedProvider } from "./context/UserSignedProvider";



// import GlobalMessaged 
type ProvidersProps = {};

export const Providers: FCC<ProvidersProps> = (props) => {

  return (
    <RecoilRoot>
      <RainbowProvider>
        <AppConfigProvider>
          <ThemeConfigProvider>
            <UserSignedProvider>
              <GlobalMessage />
              <GlobalEffects />
              {props.children}
            </UserSignedProvider>
          </ThemeConfigProvider>
        </AppConfigProvider>
      </RainbowProvider>
    </RecoilRoot>
  );
};

export default Providers;
