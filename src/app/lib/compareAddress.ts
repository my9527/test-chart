



/**
 * compare if addressA equals addressB
 * @param addressA 
 * @param addressB 
 * @returns 
 */
export const compareAddress = (addressA: Addr, addressB: Addr) => {
    return addressA?.toLowerCase() === addressB?.toLowerCase();
}