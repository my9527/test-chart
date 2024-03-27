import FlexBox from "@/app/components/FlexBox";
import Modal from "@/app/components/Modal";
import Slider from "@/app/perpetual/components/Slider";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { TextField } from "../TextField";
import Checkbox from "../Checkbox";
import BigNumber from "bignumber.js";

const Title = styled.div`
  font-size: ${({ theme }) => theme.fontSize.medium};
  color: ${({ theme }) => theme.colors.text1};
  margin: 7px 0;
`

const Ration = styled.div`
  background-color: ${({ theme }) => theme.colors.fill3};
  border-radius: 8px;
  padding: 10px 15px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.div`
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.colors.text4};
`

const Value = styled.div`
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.colors.primary1};
`
const SliderWrapper = styled.div`
  margin-top: 16px;
`


type CreateNewCodeProps = {
  visible: boolean;
  onClose?: Function;
  onConfirm?: Function;
  onCancel?: Function;
};
export const CreateNewCode = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
}: CreateNewCodeProps) => {
  const totalRation = 50;
  const yourRation = 0;
  const [ratio, setRatio] = useState(0);
  const [note, setNote] = useState("");
  const [defaultChecked, setDefaultChecked] = useState(false);

  /** 固定三等分 */
  const marks = useMemo(() => {
    return [
      {
        label: "",
        value: 1,
      },
      {
        label: "",
        value: Math.ceil( totalRation / 3),
      },
      {
        label: "",
        value: Math.ceil( totalRation / 3 * 2),
      },
      {
        label: "",
        value: totalRation,
      },
    ]
  }, [totalRation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  }


  const handleConfirm = () => {
    const data = { ratio, note, defaultChecked }
    onConfirm && onConfirm(data);
  }

  function clear() {
    setRatio(0);
    setNote("");
    setDefaultChecked(false);
  }

  const handleCancel = () => {
    clear();
    onCancel && onCancel();
  }
  return (
    <Modal
      onClose={onClose}
      visible={visible}
      title="Create a New Code"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      overlayColor="rgba(0, 0, 0, 0.5)"
    >
      <Title>Set rebate split</Title>
      <Ration>
        <FlexBox justifyContent="space-between">
          <Label>Total rebate ratio:</Label>
          <Value>{totalRation}%</Value>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <Label>Yours / Friends&apos;:</Label>
          <Value>{`${ratio}%/${totalRation - ratio}%`}</Value>
        </FlexBox>
        <SliderWrapper>
          <Slider 
            min={0} 
            max={totalRation} 
            onChange={setRatio}
            value={BigNumber(ratio).toString()}
            marks={marks}
            unit="%"
            per={50}
          />
        </SliderWrapper>
      </Ration>
      <Title>Add a note</Title>
      <TextField
        placeholder="20 characters or fewer."
        height={42}
        value={note}
        onChange={handleChange}
      />
      <FlexBox justifyContent="space-between" alignItems="center">
        <Title>Set as default</Title>
        <Checkbox padding={2} checked={defaultChecked} onChange={setDefaultChecked} />
      </FlexBox>
    </Modal>
  );
};