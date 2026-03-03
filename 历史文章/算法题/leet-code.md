# LeetCode

## 1. 给定一个字符串s，请你找出其中不含有重复字符的最长子串的长度

### 1.1 最原始解法

每一个字符开始都去寻找他的最长子串，并记录下最长的串。时间复杂度O(n²)

```JavaScript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    const tempChares = new Set();
    let longestCount = 0;
    if (!s || s?.length <= 1) {
        return s?.length || longestCount;
    }
    let start = 0;
    while(start < s.length) {
        tempChares.add(s[start]);
        let end = start + 1;
        while(end < s.length) {
            const char = s[end];
            if (!tempChares.has(char)) {
                tempChares.add(char);
            } else {
                break;
            }
            end++;
        }
        const strLong = end - start;
        if (strLong > longestCount) {
            longestCount = strLong;
        }
        start++;
        tempChares.clear()
    }
    return longestCount;
};
```

### 1.2 官方答案，采用滑动窗口方法

```JavaScript
// 官方答案
var lengthOfLongestSubstring = function(s) {
    // 哈希集合，记录每个字符是否出现过
    const occ = new Set();
    const n = s.length;
    // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动
    let rk = -1, ans = 0;
    for (let i = 0; i < n; ++i) {
        if (i != 0) {
            // 左指针向右移动一格，移除一个字符
            occ.delete(s.charAt(i - 1));
        }
        while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
            // 不断地移动右指针
            occ.add(s.charAt(rk + 1));
            ++rk;
        }
        // 第 i 到 rk 个字符是一个极长的无重复字符子串
        ans = Math.max(ans, rk - i + 1);
    }
    return ans;
};
```

### 1.3 理解后的优化结果

原理介绍：

![](../../demo/draw/滑动窗口算法.excalidraw.png)

```TypeScript
const lengthOfLongestSubstring = (s: string): number => {
    if (!s) {
        return 0;
    } else if (s.length <= 1) {
        return s.length
    }
    const tempSet: Set<string> = new Set();
    let rightIndex: number = 0;
    let longestCount: number = 0;
    for(let leftIndex = 0; leftIndex < s.length; leftIndex++) {
        if (leftIndex > 0) {
            tempSet.delete(s[leftIndex - 1]);
        }
        while(rightIndex < s.length && !tempSet.has(s[rightIndex])) {
            tempSet.add(s[rightIndex]);
            rightIndex++;
        }
        // 如果当前滑动窗口子串的长度为大于已记录的长度，则进行计算；用Math.max可以等于该效果。
        longestCount = Math.max(longestCount, rightIndex - leftIndex);
        if (rightIndex === s.length || s.length - leftIndex < longestCount) {
            // 1. 如果右指针已经到了最右边，则在此次之前计算得到的结果已经是最长的了，左边指针越往右边移动长度只会越短，没必要再进行计算。
            // 2. 如果左指针到最右侧的距离已经小于已知的最长子串，那么也不需要再计算。
            break;
        }
    }
    return longestCount;
}
```
