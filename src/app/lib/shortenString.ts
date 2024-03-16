


/**
 * 省略显示部分内容
 * TODO: 可配置显示
 * @param str 
 * @returns 
 */
export const shortenString = (str: string | `0x${string}`) => {
    
    return `${str.slice(0, 5)}...${str.slice(-5)}`;

}