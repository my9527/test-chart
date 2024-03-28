import Modal from "@/app/components/Modal";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { TextField } from "../TextField";


const Label = styled.div`
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.colors.text1};
  margin-top: 10px;
`


type BindReferralCodeProps = {
  visible: boolean;
  onClose?: Function;
  onConfirm?: Function;
  onCancel?: Function;
};
export const BindReferralCodeModal = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
}: BindReferralCodeProps) => {
  const [note, setNote] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  }

  const handleCancel = () => {
    setNote("");
    onCancel && onCancel();
  }

  const handleConfirm = () => {
    onConfirm && onConfirm(note);
  }
  return (
    <Modal
      onClose={onClose}
      visible={visible}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      overlayColor="rgba(0, 0, 0, 0.5)"
      showHeader={false}
      height={200}
    >
      <TextField
        placeholder="Input a referral code"
        height={42}
        value={note}
        onChange={handleChange}
      />
      <Label>Once this code is bound, it cannot be changed.</Label>
    </Modal>
  );
};