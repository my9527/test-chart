import { FC, cloneElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Row } from "../Row";
import { Col } from "../Col";



const Wrapper = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    
    path {
        fill: ${(props) => props.theme.colors.text4};
    }
    .active-path {
        // fill: ${(props) => props.theme.colors.primary1}!important;
        fill: red!important;
    }
`;


type SortDirection = 'desc' | 'asc' | '';

const sortDirectionArr: SortDirection[] = ['desc', 'asc', '']

/**
 *  可以排序的label
 * 
 * @param param0 
 * @returns 
 */

export const IconSort: FC<{  initial?: SortDirection, onChange?: AnyFunc, label: React.ReactElement, active:boolean }> = ({ initial = '', onChange = () => {}, label, active = false }) => {


    const [sort, updateSort] = useState<SortDirection>(initial);
    const sortRef = useRef<SortDirection>(sort);


    useEffect(() => {
        sortRef.current = sort;
    }, [sort]);
    
    
    const handleChangeSort = useCallback((nextSort: SortDirection) => {
        // updateSort()
        updateSort(nextSort);
        onChange(nextSort); 
    }, []);

    const Label = useMemo(() => {
        return cloneElement(label, {
            onClick: () => {
                const curIndex = sortDirectionArr.findIndex((s) => s === sortRef.current);

                const nextSort = sortDirectionArr[(curIndex + 1) % sortDirectionArr.length];
                console.log('nextsort', nextSort);
                handleChangeSort(nextSort);

            }
        })
    }, []);



    return (
        <Wrapper>
            <Row gap="5px">
                {Label}
                <Col gap="1px">
                    <svg onClick={() => handleChangeSort('asc')} xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 6" fill="none">
                        <path className={active && sort === 'asc' ? 'active-path' : ''} d="M8.90276 4.57036L5.17109 0.0960542C5.06428 -0.0320181 4.85861 -0.0320181 4.75066 0.0960542L1.01899 4.57036C0.880361 4.7372 1.00536 4.9816 1.22921 4.9816H8.69254C8.9164 4.9816 9.04139 4.7372 8.90276 4.57036Z" fill-opacity="0.5" />
                    </svg>
                    <svg onClick={() => handleChangeSort('desc')} xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 6 9 6" fill="none">
                        <path className={active && sort === 'desc' ? 'active-path' : ''} d="M8.69254 7.0184H1.22921C1.00536 7.0184 0.880361 7.2628 1.01899 7.42964L4.75066 11.9039C4.85747 12.032 5.06314 12.032 5.17109 11.9039L8.90276 7.42964C9.04139 7.2628 8.9164 7.0184 8.69254 7.0184Z"  fill-opacity="0.5" />
                    </svg>
                </Col>
            </Row>
        </Wrapper>
    );
}