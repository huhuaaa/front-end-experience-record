/**
 * 防抖函数
 */
function debounce(fn: Function, delay: number, immediate = false) {
  let timer: number | null = null;
  const returnFunction = function (...args: any[]) {
    // 非冷却中，且立即执行，需要当下立即执行函数
    const callNow = immediate && !timer;
    timer && clearTimeout(timer);
    const context = this;
    timer = setTimeout(() => {
      timer = null; // 解除冷却时间
      if (!immediate) {
        fn.apply(context, args);
      }
    }, delay);
    if (callNow) {
      fn.apply(context, args);
    }
  };
  returnFunction.cancel = function () {
    timer && clearTimeout(timer);
  }
  return returnFunction;
}

/**
 * 节流函数（先执行）
 */
function throttle(fn: Function, interval: number) {
  let lastTime = 0;
  return function (...args: any[]) {
    const context = this;
    const now = Date.now();
    if (now - lastTime > interval) {
      fn.apply(context, args);
      // 记录最后一次执行时间
      lastTime = now;
    }
  }
}

const func1 = debounce(() => {
  console.log(1);
}, 1000, true);

const func2 = debounce(() => {
  console.log(2);
}, 1000);

const func3 = throttle(() => {
  console.log(3);
}, 1000);


func1(); // 输出1
func1(); // 命中拦截，实际不执行
func2(); // 延时输出2
func2(); // 命中拦截，实际不执行
func3(); // 输出3
func3(); // 命中拦截，实际不执行
setTimeout(() => {
  func3(); // 延时输出3
}, 1000);

// 最终输出1 3 2 3
