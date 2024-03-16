import Button from "@/app/components/Button"
import styled from "styled-components"

const TableWrapper = styled.div<{ columnLen: number }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columnLen}, auto)`};
  column-gap: 28px;
  row-gap: 16px;
  padding: 10px 0;
`
const TableHeaderCell = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
`
const TableCell = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
  align-self: center;
`

type TColumnData = {
  title: string,
  dataKey?: string,
  render?: (row: any) => React.ReactNode
}
function Table ({ data, columns }: { data: { [key: string]: any }[], columns: TColumnData[] }) {
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
      {
        data.map((row, index) => {
          return columns.map((column, index) => {
            if (column.render) return column.render(row)
            return (
              <TableCell key={index}>
                {row[column.dataKey!]}
              </TableCell>
            )
          })
        })
      }
    </TableWrapper>
  )
}

export default Table