
import { recoilProfileOverview } from "@/app/models";
import { createdUserInfo } from "@/app/models";
import { useRequest } from "ahooks";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useFetch } from "./useFetch";

export const useOverview = () => {
  const [profileOverview, setProfileOverview] = useRecoilState(
    recoilProfileOverview
  );

  const request = useFetch();


  const updateUserProfile = ({
    address,
    name,
    email,
    referral_code,
  }: {
    address: string;
    name?: string;
    email?: string;
    referral_code?: string;
  }) => {
    return request({
      url: "/get_or_create_user",
      method: "post",
      params: {
        address,
        name,
        email,
        referral_code,
      },
    });
  };
  const getOrCreateUser = async (address: string) => {
    if (typeof address !== "string") return Promise.reject("Invalid address");

    return request({
      url: `/get_or_create_user?address=${address}`,
      method: "get",
    });
  };
  const { run, loading, data, error } = useRequest(getOrCreateUser, {
    manual: true,
  });

  const {
    runAsync: updateUserRunAsync,
    run: updateUserRun,
    loading: updateUserLoading,
    data: updateUserData,
    error: updateUserError,
  } = useRequest(updateUserProfile, { manual: true });

  const saveUserProfile = (data: createdUserInfo) => {
    setProfileOverview(data);
  };

  useEffect(() => {
    if (data) {
      console.log("data", data);
      saveUserProfile(data?.data?.data);
    }
  }, [data]);

  return {
    updateUserRunAsync,
    updateUserRun,
    updateUserLoading,
    updateUserData,
    updateUserError,
    run,
    loading,
    data,
    error,
    profileOverview,
  };
};


