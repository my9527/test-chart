import { Row } from "@/app/components/Row";
import { TokenById } from "@/app/components/Token";
import { recoilPositions } from "@/app/models";
import { useRecoilValue } from "recoil";
import styled from "styled-components";





const Wrapper = styled(Row)`

table{
    width: 100%;
    tr{
        border-bottom: 1px solid ${(props) => props.theme.colors.border1};
    }
    td {
        width: 140px;
        color: var(--white, #FAFAFA);
        font-family: Arial;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
    }
}

.header{
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header3};
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
}
`;

const Headers = [{
    title: 'Symbol',
    key: 'symbol',
}, {
    title: 'Size',
    key: 'size',
},{
    title: 'Mark Price',
    key: 'marketPrice',
}, {
    title: 'Entry Price',
    key: 'entryPrice'
},{
    title: 'Unreallzed PnL(%)',
    key: 'pnl'
},{
    title: 'Margin',
    key: 'collotral'
},{
    title: 'Est.liq.Proce',
    key: 'liqPrice'
},{
    title: 'TP/SL',
    key: 'tpsl'
},{
    title: 'Action',
    key: 'action'
}];



export const PositionList = () => {


    const openPositions = useRecoilValue(recoilPositions);
    
    
    return (
        <Wrapper>
            <table>
                <thead>
                    <th>
                        {Headers.map(h=> {
                            return (
                                <td className="thead-td">
                                    <div className="header">
                                        {h.title}
                                    </div>
                                </td>
                            );
                        })}
                    </th>
                </thead>
                <tbody>
                    {
                        openPositions.map((pos: any) => {
                            return <tr key={pos.id}>
                                <td>
                                    <div>
                                        <TokenById futureId={pos.futureId} />
                                    </div>
                                </td>
                                <td>
                                    {pos.tokenSize}
                                </td>
                                <td>
                                    {
                                     pos.markPrice
                                    }
                                </td>
                                <td>
                                    {pos.entryPrice}
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </Wrapper>
    );

}