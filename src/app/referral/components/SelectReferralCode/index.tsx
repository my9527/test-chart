import Modal from "@/app/components/Modal";
import styled from "styled-components";
import LinearGradientButton from '@/app/components/LinearGradientButton'
import FlexBox from "@/app/components/FlexBox";
import { useState } from "react";
import { CreateNewCode } from "../CreateNewCode";
import Table from "../../../components/Table";
import Button from '../Button'
import { EditNoteModal } from "../EditNoteModal";

const CreateCodeButton = styled.div`
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border1};
  background: ${({ theme }) => theme.colors.fill1};
  color: ${({ theme }) => theme.colors.text1};
  display: inline-flex;
  gap: 5px;
  cursor: pointer;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.medium};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary1};
    color: ${({ theme }) => theme.colors.primary1};

    path {
      stroke: ${({ theme }) => theme.colors.primary1};
    }
  }
`

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSize.medium};
  color: ${({ theme }) => theme.colors.text4};
`
 
type SelectReferralCodeProps = {
  visible: boolean;
  onClose?: Function;
  onConfirm?: Function;
  onCancel?: Function;
};
export const SelectReferralCode = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
}: SelectReferralCodeProps) => {
  const [createNewCodeVisible, setCreateNewCodeVisible] = useState(false)
  const [editNoteVisible, setEditNoteVisible] = useState(false)


  const handleClickEdit = () => {
    setEditNoteVisible(true)
  }

  const data = [
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: true,
      default: true,
    },
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: false,
      default: false,
    },
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: false,
      default: false,
    },
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: false,
      default: false,
    },
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: false,
      default: false,
    },
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: false,
      default: false,
    },
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: false,
      default: false,
    },
    {
      code: 'ABC123456',
      yourRebate: 10,
      friendRebate: 20,
      note: '4892348937289473',
      canEdit: false,
      default: false,
    }
  ]

  const columns = [
    {
      dataKey: 'code',
      title: 'Code',
    },
    {
      dataKey: 'yourRebate',
      title: 'Your rebate',
      primary: true,
    },
    {
      dataKey: 'friendRebate',
      title: "Friends's rebate",
      primary: true,
    },
    {
      dataKey: 'note',
      title: "Note",
      render: (row: { [key: string]: any }) => {
        return row.canEdit ? (
          <Button padding="1px 20px" onClick={handleClickEdit}>Edit</Button>
        ) : (
          <Label>{row.note}</Label>
        )
      }
    },
    {
      title: "Action",
      render: (row: { [key: string]: any }) => {
        return !row.default ? (
          <Button padding="1px 10px">Set as default</Button>
        ) : (
          <Label>Default</Label>
        )
      }
    }
  ]
  return (
    <Modal
      onClose={onClose}
      visible={visible}
      title="Select Referral Code"
      onConfirm={onConfirm}
      onCancel={onCancel}
      showCancelBtn={false}
      width={740}
      overlayColor="rgba(0, 0, 0, 0.5)"
      footer={
        <FlexBox justify="space-between">
          <CreateCodeButton role="button" onClick={() => setCreateNewCodeVisible(true)}>
            Create Code
            <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
              <path d="M0.5 7.18182H12.5M6.5 1V13" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </CreateCodeButton>
          <LinearGradientButton height={28} minWidth={90}>
            Confirm
          </LinearGradientButton>
        </FlexBox>
      }
    >
      <Table 
        data={data} 
        columns={columns} 
        hasThBorder
      />
      <CreateNewCode 
        visible={createNewCodeVisible} 
        onClose={() => setCreateNewCodeVisible(false)} 
        onCancel={() => setCreateNewCodeVisible(false)} 
      />
      <EditNoteModal 
        visible={editNoteVisible} 
        onClose={() => setEditNoteVisible(false)} 
        onCancel={() => setEditNoteVisible(false)} 
      />
    </Modal>
  );
};