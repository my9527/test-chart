import { useMemo } from "react"
import styled, { css } from "styled-components"

type TCellProps = { width: string, borderColor?: string, height: number, align?: string, primary?: boolean, fontSize?: string, hasBorder?: boolean, secondary?: boolean };

const TableWrapper = styled.table`
  width: 100%;
`
const TableHeaderCell = styled.th<TCellProps>`
  font-size: ${props => props.fontSize || props.theme.fontSize.small};
  color: ${props => props.primary ? props.theme.colors.primary1 : props.theme.colors.text4};
  width: ${props => props.width};
  height: ${props => props.height || 40}px;
  text-align: ${props => props.align || 'left'};
  font-weight: normal;
  ${props => !!props.borderColor && css`
    border-bottom: 1px solid ${props.borderColor};
  `}
  ${props => props.hasBorder && css`
    border-bottom: 1px solid ${props.theme.colors.border1};
  `}
`
const TableCell = styled.td<TCellProps>`
  font-size: ${props => props.fontSize || props.theme.fontSize.medium};
  color: ${props => props.primary ? props.theme.colors.primary1 : (props.secondary ? props.theme.colors.text4 : props.theme.colors.text1)};
  text-align: ${props => props.align || 'left'};
  width: ${props => props.width};
  ${props => !!props.borderColor && css`
    border-bottom: 1px solid ${props.borderColor};
  `}
  ${props => props.hasBorder && css`
    border-bottom: 1px solid ${props.theme.colors.border1};
  `}
`

type TColumnData = {
  title: string;
  dataKey?: string;
  render?: (row: any) => React.ReactNode;
  width?: string;
  primary?: boolean;
  headerPrimary?: boolean;
  align?: string;
  secondary?: boolean;
};

type TRowData = {
  [key: string]: any;
};

type TTableProps = {
  data: TRowData[];
  columns: TColumnData[];
  headerBorderColor?: string;
  bodyBorderColor?: string;
  headerCellHeight?: number;
  bodyCellHeight?: number;
  headerFontSize?: string;
  bodyFontSize?: string;
  hasThBorder?: boolean;
  hasTdBorder?: boolean;
};
function Table ({ 
  data, 
  columns, 
  headerBorderColor, 
  bodyBorderColor, 
  headerCellHeight = 40,
  bodyCellHeight = 40, 
  headerFontSize,
  bodyFontSize,
  hasThBorder,
  hasTdBorder,
}: TTableProps) {

  const defaultColumnWidth = useMemo(() => {
    return `${Math.floor(100 / columns.length)}%`;
  }, [columns]);

  const renderBodyCell = useMemo(() => {
    return data.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {
          columns.map((column, columnIndex) => {
            return (
              <TableCell 
                secondary={column.secondary} 
                hasBorder={hasTdBorder} 
                fontSize={bodyFontSize} 
                align={column.align} 
                height={bodyCellHeight} 
                borderColor={bodyBorderColor} 
                primary={column.primary} 
                width={column.width || defaultColumnWidth} 
                key={`${rowIndex}-${columnIndex}`}
              >
                {column.render ? column.render(row) : row[column.dataKey!]}
              </TableCell>
            );
          })
        }
      </tr>
    ));
  }, [data, columns, defaultColumnWidth, bodyCellHeight, bodyBorderColor, bodyFontSize, hasTdBorder]);

  return (
    <TableWrapper>
      <thead>
        <tr>
          {
            columns.map((column, index) => {
              return (
                <TableHeaderCell 
                  secondary={column.secondary} 
                  hasBorder={hasThBorder} 
                  fontSize={headerFontSize} 
                  primary={column.headerPrimary} 
                  align={column.align} 
                  height={headerCellHeight} 
                  borderColor={headerBorderColor} 
                  width={column.width || defaultColumnWidth} 
                  key={index}
                >
                  {column.title}
                </TableHeaderCell>
              )
            })
          }
        </tr>
      </thead>
      <tbody>
       { renderBodyCell }
      </tbody>
    </TableWrapper>
  )
}

export default Table