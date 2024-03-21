import { AtomEffect, DefaultValue, atom, selector } from "recoil";
import { Token } from "../config/tokens";
import { Address } from "viem";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

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
 * position 长度
 */
export const recoilPositionNums = selector({
  key: 'open_positions_length',
  get: ({get}) => {
    const list = get(recoilPositions);

    return list.length;
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
});


export type LPInfoType = {
  poolAmount: number | string;
  poolLockedAmount: number | string;
}

export const recoilLPInfo = atom<LPInfoType>({
  key: 'lp_info',
  default: {
    poolAmount: 0,
    poolLockedAmount: 0,
  }
})


/**
 * 钱包链接侧边栏是否打开
 */
export const recoilWalletConnectPanel = atom<boolean>({
  key: 'wallet_connect_panel',
  default: false,
})



type FutureOrderType = {
    orders: any[],
    validOrders: any[],
    inValidOrders: any[]
}

export const recoilFutureOrders = atom<FutureOrderType>({

  key: 'future_orders',
  default: {
    orders: [],
    validOrders: [],
    inValidOrders: []
  },
})

export const recoilFutureLimitOrMarketOrders = selector({
  key: 'future_orders_limit',
  get: ({get}) => {
    const { validOrders } = get(recoilFutureOrders);

    return validOrders.filter(order => {
      return ['increaseMarketOrders', 'increaseLimitOrders', 'decreaseLimitOrders', 'decreaseMarketOrders'].includes(order.type);
    })
    // .sort((a, b) => b.futureId - a.futureId);
  },
});

export const recoilFutureStopOrders = selector({
  key: 'future_orders_stop',
  get: ({get}) => {
    const { validOrders } = get(recoilFutureOrders);

    return validOrders.filter(order => {
      return ['futureStopOrders'].includes(order.type);
    });
  },
});



export const recoilOrdersLen = selector({
  key: 'future_orders_len',
  get:({ get }) => {
    const positionList = get(recoilPositions);
    const limitList = get(recoilFutureLimitOrMarketOrders);
    const stopList = get(recoilFutureStopOrders);

    return {
      position: positionList.length,
      limit:  limitList.length,
      stop: stopList.length,
      history: 0,
    }

  }
});


/**
 * 交易页面当前的币种, 如果没有，将默认为ETH
 */
export const recoilPerpetualToken = atom<string>({
  key: 'perpetual_token',
  default: ''
});



type WalletBalanceType = {
  balance?: string;
  balanceReadable: string
}

type BalanceAndPoolType= {
  walletBalance: Record<string, WalletBalanceType>;
  exchangeBalance: Record<string, WalletBalanceType>;
  epoch: string | number | undefined;
  stableTokenPrice: Record<`0x${string}`, {
    deposit: {
      balance: string | number;
      balanceReadable: string | number;
    };
    withdraw: {
      balance: string | number;
      balanceReadable: string | number;
    };
    poolBalance: {
      balance: string | number;
      balanceReadable: string | number;
    },
  }>;

  availableLp: {
    futureLong: string;
    futureShort: string;
    option: string;
    futureTotalUsdAvailableReadable: string;
    totalUsdAvailableReadable: string;
  }
}


export const recoilBalanceAndPool = atom<BalanceAndPoolType>({
  key: 'balance_pool',
  default: {
    walletBalance: {
      balanceReadable: '0',
    },
    exchangeBalance: {
      balanceReadable: '0',
    },
    epoch: '',
    availableLp: {
      futureLong: '0',
      futureShort: '0',
      option: '0',
      futureTotalUsdAvailableReadable: '0',
      totalUsdAvailableReadable: '0',
    },
    stableTokenPrice: {},
  
  }
})


export const recoilLpEpochEndTime = atom<any>({
  key: 'lpEpochEndTime',
  default: {
    timestamp: NaN,
    format: '-',
    startTime: '-',
  },
});
