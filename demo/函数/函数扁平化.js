// 实现一个数组扁平化函数，展开数组内的所有数字和数组，变成平铺的一维数组
function test1(inputArray) {
  let result = [];
  const newArray = [...inputArray];
  while (newArray.length) {
    const node = newArray.shift();
    if (node.constructor === Array) {
      result = [...result, ...test1(node)];
    } else {
      result = [...result, node];
    }
  }
  return result;
}

console.log(test1([1, 2, 3, [4, 5, [6, 7, [8, 9]]]]));
