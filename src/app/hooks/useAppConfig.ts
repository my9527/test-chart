import { useContext } from "react";
import { AppConfigContext } from "../context/AppConfigProvider";

export const useAppConfig = () => {
    
  const ctx = useContext(AppConfigContext);

  return ctx;
};
