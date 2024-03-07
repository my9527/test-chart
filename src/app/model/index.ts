import { atom } from "recoil";

export const recoilGlobalMessage = atom<any>({
    key: "globalMessage",
    default: {},
});
