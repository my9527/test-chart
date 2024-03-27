"use client";
import styled from "styled-components";
import Modal from "@/app/components/Modal";
import clipboard from "copy-to-clipboard";
import html2canvas from "html2canvas";
import Image from "next/image";
import Logo from "@/app/assets/share/logo.svg";
import dayjs from "dayjs";
import TokenImage from "@/app/components/TokenImage";
import { ParamsProps } from "./AdjustMargin";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import { getLeverage } from "../../lib/getLeverage";
import { useMemo, useState, useEffect, useCallback } from "react";
import Bg from "@/app/assets/share/bg.svg";
import Tweet from "@/app/assets/share/tweet.svg";
import Telegram from "@/app/assets/share/telegram.svg";
import Copy from "@/app/assets/share/copy.svg";
import { filterPrecision } from "@/app/utils/tools";
import { TwitterShareButton, TelegramShareButton } from "react-share";
import BtnLoading from "@/app/components/BtnLoading";

const Wrapper = styled.div`
  margin-top: 10px;
  border-radius: 8px;
  border: ${(props) => `1px solid ${props.theme.colors.fill2}`};
  background: ${(props) => props.theme.colors.fill1};
  height: 340px;
  position: relative;
`;
const BgImage = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const Header = styled.div`
  padding: 20px 18px 10px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  .time {
    color: ${(props) => props.theme.colors.primary2};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.min};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  }
`;
const Symbol = styled.div`
  padding: 10px 18px 0px 18px;
  display: flex;
  align-items: center;
  gap: 6px;

  .symbol_name {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header2};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
  }
  .future_type,
  .leverage {
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  }
  .future_type_long,
  .leverage_long {
    color: ${(props) => props.theme.colors.text2};
  }
  .future_type_short,
  .leverage_short {
    color: ${(props) => props.theme.colors.text5};
  }
  img {
    border-radius: 50%;
  }
`;
const Rate = styled.div`
  padding: 10px 18px 10px 18px;
  font-family: Arial;
  font-size: 60px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  .up {
    color: ${(props) => props.theme.colors.text2};
  }

  .down {
    color: ${(props) => props.theme.colors.text5};
  }
`;
const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  .link {
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.min};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    padding-left: 18px;
    padding-bottom: 10px;
    border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  }
  .price {
    padding: 10px 18px 15px 18px;
    display: flex;
    align-items: center;
    gap: 40px;
    .item {
      .label {
        color: ${(props) => props.theme.colors.text4};
        margin-bottom: 5px;
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.min};
        font-style: normal;
        font-weight: 400;
        line-height: 120%;
      }
      .value {
        color: ${(props) => props.theme.colors.text1};
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.reguar};
        font-style: normal;
        font-weight: 400;
        line-height: 100%;
      }
      .mark {
        color: ${(props) => props.theme.colors.primary1};
      }
    }
  }
`;
const Btns = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  .btn {
    width: 110px;
    border-radius: 8px;
    border: ${(props) => `1px solid ${props.theme.colors.border1}`};
    background: ${(props) => props.theme.colors.fill3};
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
    height: 40px;
    cursor: pointer;
    .title {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
    }
    &:active {
      background: linear-gradient(90deg, #634aff 0%, #7e73ff 100%);
    }
  }
  .copy {
    position: relative;
  }
  .disabled {
    &:active {
      background: ${(props) => props.theme.colors.fill3};
    }
  }
`;
const CanvasWrapper = styled.div`
  width: 100%;
  height: 340px;
  margin-top: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 340px;
  }
`;
type TypeMap = { [key: string]: string };
type Params = {
  pnlPercent: string;
} & ParamsProps;
const Share: React.FC<{
  params: Params;
  visible: boolean;
  setVisible: Function;
}> = ({ visible, setVisible, params }) => {
  const futureTypeMap: TypeMap = { long: "Long", short: "Short" };

  const [loading, setLoading] = useState<boolean>(false);
  const [shareCanvas, setShareCanvas] = useState<string>("");
  const [copyText, setCopyText] = useState("Copy");
  const shareLink = `Quenta Perpetual Trading https://app.quenta.io/perpetual`;

  const loadCanvas = useCallback(async () => {
    const capture = window.document.querySelector("#capture") as HTMLElement;
    if (!capture) return;

    const canvas = (
      await html2canvas(capture, {
        useCORS: true,
        scale: 2,
        width: capture.getBoundingClientRect().width,
        height: capture.getBoundingClientRect().height,
        backgroundColor: null,
      })
    ).toDataURL("image/png");

    setShareCanvas(canvas);
  }, []);

  const onClose = () => {
    setVisible(false);
  };

  const timestamp = dayjs().format("YYYY-MM-DD hh:mm");

  const curToken = useTokenByFutureId(params?.futureId);

  const leverage = useMemo(() => {
    return getLeverage({
      size: params?.tokenSize,
      price: params?.entryPriceReadable,
      margin: params?.collateralReadable,
      pnl: params?.pnl,
      fees: params?.feesReadable,
    });
  }, [
    params?.tokenSize,
    params?.entryPriceReadable,
    params?.collateralReadable,
    params?.pnl,
    params?.feesReadable,
  ]);

  const dataURLToBlob = (dataurl: string) => {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  const copyBlobToClipboard = (base64: string) => {
    return new Promise((resolve, reject) => {
      let blob = dataURLToBlob(base64);
      navigator.clipboard
        .write([
          new window.ClipboardItem({
            [blob.type]: blob,
          }),
        ])
        .then(
          () => {
            resolve(true);
          },
          () => {
            reject(new Error("failed"));
          }
        );
    });
  };

  const handleCopy = async () => {
    if (!loading) {
      setLoading(true);
      await loadCanvas();
      await copyBlobToClipboard(shareCanvas);
      setLoading(false);
      setCopyText("Copied");
      setTimeout(() => {
        setCopyText("Copy");
      }, 1000);
    }
  };
  return (
    <Modal
      height={460}
      onClose={onClose}
      visible={visible}
      title="Share"
      showFooter={false}
    >
      <Wrapper id="capture">
        <BgImage src={Bg} alt="" />
        <Content>
          <Header>
            <Image src={Logo} alt="" width={85} height={20} />
            <p className="time">{timestamp}</p>
          </Header>
          <Symbol>
            <TokenImage name={curToken?.symbolName} width={20} height={20} />
            <p className="symbol_name">{curToken?.symbolName}-USD</p>
            <p
              className={`leverage leverage_${
                params?.isLong ? "long" : "short"
              }`}
            >
              x{leverage}
            </p>
            <p
              className={`future_type future_type_${
                params?.isLong ? "long" : "short"
              }`}
            >
              {futureTypeMap[params?.isLong ? "long" : "short"]}
            </p>
          </Symbol>
          <Rate>
            <span className={`${+params?.pnlPercent < 0 ? "down" : "up"}`}>
              {params?.pnlPercent}%
            </span>
          </Rate>
          <Footer>
            <p className="link">app.quenta.io</p>
            <div className="price">
              <div className="item">
                <p className="label">Entry Price</p>
                <p className="value">
                  {filterPrecision(
                    params?.entryPriceReadable,
                    curToken?.displayDecimal
                  )}
                </p>
              </div>
              <div className="item">
                <p className="label">Mark Price</p>
                <p className="value mark">{params?.markPrice}</p>
              </div>
            </div>
          </Footer>
        </Content>
      </Wrapper>

      {/* {!loading && (
        <CanvasWrapper>
          {shareCanvas && <img src={shareCanvas} alt="icon" />}
        </CanvasWrapper>
      )} */}

      <Btns>
        <TwitterShareButton url={shareLink}>
          <div className="btn">
            <Image src={Tweet} alt="" />
            <p className="title">Tweet</p>
          </div>
        </TwitterShareButton>
        <TelegramShareButton url={shareLink}>
          <div className="btn">
            <Image src={Telegram} alt="" />
            <p className="title">Telegram</p>
          </div>
        </TelegramShareButton>
        <div
          className={`btn copy ${loading ? "disabled" : ""}`}
          onClick={handleCopy}
        >
          {!loading ? (
            <>
              <Image src={Copy} alt="" />
              <p className="title">{copyText}</p>
            </>
          ) : (
            <BtnLoading loading={loading} />
          )}
        </div>
      </Btns>
    </Modal>
  );
};
export default Share;
