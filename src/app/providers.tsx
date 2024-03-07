"use client";

// config providers here

import { RainbowProvider } from "./context/RainbowProvider";
import { AppConfigProvider } from "./context/AppConfigProvider";
import ThemeConfigProvider from "./context/ThemeProvider";
import GlobalMessage from "@/components/Message";
import { RecoilRoot } from "recoil";
type ProvidersProps = {};

export const Providers: FCC<ProvidersProps> = (props) => {
  return (
    <RecoilRoot>
      <RainbowProvider>
        <AppConfigProvider>
          <ThemeConfigProvider>
            <GlobalMessage />
            {props.children}
          </ThemeConfigProvider>
        </AppConfigProvider>
      </RainbowProvider>
    </RecoilRoot>
  );
};
