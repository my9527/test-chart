import dayjs from "dayjs";



export const formatTime = (timeString: string | number | undefined, format: string = 'YYYY-MM-DD HH:mm:ss') => {
    if (!timeString || timeString === '-') {
      return '-';
    }
    return dayjs(+timeString * 1000).format(format);
  };