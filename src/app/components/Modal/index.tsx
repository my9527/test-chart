"use client";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import CloseIcon from "./CloseIcon";
import { ReactElement, cloneElement, useCallback, useMemo, useState } from "react";

const ModalWrapper = styled(motion.div)<{ $overlayColor?: string }>`
  position: fixed;
  background: ${props => props.$overlayColor || "transparent"};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
type Props = {
  width?: number | string;
  height?: number | string;
};
const ModalBody = styled.div<Props>`
  border-radius: 8px;
  border: ${(props) => `1px solid ${props.theme.colors.fill2}`};
  background: ${(props) => props.theme.colors.fill2};
  width: ${(props) => (props?.width === "auto" ? "auto" : props?.width + "px")};
  height: ${(props) =>
    props?.height === "auto" ? "auto" : props?.height + "px"};
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  padding-bottom: 10px;
  .title {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header2};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
  }
  svg {
    flex-shrink: 0;
    cursor: pointer;
    &:hover,
    &:active {
      path {
        fill: ${(props) => props.theme.colors.primary1};
      }
    }
  }
`;
const Content = styled.div`
  flex: 1;
  overflow: auto;
`;
const Footer = styled.div`
  border-top: ${(props) => `1px solid ${props.theme.colors.border1}`};
  padding-top: 15px;
`;
const Btns = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 11px;
`;
const Button = styled.div`
  border-radius: 999px;
  padding: 9px 21px;
  min-width: 90px;
  display: inline-block;
  cursor: pointer;

  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
`;
const ConfirmBtn = styled(Button)`
  background: linear-gradient(90deg, #634aff 0%, #7e73ff 100%);
  &:hover {
    background: ${(props) => props.theme.colors.primary1};
  }
`;
const CancelBtn = styled(Button)`
  border: ${(props) => `1px solid ${props.theme.colors.fill3}`};
  background: ${(props) => props.theme.colors.fill3};
`;
const Modal: React.FC<{
  className?: string;
  width?: number|string;
  height?: number|string;
  visible: boolean;
  onClose?: Function;
  showHeader?: boolean;
  showFooter?: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  confirmBtnText?: string;
  cancelBtnText?: string;
  showCancelBtn?: boolean;
  onConfirm?: Function;
  onCancel?: Function;
  /** 遮罩颜色 */
  overlayColor?: string;
}> = ({
  width = 400,
  height = 400,
  visible,
  onClose,
  title,
  showHeader = true,
  showFooter = true,
  children,
  footer,
  confirmBtnText = "Confirm",
  cancelBtnText = "Cancel",
  showCancelBtn = true,
  onConfirm,
  onCancel,
  overlayColor,
  className,
}) => {

  const [loading, updateLoading] = useState(false);

  const handleConfirm = useCallback(() => {
    async function run() {
      updateLoading(true);
      if(onConfirm){
        await onConfirm();
      }
      updateLoading(false);
    }
    return run();
    
  }, [onConfirm]);


  return visible
    ? createPortal(
        <ModalWrapper $overlayColor={overlayColor} className={className}>
          <ModalBody width={width} height={height}>
            {showHeader && (
              <Header>
                <p className="title">{title}</p>
                <CloseIcon
                  onClick={() => {
                    onClose && onClose();
                  }}
                />
              </Header>
            )}
            <Content>{children}</Content>
            {showFooter && (
              <Footer>
                {footer ? (
                  footer
                ) : (
                  <Btns>
                    {showCancelBtn && (
                      <CancelBtn onClick={() => onCancel && onCancel()}>
                        <div className="label">{cancelBtnText}</div>
                      </CancelBtn>
                    )}
                    <ConfirmBtn
                      onClick={handleConfirm}
                    >
                      <div className="label">{confirmBtnText} {loading ? '...' : ''}</div>
                    </ConfirmBtn>
                  </Btns>
                )}
              </Footer>
            )}
          </ModalBody>
        </ModalWrapper>,
        window.document.body,
      )
    : null;
};
export default Modal;
