// 标题
// 实现一个repeat

// 题目描述
// 使用JS实现一个repeat方法，function repeat (func, times, wait) {}，​
// const repeatFunc = repeat(alert, 4, 3000), 调用这个 repeatedFunc("hellworld")，会alert4次 helloworld, 每次间隔3秒

function repeatCreator(func: Function, times: number, wait: number): Function {
  return (...args: any) => {
    let count = times;
    let id: number|undefined = setInterval(() => {
      func?.(...args);
      count--;
      if (count <= 0) {
        clearInterval(id);
        id = undefined;
      }
    }, wait);
  };
}

const repeatedFunc = repeatCreator(console.log, 4, 3000);
repeatedFunc("helloworld")
