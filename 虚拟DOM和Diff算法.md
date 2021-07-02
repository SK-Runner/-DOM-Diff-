# 虚拟DOM和Diff算法

首先说明：虚拟DOM和Diff算法不是Vue独创，Vue是借鉴了Snabbdom项目中虚拟Dom和Diff算法。

## 一、虚拟DOM

### 1、虚拟DOM是什么？

​	虚拟DOM其实是用JavaScript对象描述Dom的层级结构，并且Dom中的一切属性都在虚拟Dom中有对应属性。例如：

![image-20210702095748444](.\pic\image-20210702095748444.png)

### 2、虚拟DOM的作用是什么？

​	要将老虚拟Dom变换成新虚拟Dom，我们不能直接使用”暴力拆除法“，这样会浪费大量资源。

​	Diff算法可以通过新、老虚拟Dom，对其进行精细化比较，算出如何进行最小量更新，进而反应在真实Dom上。

![image-20210702100325794](.\pic\image-20210702100325794.png)

​	虚拟Dom属性如下：

```javascript
{
	sel:“标签”
    text：“文本内容”
    data:{标签属性}
    key:data.key
    children:[子节点，属性与父节点相同]
    elm:真实Dom
}
```



### 3、如何生成虚拟DOM——h()函数

![image-20210702110247727](.\pic\image-20210702110247727.png)

​	由于h函数的参数可变，所以h函数有多种使用形式。源码中h函数使用了方法的重载，根据不同情况生成不同虚拟DOM

​	注解h()函数源码（js形式的h函数）

```javascript
export function h(sel, b, c) {
    let data = {};
    let children;
    let text;
    let i;
    // 如果存在第三个参数
    if (c !== undefined) {
        // 如果第二个参数存在，其表示标签的属性
        if (b !== null) {
            data = b;
        }
        // 如果第三个参数是数组，说明第三个参数是子节点
        if (is.array(c)) {
            children = c;
        }
        // 如果第三个参数是字符串或数字,说明第三个参数是标签的文本内容
        else if (is.primitive(c)) {
            text = c;
        }
        // 如果第三个参数存在sel属性,说明第三个参数是h函数生成的子节点
        else if (c && c.sel) {
            children = [c];
        }
    }
    // 如果存在第二个参数，且不存在第三个参数
    else if (b !== undefined && b !== null) {
        // 如果第二参数是一个数组,说明第二参数是子节点
        if (is.array(b)) {
            children = b;
        }
        // 如果第二参数是字符串或数字,说明第二参数是标签的文本内容
        else if (is.primitive(b)) {
            text = b;
        }
        // 如果第二参数存在且有sel属性,则说明第二参数是由h函数产生的子节点
        else if (b && b.sel) {
            children = [b];
        }
        // 其他情况下,说明第二参数是标签的属性
        else {
            data = b;
        }
    }
    // 如果子节点存在
    if (children !== undefined) {
        // 遍历并创建子虚拟DOM
        for (i = 0; i < children.length; ++i) {
            // 如果子节点项是一字符串或数字,创建文本虚拟节点
            if (is.primitive(children[i]))
                children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    // 如果是个<foreignObject>节点
    if (sel[0] === "s" &&
        sel[1] === "v" &&
        sel[2] === "g" &&
        (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, undefined);
}
```

​	vnode方法：用于生成对象形式的DOM结构

```javascript
export function vnode(sel, data, children, text, elm) {
  const key = data === undefined ? undefined : data.key;
  return {
    sel,
    data,
    children,
    text,
    elm,
    key
  };
}
```

## 二、Diff算法

​	注意：当新、老虚拟DOM不一致时，不是直接使用Diff算法，一下是调用patch函数后流程图

![liu_cheng](.\pic\liu_cheng.jpg)

