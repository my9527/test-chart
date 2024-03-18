



/**
 * compare if addressA equals addressB
 * @param addressA 
 * @param addressB 
 * @returns 
 */
export const compareAddress = (addressA: Addr | string, addressB: Addr | string) => {
    return addressA?.toLowerCase() === addressB?.toLowerCase();
}