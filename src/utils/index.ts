// 防抖
export function debounce(fn: Function, delay = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 节流
export function throttle(fn: Function, delay = 300) {
  let lastTime = 0;
  return function (...args: any[]) {
    const now = Date.now();
    if (now - lastTime > delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
export function getDay(day: number) {
  let today = new Date();
  let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码

  let tYear = today.getFullYear();
  let tMonth = today.getMonth();
  let tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
}
export function doHandleMonth(month: number) {
  let m = month + '';
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}