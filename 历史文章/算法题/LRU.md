# 实现LRU

题目描述
请你设计并实现一个满足 LRU (最近最少使用) 缓存 约束的数据结构。​
实现 LRUCache 类：​
LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存​
int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。​
void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。​
函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。​
示例：​
输入​
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]​
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]​
输出​
[null, null, null, 1, null, -1, null, -1, 3, 4]​

解释​
LRUCache lRUCache = new LRUCache(2);​
lRUCache.put(1, 1); // 缓存是 {1=1}​
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}​
lRUCache.get(1); // 返回 1​
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}​
lRUCache.get(2); // 返回 -1 (未找到)​
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}​
lRUCache.get(1); // 返回 -1 (未找到)​
lRUCache.get(3); // 返回 3​
lRUCache.get(4); // 返回 4

## 代码

常规O(N)复杂度

```JavaScript
class LRUCache {
  maxCacheCount = 0;
  cacheMap = new Map();

  constructor(maxCacheCount) {
    this.maxCacheCount = maxCacheCount;
  }

  get(key) {
    if (this.cacheMap.has(key)) {
      const obj = this.cacheMap.get(key);
      this.cacheMap.set(key, {
        ...obj,
        lastTime: this.createTimestamp(),
      });
      return obj.value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cacheMap.size >= this.maxCacheCount) {
      let outCacheKey,
        useCacheLastTimeMin = Number.MAX_SAFE_INTEGER;
      this.cacheMap.forEach((obj, key) => {
        if (obj.lastTime < useCacheLastTimeMin) {
          useCacheLastTimeMin = obj.lastTime;
          outCacheKey = key;
        }
      });
      this.cacheMap.delete(outCacheKey);
    }

    this.cacheMap.set(key, {
      value,
      lastTime: this.createTimestamp(),
    });
  }

  createTimestamp() {
    return performance.now() || Date.now();
  }
}

let lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}​
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}​
console.log(lRUCache.get(1)); // 返回 1​
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}​
console.log(lRUCache.get(2)); // 返回 -1 (未找到)​
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}​
console.log(lRUCache.get(1)); // 返回 -1 (未找到)​
console.log(lRUCache.get(3)); // 返回 3​
console.log(lRUCache.get(4)); // 返回 4
```

优化的O(1)复杂度版本

```JavaScript
// O（1）复杂度，需要采用双向链表，直接知道头和尾是谁
class DataNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  maxCacheCount = 0;
  cacheMap;
  virtualHead;
  virtualTail;

  // 构造函数
  constructor(maxCacheCount) {
    this.maxCacheCount = maxCacheCount;
    this.cacheMap = new Map();
    this.virtualHead = new DataNode();
    this.virtualTail = new DataNode();
    this.virtualHead.next = this.virtualTail;
    this.virtualTail.prev = this.virtualHead;
  }

  /**
   * 新增节点
   * @param {*} node
   */
  _addNodeToHead(node) {
    node.prev = this.virtualHead;
    node.next = this.virtualHead.next;
    this.virtualHead.next.prev = node;
    this.virtualHead.next = node;
  }

  /**
   * 已有节点移动到顶部
   * @param {*} node
   */
  _moveNodeToHead(node) {
    this._removeNode(node);
    this._addNodeToHead(node);
  }

  /**
   * 移除已有节点
   * @param {*} node
   */
  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /**
   * 删除尾部
   */
  _removeTailNode() {
    const node = this.virtualTail.prev;
    this._removeNode(this.virtualTail.prev);
    return node;
  }

  /**
   * 查询缓存
   */
  get(key) {
    // map对象中存在则直接返回
    if (this.cacheMap.has(key)) {
      const dataNode = this.cacheMap.get(key);
      if (this.cacheMap.size > 1) {
        // 最新使用保活跃，放到队列的头部
        this._moveNodeToHead(dataNode);
      }
      return dataNode.value;
    }
    return -1;
  }

  /**
   * 设置缓存
   */
  put(key, value) {
    if (!this.cacheMap.has(key)) {
      // 数据未进入到队列，则需要先创建数据对象，再加入到队列头部
      const dataNode = new DataNode(key, value);
      this._addNodeToHead(dataNode);
      // 计入到缓存中，用于快速查询
      this.cacheMap.set(key, dataNode);
      // 超出容量要删除尾部的缓存
      if (this.cacheMap.size > this.maxCacheCount) {
        const tailNode = this._removeTailNode();
        this.cacheMap.delete(tailNode.key);
      }
    } else {
      // 已有的只需要更新和移动
      const dataNode = this.cacheMap.get(key);
      // 更新值
      dataNode.value = value;
      // 移动位置
      this._moveNodeToHead(dataNode);
    }
  }
}

let lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}​
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}​
console.log(lRUCache.get(1)); // 返回 1​
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}​
console.log(lRUCache.get(2)); // 返回 -1 (未找到)​
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}​
console.log(lRUCache.get(1)); // 返回 -1 (未找到)​
console.log(lRUCache.get(3)); // 返回 3​
console.log(lRUCache.get(4)); // 返回 4
```
