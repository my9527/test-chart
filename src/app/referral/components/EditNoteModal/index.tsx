import Modal from "@/app/components/Modal";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { TextField } from "../TextField";


const Label = styled.div`
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.colors.text1};
  margin-top: 10px;
`


type EditNoteProps = {
  visible: boolean;
  onClose?: Function;
  onConfirm?: Function;
  onCancel?: Function;
};
export const EditNoteModal = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
}: EditNoteProps) => {
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
        placeholder="Edit note"
        height={42}
        value={note}
        onChange={handleChange}
      />
      <Label>20 characters or fewer.</Label>
    </Modal>
  );
};