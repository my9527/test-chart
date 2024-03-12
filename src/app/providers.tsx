'use client'

// config providers here

import { RainbowProvider } from "./context/RainbowProvider";
import { AppConfigProvider } from "./context/AppConfigProvider";
import ThemeConfigProvider from "./context/ThemeProvider";
import GlobalMessage from "@/app/components/Message";
import { RecoilRoot } from "recoil";
import { OpenPostionsEffects } from "./components/OpenPositions"; 
import { useLayoutEffect } from "react";

// import GlobalMessaged 
type ProvidersProps = {};

export const Providers: FCC<ProvidersProps> = (props) => {

  return (
    <RecoilRoot>
      <RainbowProvider>
        <AppConfigProvider>
          <ThemeConfigProvider>
            <GlobalMessage />
            <OpenPostionsEffects />
            {props.children}
          </ThemeConfigProvider>
        </AppConfigProvider>
      </RainbowProvider>
    </RecoilRoot>
  );
};

export default Providers;
