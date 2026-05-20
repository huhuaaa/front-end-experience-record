// 定义三种状态
enum Status {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

type ResolveFunc = (value?: any) => any
type RejectFunc = (reason?: any) => any

class MyPromise {
  // 状态
  status = Status.PENDING;
  // 成功返回值
  value: any;
  // 失败原因
  reason: any;
  // 成功回调队列
  onFulfilledCallbacks: Function[] = [];
  // 失败回调队列
  onRejectedCallbacks: Function[] = [];

  constructor(executor: (resolve: ResolveFunc, reject: RejectFunc) => void) {
    // resolve 函数
    const resolve = (value: any) => {
      // 只有状态为 pending 时才能改变状态
      if (this.status === Status.PENDING) {
        this.status = Status.FULFILLED;
        this.value = value;
        // 执行所有成功回调
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    // reject 函数
    const reject = (reason: any) => {
      if (this.status === Status.PENDING) {
        this.status = Status.REJECTED;
        this.reason = reason;
        // 执行所有失败回调
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 立即执行 executor，并用 try/catch 捕获异常
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  /**
   * then 方法实现
   * @param {Function} onFulfilled - 成功回调
   * @param {Function} onRejected - 失败回调
   * @returns {MyPromise} - 返回一个新的 Promise
   */
  then(onFulfilled?: ResolveFunc|null, onRejected?: RejectFunc|null) {
    // 参数透传处理（如果不是函数则忽略）
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    let promise2 = new MyPromise((resolve, reject) => {
      // 1. 如果当前状态是 fulfilled，立即执行成功回调
      if (this.status === Status.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            // 核心：处理 resolvePromise 逻辑（处理普通值和 Promise）
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      // 2. 如果当前状态是 rejected，立即执行失败回调
      if (this.status === Status.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      // 3. 如果状态还是 pending（异步操作），将回调推入队列
      if (this.status === Status.PENDING) {
        // 成功回调入队
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });

        // 失败回调入队
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  // catch仅是then的一个语法糖
  catch(onRejected: (reason: any) => any) {
    return this.then(null, onRejected)
  }

  static resolve(value: any) {
    return new MyPromise(resolve => resolve(value));
  };

  // 静态方法 reject
  static reject = function (reason: any) {
    return new MyPromise((resolve, reject) => reject(reason));
  };
}

/**
 * 核心辅助函数：解析 then 的返回值 x
 * @param {MyPromise} promise2 - then 返回的新 Promise
 * @param {Any} x - onFulfilled/onRejected 的返回值
 * @param {Function} resolve - promise2 的 resolve
 * @param {Function} reject - promise2 的 reject
 */
function resolvePromise(promise2: MyPromise, x: any, resolve: ResolveFunc, reject: RejectFunc) {
  // 防止循环引用：如果 x 和 promise2 是同一个对象，抛出错误
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  let called = false; // 防止多次调用

  // 如果 x 是对象或函数（可能是 Promise 或 thenable 对象）
  if (x !== null && typeof x === 'object' && typeof x.then === 'function') {
    try {
      // 如果是一个thenable对象，则调用then方法，兼容其他框架实现的类Promise的thenable对象
      x.then((y: any) => {
        if (called) return;
        called = true;
        // 递归解析，直到得到普通值
        resolvePromise(promise2, y, resolve, reject);
      }, (r: any) => {
        if (called) return;
        called = true;
        reject(r);
      });
    } catch (e) {
      if (called) return;
      called = true;
      // 异常直接执行reject
      reject(e);
    }
  } else {
    // x 是普通值，直接 resolve
    resolve(x);
  }
}

new Promise<void>((resolve) => {
  console.log(1);
  resolve();
}).then(() => {
  console.log(2);
})

new MyPromise((resolve) => {
  console.log(3);
  resolve();
}).then(() => {
  console.log(4);
})
