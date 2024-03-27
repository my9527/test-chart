const ROUTE_PATHS = {
  Trade: "/perpetual/ETH",
  Portfolio: "/portfolio",
  Token: "/token",
  Referrals: "/referral",
  Stats: "/stats",
  Rewards: "/rewards",
};

export const menus = [
  { label: "Trade", key: "trade", route: ROUTE_PATHS.Trade, showArrow: false },
  { label: "Portfolio", key: "portfolio", route: ROUTE_PATHS.Portfolio, showArrow: false },
  { label: "Token", key: "token", route: "", showArrow: true },
  { label: "Referrals", key: "referrals", route: ROUTE_PATHS.Referrals, showArrow: false },
  { label: "Stats", key: "stats", route: ROUTE_PATHS.Stats, showArrow: false },
  { label: "More", key: "more", route: "", showArrow: true },
  { label: "Rewards", key: "rewards", route: ROUTE_PATHS.Rewards, showArrow: false },
];
