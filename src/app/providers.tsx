// config providers here

import { RainbowProvider } from "./context/RainbowProvider";
import { AppConfigProvider } from "./context/AppConfigProvider";
import ThemeConfigProvider from "./context/ThemeProvider";
type ProvidersProps = {};

export const Providers: FCC<ProvidersProps> = (props) => {
  return (
    // <RainbowProvider>
    <AppConfigProvider chainId={1}>
      <ThemeConfigProvider>{props.children}</ThemeConfigProvider>
    </AppConfigProvider>
    // </RainbowProvider>
  );
};
