# 善用props解构默认值

最近对工作中需要对ant design中Form组件做自定义封装，然后遇到了一个奇葩的问题，排查了很久，最终排查出结果竟然是由于对组件的props解构时赋了默认值导致的，真是只有想不到的坑，踩过才知道。

将警告复现只需要精简很少的代码
```tsx
import React, { Key, useEffect, useState } from 'react';
import { Tree as AntdTree } from 'antd';
import { TreeProps as AntdTreeProps } from 'antd/lib/tree';

interface TreeProps extends Omit<AntdTreeProps, 'onCheck'> {
  value?: Key[];
  onChange?: (data: any) => void;
}

const Tree: React.FC<TreeProps> = (props) => {
  const { value = [], onChange, treeData, ...restProps } = props;

  const [value1, setValue1] = useState<Key[]>([]);

  useEffect(() => {
    // TODO: 这里会根据value的改变会重新设置value1的值。
    setValue1([...value])
  }, [value])

  return (
    <AntdTree
      treeData={treeData}
      onCheck={onChange}
      {...restProps}
    />
  )
}

export default Tree;
```

然后在其他地方调用方式为

```tsx
function App() {
  return (
    <Form>
      <Form.Item
        label="Tree"
        name="tree"
      >
        <Tree
          checkable
          treeData={treeData}
        />
      </Form.Item>
    </Form>
  );
}
```

运行后忽然会出现一个hook依赖的警告

![五层模型](~@image/react_hooks_dependency.png)

当然当时这个组件并没有这么逻辑简单，其中涉及了很多state的管理和useMemo, 最初排查时方向也是首先判断useEffect的依赖问题，以及useMemo中的依赖对象是否相互依赖导致副作用一直触发导致页面一直刷新，但是通过排查，他们的依赖项都是单向的，并没有交叉引用的情况出现，困扰了许久。

最终判断出useEffect一直在刷新，但是其中的依赖项当时我一直认为没更新，但忽然发现了这句
```js
const { value = [], onChange, treeData, ...restProps } = props;
```
顿时茅舍顿开，就是因为`value = []`这个为value赋了默认初值，然后由于useEffect依赖项包含value，然后里面有对组件中的状态进行更新，然后组件刷新重新走了赋默认初值，然后才会出现这种警告。

:::tip
  当然这种情况的发生也是因为父级没有为其传入value属性，如果传入的话这个问题就不能复现了。
:::

这个坑其实很低级，但是却没想到这种可能性，记录一下。