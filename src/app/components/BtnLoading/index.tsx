"use client";
import styled from "styled-components";
import Loading from "@/app/assets/btn/loading.svg";
import Image from "next/image";
import { useEffect, useRef } from "react";

const Wapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const BtnLoading: React.FC<{
  loading: boolean;
}> = ({ loading }) => {
  const ref: any = useRef(null);
  useEffect(() => {
    let timer: any = null,
      num = 1;

    if (loading && ref?.current) {
      timer = setInterval(() => {
        const deg = 45 * num > 360 ? 45 * (num % 8) : 45 * num;
        ref.current.style.transform = `rotate(-${deg}deg)`;
        num += 1;
      }, 300);
    } else {
      timer && clearInterval(timer);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [loading, ref?.current]);
  return (
    <Wapper>
      <Image src={Loading} alt="" width={20} height={20} ref={ref} />
    </Wapper>
  );
};
export default BtnLoading;
