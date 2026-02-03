# ES6 中的 Proxy 和 Reflect

Proxy（代理）‌ 是 ES6 引入的一个强大的特性，它允许你创建一个代理对象，用于拦截并自定义 JavaScript 对象的基本操作。你可以把它想象成在目标对象前面架设的一层“拦截”层，所有对该对象的访问都必须先通过这层拦截。

核心概念‌：Proxy 是一个构造函数，它接收两个参数：目标对象 (target) 和处理程序对象 (handler)。handler 对象定义了代理的行为，包括各种“捕获器”（traps），这些捕获器对应了不同的操作，如属性读取、赋值、函数调用等。
基本语法‌：let proxy = new Proxy(target, handler);
常见捕获器‌：
get(target, property, receiver)：拦截对象属性的读取操作。
set(target, property, value, receiver)：拦截对象属性的设置操作。
has(target, property)：拦截 in 操作符。
deleteProperty(target, property)：拦截 delete 操作符。
apply(target, thisArg, argumentsList)：拦截函数的调用。
construct(target, argumentsList, newTarget)：拦截 new 操作符。

Reflect（反射）‌ 是 ES6 提供的另一个内置对象，它与 Proxy 紧密相关。Reflect 的设计目的是将一些原本属于 Object 对象上的方法（如 Object.defineProperty）转移到 Reflect 对象上，使得这些操作更加一致和函数式。

核心概念‌：Reflect 是一个全局对象，它提供了一组静态方法，这些方法与 Proxy 的捕获器一一对应。
主要作用‌：
统一 API‌：将一些语言内部的方法（如 Object.defineProperty）移到 Reflect 上，使操作对象更加统一和易于理解。
修改返回值‌：某些 Object 方法的返回值在 Reflect 上进行了修改，使其更合理。例如，Reflect.defineProperty 返回布尔值表示操作是否成功，而 Object.defineProperty 在失败时会抛出错误。
函数式操作‌：将一些命令式操作（如 name in obj）转化为函数式操作（如 Reflect.has(obj, name)），使代码更易读。
与 Proxy 配合‌：Reflect 的方法通常用于在 Proxy 的捕获器中调用默认行为，确保原生行为能够正常执行。

Proxy 和 Reflect 的关系‌：

它们是相辅相成的。Proxy 用于拦截和自定义对象操作，而 Reflect 提供了与这些操作对应的默认行为。
Proxy 的处理程序对象中的每个捕获器方法，通常都对应着 Reflect 对象上的一个同名方法。
在 Proxy 的捕获器中，通常会调用 Reflect 的对应方法来执行默认行为，然后再添加额外的逻辑。

简单示例‌：

```javascript
Copy Code
// 使用 Proxy 拦截属性读取和设置
const target = { name: 'John', age: 30 };
const handler = {
  get(target, prop, receiver) {
    console.log(`Getting property "${prop}"`);
    // 使用 Reflect 获取属性值
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`Setting property "${prop}" to ${value}`);
    // 使用 Reflect 设置属性值
    return Reflect.set(target, prop, value, receiver);
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // 输出: Getting property "name" \n John
proxy.age = 31; // 输出: Setting property "age" to 31
console.log(target.age); // 31
```

总而言之，Proxy 提供了拦截和自定义对象操作的能力，而 Reflect 则提供了与这些操作对应的默认行为，使得代码更易于组合和调试。