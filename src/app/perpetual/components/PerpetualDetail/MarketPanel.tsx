import styled from "styled-components";
import Image from "next/image";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import { FC, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Tabs from "../Tabs";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import { useClickAway } from "ahooks";
import { RemoveScroll } from "react-remove-scroll"
import { Row } from "@/app/components/Row";
import { createPortal } from "react-dom";
import { useIndexPrices } from "@/app/hooks/useIndexPrices";
import { useTokens, useTradeTokens } from "@/app/hooks/useTokens";
import { Col } from "@/app/components/Col";
import TokenImage from "@/app/components/TokenImage";
import { MacScrollbar } from "mac-scrollbar";
import { Scrollbar } from "@/app/components/ScrollBar";
import Input from "@/app/components/Input";
import { useRecoilState, useSetRecoilState } from "recoil";
import { recoilFavoriateList, recoilPerpetualToken } from "@/app/models";
import Link from 'next/link'

import FavoriteIcon from "@/app/assets/perpetual/favorite.svg";
import StarIcon from "@/app/assets/perpetual/star.svg";
import { useRouter } from "next/navigation";
import { IconSort } from "@/app/components/IconSort";
import { sortArrByKey } from "@/app/lib/common";
// import { useRouter } from "next/navigation";


const drawerConfig: HTMLMotionProps<any> = {
    initial: 'exit',
    animate: 'enter',
    exit: 'exit',
    variants: {
        exit: {
            opacity: 0,
            x: '-100%',
            transition: {
                duration: 0.2,
                ease: [0, 0, 0.2, 1],
            },
        },
        enter: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 1, 1],
            },
        },
    },
};

const FilterTypes = [{
    label: 'Favorite',
    key: 'fav'

}, {
    label: 'All',
    key: 'all'
}, {
    label: 'Layer2',
    key: 'layer2'
}, {
    label: 'Meme',
    key: 'meme'
}, {
    label: 'BRC-20',
    key: 'BRC-20'
}];

const MotiveDiv = styled(motion.div)`
position: fixed;
bottom: 10px;
left: 0;
min-width: 360px;
background: #1d1e21;
z-index: 1000;
display: flex;
flex-direction: column;
gap: 20px;
background: ${(props) => props.theme.colors.fill2};


.list-wrapper {
    position: relative;
    flex: 1;
    overflow: auto;
    
}
.list-header{
    position: sticky;
    top: 0;
    color: ${(props) => props.theme.colors.text1};
    text-align: center;

    /* small */
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
    background: ${(props) => props.theme.colors.fill2};
    padding: 4px 20px;
}

.token-name{
    color: ${(props) => props.theme.colors.text1};

    /* header0 */
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header0};
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 20px */
    width: 50%;
}
.token-price{
    color: ${(props) => props.theme.colors.text1};

    /* medium */
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
    width: 25%;
    text-align: left;
}
.token-change{
    text-align: center;
    color: ${(props) => props.theme.colors.text2};
    /* medium */
    font-family: Arial;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
    width: 25%;
    justify-content: flex-end;
    text-align: right;

    &.raise {
        color: ${(props) => props.theme.colors.text2};
    }
    &.desc {
        color: ${(props) => props.theme.colors.text5};
    }
}

.head-name{
    width: 50%;
    padding-left: 24px;
}
.head-change{
    justify-content: flex-end;
}
.head-price{
    text-align: left;
    justify-content: flex-start;
}
.head-price,.head-change{
    width: 25%;
}
.token-row{
    // style={{ padding: '0 20px' }}
    padding: 10px 20px;
    box-sizing: border-box;
    border-top: 1px solid ${(props) => props.theme.colors.border1};
    cursor: pointer;

    &:hover{
        background-color: ${(props) => props.theme.colors.fill1};
    }
}

.search-input{
    .input {
        height: 32px;
        border-radius: 32px;
        background: ${(props) => props.theme.colors.fill3};
        padding: 9px 10px;
        
    }
    .suffix{
        padding: 0 10px;
    }
}

.item-tag{
    border-radius: 999px;
    border: 1px solid ${(props) => props.theme.colors.primary1};
    background:${(props) => props.theme.colors.fill3};
    padding: 3px 15px;
    color: ${(props) => props.theme.colors.text1};
    /* small */
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
}
`

const SymbolWrapper = styled(Row)`
.icon-arrow {
    transition: all 0.38s ease-out;
}
.active-icon-arrow{
    transform: rotate(-90deg);

}
`


const MarketsListHeads = [{
    key: 'name',
    label: 'Pair & Tag'
}, {
    key: 'price',
    label: 'Price',
    sortable: true,
}, {
    key: 'change',
    label: 'Change',
    sortable: true,
}]

const Panel: FC<{ visible: boolean, followRef: React.RefObject<HTMLDivElement>, followId: string, onClose: () => void }> = ({ visible, followId, followRef, onClose }) => {

    const [filterType, updateFilterType] = useState(FilterTypes[1].key);

    const [nameFilter, updateNameFilter] = useState('');

    const [sort, updateSort] = useState<{ sort: string, dir: 'asc' | 'desc' | '' }>({
        sort: '',
        dir: '',
    });

    const [favoriateList, updateFavoriateList] = useRecoilState(recoilFavoriateList);
    const updatePerpetualToken = useSetRecoilState(recoilPerpetualToken)

    const indexPrices = useIndexPrices();

    const _tokens = useTradeTokens();


    // combine token with price and change
    const tokens = useMemo(() => {
        return _tokens.map(tk => {
            return {
                ...tk,
                price: indexPrices[tk.symbolName]?.price || '-',
                change: +indexPrices[tk.symbolName]?.change || 0,
            }
        })

    }, [indexPrices, _tokens]);

    const [panelPos, updatePanelPos] = useState<{
        top: number;
    }>();

    useEffect(() => {
        if (!followRef.current) return;
        const { top, height } = followRef.current.getBoundingClientRect();
        const size = { top: top + height + 10 };
        updatePanelPos(size);
    }, [followRef]);


    const handelFav = useCallback((token_: string) => {
        updateFavoriateList((preFav) => {
            console.log("update fav", preFav, preFav[token_], !preFav[token_]?.favoriate ?? false);
            return {
                ...preFav,
                [token_]: {
                    label: token_,
                    favoriate: !preFav[token_]?.favoriate ?? false,
                },
            };
        })
    }, []);

    const changeRouteSymbol = useCallback((nextSymbol: string) => {
        // router.push(`/perpetual/${nextSymbol}`, { scroll: false });
        // router.replace(`/perpetual/${nextSymbol}`)
        updatePerpetualToken(nextSymbol);
        window.history.replaceState(null, '', `/perpetual/${nextSymbol}`);
        onClose();


    }, []);

    const handleFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        updateNameFilter(val);

    }, []);

    const filteredList = useMemo(() => {

        const matchTypeList = tokens.filter(token_ => {
            if (filterType === 'fav') {
                return !!favoriateList[token_.symbolName]?.favoriate;
            }
            return filterType === 'all' ? true : token_.tag.some(tg => tg.toLowerCase() === filterType.toLowerCase())
        });


        if (!nameFilter) return sortArrByKey(matchTypeList, sort.sort, sort.dir);

        return sortArrByKey(matchTypeList.filter(token_ => token_.symbolName.toLowerCase().includes((nameFilter).toLowerCase())), sort.sort, sort.dir);
    }, [tokens, nameFilter, filterType, sort]);


    return createPortal(
        <RemoveScroll>
            <MotiveDiv
                className="global-symbolbar"
                id={followId}
                style={panelPos}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.nativeEvent.stopImmediatePropagation();
                }}
                {...drawerConfig}
            >
                <div style={{ padding: '0 20px' }}>
                    <Tabs initial={1} list={FilterTypes} handleClick={(fil: typeof FilterTypes[0]) => updateFilterType(fil.key)} />
                </div>
                <div style={{ padding: '0 20px' }}>
                    <Input
                        onChange={handleFilter}
                        className="search-input"
                        placeholder="Search"
                        suffix={
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14.2125 13.3516L10.1547 9.29375C10.7844 8.47969 11.125 7.48438 11.125 6.4375C11.125 5.18438 10.6359 4.00937 9.75156 3.12344C8.86719 2.2375 7.68906 1.75 6.4375 1.75C5.18594 1.75 4.00781 2.23906 3.12344 3.12344C2.2375 4.00781 1.75 5.18438 1.75 6.4375C1.75 7.68906 2.23906 8.86719 3.12344 9.75156C4.00781 10.6375 5.18438 11.125 6.4375 11.125C7.48438 11.125 8.47813 10.7844 9.29219 10.1562L13.35 14.2125C13.3619 14.2244 13.376 14.2338 13.3916 14.2403C13.4071 14.2467 13.4238 14.2501 13.4406 14.2501C13.4575 14.2501 13.4741 14.2467 13.4897 14.2403C13.5052 14.2338 13.5194 14.2244 13.5312 14.2125L14.2125 13.5328C14.2244 13.5209 14.2338 13.5068 14.2403 13.4912C14.2467 13.4757 14.2501 13.459 14.2501 13.4422C14.2501 13.4254 14.2467 13.4087 14.2403 13.3931C14.2338 13.3776 14.2244 13.3635 14.2125 13.3516ZM8.9125 8.9125C8.25 9.57344 7.37187 9.9375 6.4375 9.9375C5.50312 9.9375 4.625 9.57344 3.9625 8.9125C3.30156 8.25 2.9375 7.37187 2.9375 6.4375C2.9375 5.50312 3.30156 4.62344 3.9625 3.9625C4.625 3.30156 5.50312 2.9375 6.4375 2.9375C7.37187 2.9375 8.25156 3.3 8.9125 3.9625C9.57344 4.625 9.9375 5.50312 9.9375 6.4375C9.9375 7.37187 9.57344 8.25156 8.9125 8.9125Z" fill="white" fill-opacity="0.5" />
                            </svg>
                        }
                    />
                </div>
                <Col className="list-wrapper" gap="20px">
                    <Row className="list-header">
                        {
                            MarketsListHeads.map(h => {
                                return <Row className={`head-item head-${h.key}`} key={h.key}>
                                    {
                                        h.sortable ? (
                                            <IconSort
                                                active={sort.sort === h.key}
                                                onChange={(nextDir) => updateSort({
                                                    sort: h.key,
                                                    dir: nextDir,
                                                })} label={<div>{h.label}</div>} initial=""
                                            />) : <div>{h.label}</div>
                                    }

                                </Row>
                            })
                        }
                    </Row>
                    <Scrollbar
                    >
                        <Col >
                            {
                                visible && filteredList.map(tk => {
                                    return (
                                        <Col gap="10px" onClick={() => changeRouteSymbol(tk.symbolName)} className="token-row" style={{ paddingTop: '20px', paddingBottom: '10px' }}>
                                            <Row key={tk.symbolName} >
                                                <Row gap="8px" className="token-name">
                                                    <Image onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.nativeEvent.stopImmediatePropagation();
                                                        handelFav(tk.symbolName);
                                                    }} width={16} height={16} className="fav-icon" alt={tk.symbolName} src={favoriateList[tk.symbolName]?.favoriate ? FavoriteIcon : StarIcon} />
                                                    <TokenImage width={20} height={20} name={tk.symbolName} />
                                                    <span>{tk.symbolName}</span>
                                                </Row>
                                                <div className="token-price">{indexPrices[tk.symbolName]?.price}</div>
                                                <div className={`token-change ${+indexPrices[tk.symbolName]?.change < 0 ? 'desc' : 'raise'} `}>{indexPrices[tk.symbolName]?.change || 0}%</div>
                                            </Row>
                                            <Row gap="6px" style={{ paddingLeft: '24px' }}>
                                                {tk.tag.map((tag: string) => {
                                                    return <div className="item-tag" key={`${tk.symbolName}-${tag}`}>{tag}</div>
                                                })}
                                            </Row>
                                        </Col>
                                    );
                                })
                            }
                        </Col>
                    </Scrollbar>

                </Col>
            </MotiveDiv>
        </RemoveScroll>,
        window.document.body
    );
}



export const MarketPanel: FCC = ({ children }) => {

    const [showPanel, switchPanelShow] = useState(false);
    const ref = useRef(null);
    const uuid = useId();


    useClickAway(() => {
        switchPanelShow(false);
    }, ref);


    return (
        <>
            <SymbolWrapper gap="10px" className="pointer" ref={ref} onClick={() => switchPanelShow(!showPanel)} style={{ display: 'inline-flex' }}>
                {children}
                <Image className={`icon-arrow ${showPanel ? 'active-icon-arrow' : ''}`} src={ArrowIcon} width={12} height={12} alt="" />
            </SymbolWrapper>

            <AnimatePresence>
                {showPanel && <Panel visible={showPanel} followRef={ref} followId={uuid} onClose={() => switchPanelShow(false)} />}
            </AnimatePresence>
        </>
    );
}