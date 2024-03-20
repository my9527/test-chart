import dayjs from "dayjs";



export const formatTime = (timeString: string | number | undefined, format: string = 'YYYY-MM-DD HH:mm:ss') => {
    if (!timeString || timeString === '-') {
      return '-';
    }
    return dayjs(+timeString * 1000).format(format);
  };


/**
 * 按照指定的key 对数组进行排序
 * @param arr 
 * @param prop 
 * @param dir 
 * @returns 
 */
export const sortArrByKey = (arr: any[], prop: string, dir: string)=> {
  if(!prop) return arr;
  return arr.sort((a, b) => {
    if(dir === 'asc') {
      return  a[prop] < b[prop] ? -1 : 1;
    } else if(dir === 'desc') {
      return  a[prop] < b[prop] ? 1 : -1
    } else {
      return 0;
    }
  });
}