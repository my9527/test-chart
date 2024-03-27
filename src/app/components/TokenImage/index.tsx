"use client";
import Image from "next/image";

const TokenImage: React.FC<{
  name: string;
  width?: number;
  height?: number;
}> = ({ name, width = 15, height = 15 }) => {

  const src = '/tokens/'+ name + '.png';
  return (
    <Image src={src}  alt="" width={width} height={height} />
  );
};
export default TokenImage;
