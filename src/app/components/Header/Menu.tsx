"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import { useRouter } from "next/navigation";
import { menus } from "@/app/config/menu";
import { useAccount } from "wagmi";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useFetch } from "@/app/hooks/useFetch";
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Item = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    .arrow {
      transform: rotate(180deg);
    }
  }
  .label {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
  }
`;
const Menu = () => {
  const router = useRouter();

  const { address } = useAccount();

  const request = useFetch();

  const handleFaucet = async () => {
    
    if (!address) return;
    // @ts-ignore
    window?.grecaptcha?.enterprise?.ready?.(async () => {
      try {
        // @ts-ignore
        const token = await window?.grecaptcha?.enterprise?.execute?.('6Lck5V0nAAAAABUIx8PkVTKxvII3cM3z-di43-Vg', {
          action: 'FAUCET',
        });

        const url = `/mint_tokens?address=${address}`;
        await request({
          url,
          headers: {
            grecaptcha: token,
          }
        })
      
      } catch (e: any) {
        console.log("error: ", e);
      }

    });

    return;
  };

  return (
    <Wrapper>
      {menus.map((item) => {
        return (
          <Item
            key={item.key}
            onClick={() => {
              router.push(item?.route);
            }}
          >
            <p className="label">{item?.label}</p>
            {item?.showArrow && (
              <Image
                src={ArrowIcon}
                width={8}
                height={4}
                alt=""
                className="arrow"
              />
            )}
          </Item>
        );
      })}
      <Item onClick={handleFaucet} >
      <p className="label">faucet</p>
      </Item>
    </Wrapper>
  );
};
export default Menu;
