import styled from "styled-components";
import Image from "next/image";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import { FC, useEffect, useId, useRef, useState } from "react";
import Tabs from "../Tabs";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import { useClickAway } from "ahooks";
import { RemoveScroll } from "react-remove-scroll"

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
    label: 'Brc-20',
    key: 'brc20'
}];

const MotiveDiv = styled(motion.div)`
position: fixed;
bottom: 0;
left: 0;
min-width: 360px;
background: #1d1e21;
z-index: 1000;

`

const Panel: FC<{ visible: boolean, followRef: React.RefObject<HTMLDivElement>, followId: string }> = ({ visible, followId, followRef }) => {

    const [filterType, updateFilterType] = useState(FilterTypes[1].key);
    const [direction, updateDirection] = useState<{
        top: number;
    }>();
    useEffect(() => {
        if (!followRef.current) return;
        const { top, height } = followRef.current.getBoundingClientRect();
        const size = { top: top + height + 10 };
        updateDirection(size);
    }, [followRef]);


    return (
        <RemoveScroll>
            <MotiveDiv
                className="global-symbolbar"
                id={followId}
                style={direction}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.nativeEvent.stopImmediatePropagation();
                }}
                {...drawerConfig}
            >
                <Tabs initial={1} list={FilterTypes} handleClick={(fil: typeof FilterTypes[0]) => updateFilterType(fil.key)} />
            </MotiveDiv>
        </RemoveScroll>
    );
}



export const MarketPanel = () => {

    const [showPanel, switchPanelShow] = useState(false);
    const ref = useRef(null);
    const uuid = useId();


    useClickAway(() => {
        switchPanelShow(false);
    }, ref);


    return (
        <>
            <Image src={ArrowIcon} ref={ref} width={11} height={6} alt="" onClick={() => switchPanelShow(!showPanel)} />
            <AnimatePresence>
                {showPanel && <Panel visible={showPanel} followRef={ref} followId={uuid} />}
            </AnimatePresence>
        </>
    );
}