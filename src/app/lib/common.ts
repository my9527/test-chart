import dayjs from "dayjs";



export const formatTime = (timeString: string | number | undefined, format: string = 'YYYY-MM-DD HH:mm:ss') => {
    if (!timeString || timeString === '-') {
      return '-';
    }
    return dayjs(+timeString * 1000).format(format);
  };



export const sortArrByKey = (arr: any[], prop: string, dir: string)=> {
  if(!prop) return arr;

  console.log('sortArrByKey', prop, dir);

  return arr.sort((a, b) => {
    if(dir === 'asc') {
      return  b[prop] - a[prop];
    } else if(dir === 'desc') {
      return a[prop] - b[prop]
    } else {
      return 0;
    }
  });
}