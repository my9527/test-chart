import { AtomEffect, DefaultValue, atom } from "recoil";
import { Token } from "../config/tokens";

export const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key: string) =>
  ({ setSelf, onSet }) => {
    const savedValue = window.localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

export const recoilGlobalMessage = atom<any>({
  key: "globalMessage",
  default: {},
});
export const recoilPanelSide = atom<"left" | "right">({
  key: "panelSide",
  default: "left",
  effects_UNSTABLE: [localStorageEffect<"left" | "right">("LOCALE_PANEL_SIDE")],
});
type ITokenList = {
  [key: string]: { label: string; favoriate?: boolean };
};

export const recoilFavoriateList = atom<ITokenList>({
  key: "favoriateList",
  default: {
    BTC: { label: "BTC", favoriate: true },
    ETH: { label: "ETH", favoriate: true },
    IOTX: { label: "IOTX", favoriate: true },
  },
  effects_UNSTABLE: [localStorageEffect<ITokenList>("LOCALE_TOKEN_LIST")],
});


/**
 * open position list
 */
export const recoilPositions = atom<any>({
  key: 'open_positions',
  default: [],
});


/**
 * 所有交易对的标记价格
 */
export const recoilIndexPrices = atom<Record<string, any>>({
  key: 'index_prices',
  default: {},
});


export const recoilCurrentToken = atom<Token | null>({
  key: 'current_token',
  default: null, // use default token;
})