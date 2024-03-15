import { AtomEffect, DefaultValue, atom, selector } from "recoil";
import { Token } from "../config/tokens";
import { Address } from "viem";
import BigNumber from "bignumber.js";

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



export type PositionType = {
  futureId: string | number;
  id: string;
  collateral: string;
  future: string; // future address
  maxProfitRatio: string | number;
  openCost: string | number;
  tokenSize: string;
  user: Address;
  isLong: boolean;
  entryPriceReadable: string;
  collateralReadable: string;
  cumulativeFundingFeeReadable: string;
  cumulativeBorrowingFeeReadable: string;
  entryFundingFeePerTokenReadable: string;
  entryBorrowingFeePerTokenReadable: string;
  cumulativeTeamFeeReadable: string;
}


/**
 * open position list
 */

export const recoilPositions = atom<PositionType[]>({
  key: 'open_positions',
  default: []
});


/**
 * 获取当前仓位的币种，避免因为仓位其他数据变化导致重复渲染
 * 此处获取的事futureId, 所以需要自行处
 */
export const recoilPositionTokens = selector({
  key: 'open_positions_tokens',
  get: ({get}) => {
    const list = get(recoilPositions);

    return Array.from(new Set(list.map(li => {
      return li.futureId
    }))).join("_");
  },
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



// 交易执行的 exeution fee
export const recoilExecutionFee = atom<string | BigNumber | number>({
  key: 'execution_fee',
  default: 2000000, //
});


// openInterests,
//                 globalUsdValues,
//                 fundingFees,
//                 borrowingFees,
//                 currentTokenAvailableLiq,

export type OpenInterestsType = {
  fundingFees: any;
  globalUsdValues: any;
  openInterests: any;
  borrowingFees: any;
  currentTokenAvailableLiq: any;

}

export const recoilOpenInterests = atom<OpenInterestsType>({
  key: 'open_interests',
  default: {
        openInterests: [],
        globalUsdValues: [],
        fundingFees: [],
        borrowingFees: [],
        currentTokenAvailableLiq: [],
  }
})