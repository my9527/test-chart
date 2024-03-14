import { CHAINS_ID } from "@/app/config/common";
// 多链配置
// : Record<CHAINS_ID, Record<string, `0x${string}` | string>>
const addressMap = {
  [CHAINS_ID.arbitrum]: {
    ARBAddress: "",
    DAIAddress: "0x98D1ACEC3CA81d6b01d6F6B33f7cb800116522E7",
    DelegationHubImplementationAddress:
      "0xb55d5117b201b6D86b2cAd704d6F870dA0091b8D",
    ExchangeManagerImplementationAddress:
      "0x58Df3564Cc4D845B281FF1Aa95414A9fd45d4983",
    LimitOrderImplementationAddress:
      "0x1eE7571CdE690d864529A2D1E59f0BCf14785e48",
    LiquidityPoolImplementationAddress:
      "0x92B6E31D77C520f750f580D51b0dD4C98c8F5307",
    LongAddress: "0xa0A2295b515455A4EB8F0A799051682BaeDe7337",
    MarketOrderImplementationAddress:
      "0xB780c61ec94A0DddECFe5cB75F4C2464a0aCf1c1",
    OptionAddress: "0xf7d4e383b67b4d6115dA054DA6e30CeBebfED71B",
    OptionManagerImplementationAddress:
      "0x26F8bE4d9da3B975e7cB01737895F464102326a0",
    SEXAddress: "0x9F914546ecD2b6603762aA658b6AcFAE73F3bF7C",
    SLPAddress: "0x92B6E31D77C520f750f580D51b0dD4C98c8F5307",
    ShortAddress: "0xE24e279933341a98b3a189885F14c5864B6AF371",
    SlpTokenAddress: "0x92B6E31D77C520f750f580D51b0dD4C98c8F5307",
    StopOrderImplementationAddress:
      "0x157446788c353c602a24DF0f96Cc1bD4C821E562",
    SwapManagerImplementation: "",
    USDAddress: "0xa99AE5d492E7A367256766ce32ee293D066Fc2DB",
    USDCAddress: "0xC1c8885101829548aF85CaAc735f8ed04a05FFE2",
    USDCEAddress: "0x2E533CFE4B8d724391C76DFb14A15A2Bf8D3e83c",
    USDTAddress: "0x2349Eff36144D997059404717833fBd6aCF94252",
    UpdateCollateralOrderImplementationAddress:
      "0x732db7ede560225A953b14e74163d77D15fd19d0",
    UserBalanceImplementationAddress:
      "0x7249Db0580B373F86D78F1ec78C86fe5642F5E77",
    WBTCAddress: "",
    WETHAddress: "",
    futureManager: "0xfE218B834173f2cdEB1Ea3217A56b9BCd70a405D",
    rWETHAddress: "",
    rebateContractAddress: "0xE6232Bb7C155BeBcfc338d5B5141fdb08636446B",
    stSEXAddress: "0xc8d02E6641cB3894A06C1922060EdB1089ba35A5",
    stSLPAddress: "0x0C1586dB44339DcA28b1226272708d1fA2E069E1",
  },
  [CHAINS_ID.zkfair]: {
    DelegationHubImplementationAddress:
      "0xDf68d8781d64bC934C0be4095772eA8b2114FcAa",
    futureManager: "0x0E37b6c97fB31F0b0Db1d510D59CdCCDe793EB9F",
    stSLPAddress: "0x20e1d19fE3d89668de946e9fd6e25dcD269aD059",
    stSEXAddress: "",
    USDAddress: "0xEE43369197F78CFDF0D8fc48D296964C50AC7B57",
    UserBalanceImplementationAddress:
      "0x6F2B6796286B83cA46D4C4F19A3FaE4f58ae11D1",
    USDCAddress: "0xD33Db7EC50A98164cC865dfaa64666906d79319C",
    WETHAddress: "",
    WBTCAddress: "",
    rWETHAddress: "",
    LimitOrderImplementationAddress:
      "0x37116988bCfaD8bc54f671950F2b1561CF030F96",
    MarketOrderImplementationAddress:
      "0x6C000776979075DF04C99928FE9Dcf4036B3d942",
    StopOrderImplementationAddress:
      "0x92445994ac7F18420819B8230592F5ABa9A24cFd",
    UpdateCollateralOrderImplementationAddress:
      "0xA8fc3Dd52532Cc3788c536E7fFB68e83DB9aD006",
    LongAddress: "0xeD0B0AdB05D35cfe48C1e2a9d68A9f861F64a96c",
    ShortAddress: "0x46DbD669dB03561C8B921ea0C7EC404941E43101",
    ExchangeManagerImplementationAddress:
      "0x8398A6bCe3e8681AdBF532dD339A951315b4BFCE",
    SwapManagerImplementation: "",
    LiquidityPoolImplementationAddress:
      "0x38b0Fef032c4fC0aAF2900Cdd6F83761FA662318",
    OptionManagerImplementationAddress:
      "0x3C3Ae736aE9c76307682627B87D8e0A0006F524b",
    OptionAddress: "0x6ac91C0C5f609c77288C90d20A84Af4e9cc2ba87",
    SlpTokenAddress: "0x38b0Fef032c4fC0aAF2900Cdd6F83761FA662318",
    DAIAddress: "",
    USDTAddress: "",
    rebateContractAddress: "0x3f34e34F983e4508d8d6412ADAbCcED6d93C4188",
    SEXAddress: "0x825b4244684d5A07fCeF8124D9B21FD868b39654",
    SLPAddress: "0x38b0Fef032c4fC0aAF2900Cdd6F83761FA662318",
    USDCEAddress: "",
    xHPX: "0x4F2811c7A3Bd088f8A4dEC976dd2960Fd2F30E43",
    HPXSwap: "0x5Cc24515A769521203aF6E843b7Fb6EFcD4cecFB",
    HPXRefund: "0x00939a0958596C468f74d66B1fEeE4b3F73F7f6c",
  },
  [CHAINS_ID.zkfairtest]: {
    DelegationHubImplementationAddress: '0xc86CB5587016ac3Ffa8dBe91B937cf24A537b9be',
      futureManager: '0xe6eddD71722cc813B0aF6E393faEE5fa3a12059B',
      stSLPAddress: '0xdB220487BA199dF9aDa2C19cb31941213Bbbb3Ae',
      stSEXAddress: '',
      USDAddress: '0x3d8b1e65717835aA5C04D9EAa78Df547Cce48B5C',
      UserBalanceImplementationAddress: '0xAE8f09FEc122df0DdF39DB2E7E732558A13c80D4',
      USDCAddress: '0x1C72f448E5B76c1840C4d9342B6FcE5aF15e293b',
      WETHAddress: '',
      WBTCAddress: '',
      rWETHAddress: '',
      LimitOrderImplementationAddress: '0xaab6e52be66B8383064402e9A1A7f34AB3c51898',
      MarketOrderImplementationAddress: '0x2a7B035105951cc2de30D73B2Cd2Fc75D11939D3',
      StopOrderImplementationAddress: '0x77b889E4BB2E4D60FfA02dD0E1808D71b74f6244',
      UpdateCollateralOrderImplementationAddress: '0xF00b99E4c19D1BA3cEEE90faaB9b981355fA2034',
      LongAddress: '0xb1BD7C4B413ca14d37B2F498BA5425866C3b603a',
      ShortAddress: '0x88Df9165f39F411F10Cd50f0dEB5343Da9A37B1c',
      ExchangeManagerImplementationAddress: '0xD749E5958c4d72a18BD5BB6aC643FA9509E8222D',
      SwapManagerImplementation: '',
      LiquidityPoolImplementationAddress: '0x797dE8FBae10A047fe7348De5667e13c4529F708',
      OptionManagerImplementationAddress: '0x5DeDF6323aDfb86Efd164600BC1Df868d7708099',
      OptionAddress: '0x97B0b13f975505Aa27aFd2B9df5b6f042f5F5Fdc',
      SlpTokenAddress: '0x797dE8FBae10A047fe7348De5667e13c4529F708',
      DAIAddress: '',
      USDTAddress: '',
      rebateContractAddress: '0x76D8a725AF8b8f0D371238839135B1490AF83FC4',
      SEXAddress: '0x41325a0a86582c60837A0C58960A9f64B8141Cc7',
      SLPAddress: '0x797dE8FBae10A047fe7348De5667e13c4529F708',
      USDCEAddress: '',
      xHPX: '0x2F4C40Ae105E03C885efd466b3330495238dbA14',
      HPXSwap: "0x7b8870B4D5d6Ed49181366Ed8135D1EEcE6D2937",
      HPXRefund: "0x7A2e017F2F5fB6ff60069E7Af49fffec86e96d9D"
  },
};

export default addressMap;
