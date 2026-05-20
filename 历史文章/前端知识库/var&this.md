# var & this 的一些说明

## var变量提升

var存在变量提升，在同一作用域中，声明会提升到顶部，但赋值语句留在原地，默认值为undefined；
let/const的无变量提升，但在引擎侧知道有这个变量要声明，但如果在申明语句前使用会报错，这个叫暂时性死区，若使用会报ReferenceError。

Nodejs和浏览器存在差别：

1. 浏览器中最顶层的var声明会挂载到window下，作为window的属性可以全局访问；
2. 但在Nodejs里面，因为Nodejs默认套了一层commonjs的模块化，故不会挂载到global下，仅作为模块的局部变量。

## this的指向

浏览器/Nodejs规则相同

1. 对象方法用function声明，内部this指向该对象；
2. 匿名函数function内this，默认this指向window，若有使用bind之类的方法this指向则随之改变；
3. 箭头函数内的this，指向其上一层作用域的this。

## 一个考试例子

```JavaScript
// 全局声明a，浏览器中会挂载到window.a的属性，Nodejs中则仅是当前模块的最上层作用域变量a。
var a = 10;
var obj = {
  a: 20,
  log0: function () {
    if (a) {
      // 变量提升后，a此时为undefined，故无法进入这个条件
      a = 100;
    } else {
      a = 200; // 变量提升后这里可以成功赋值200
    }
    console.log(a); // 输出200
    console.log(this.a); // 输出的是obj.a为20
    var a = 1; // var变量声明提升，但初始值为undefined，赋值语句保留在原地
    console.log(a); // 输出a为1
  },
  log1: function () {
    // 函数内没有声明a，网上一层找a，a为10
    console.log(a);
  },
  log2: function () {
    // 这里的this指向为obj
    return (function () {
      // 这里的指向为匿名函数的this，也就是window这一层，故这里的a为上一层的a为10；若是在Nodejs环境中执行，这里就是输出undefined。
      console.log(this.a);
    })();
  },
  log3: function () {
    // 这里的this指向obj
    return (() => {
      // 箭头函数的this是上一层级作用域的this，所以this.a为20
      console.log(this.a);
    })();
  },
};

obj.log0(); // 输出200，20，1
obj.log1(); // 输出10
obj.log2(); // 输出10
obj.log3(); // 输出20
```
