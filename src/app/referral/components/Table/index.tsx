import { useMemo } from "react"
import styled from "styled-components"

const TableWrapper = styled.div<{ columnLen: number }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columnLen}, auto)`};
  column-gap: 28px;
  row-gap: 20px;
  padding: 10px 0;
  margin-top: 15px;
`
const TableHeaderCell = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.colors.text4};
`
const TableCell = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.colors.text1};
  align-self: center;
`

type TColumnData = {
  title: string;
  dataKey?: string;
  render?: (row: any) => React.ReactNode;
};

type TRowData = {
  [key: string]: any;
};

type TTableProps = {
  data: TRowData[];
  columns: TColumnData[];
};
function Table ({ data, columns }: TTableProps) {

  const renderBodyCell = useMemo(() => {
    return data.flatMap((row, rowIndex) =>
      columns.map((column, columnIndex) => {
        if (column.render) {
          return column.render(row);
        }
        return <TableCell key={`${rowIndex}-${columnIndex}`}>{row[column.dataKey!]}</TableCell>;
      })
    );
  }, [data, columns]);
  return (
    <TableWrapper columnLen={columns.length}>
      {
        columns.map((column, index) => {
          return (
            <TableHeaderCell key={index}>
              {column.title}
            </TableHeaderCell>
          )
        })
      }
      { renderBodyCell }
    </TableWrapper>
  )
}

export default Table