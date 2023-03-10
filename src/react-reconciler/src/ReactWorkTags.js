//Fiber的tag
//每种虚拟DOM都会对应自己的fiber tag类型
//后面我们会讲到组件，组件分类组件和函数组件，因为它们都是函数，刚开始的时候
export const FunctionComponent = 0; //函数组件
export const ClassComponent = 1; //类组件
// 对于FunctionComponent在第一次识别的时候会被认为是IndeterminateComponent，IndeterminateComponent会变回FunctionComponent
// https://zhuanlan.zhihu.com/p/115533068
export const IndeterminateComponent = 2;
//根Fiber的tag
export const HostRoot = 3; //容器根节点
export const HostComponent = 5; //原生节点 span div h1
export const HostText = 6; //纯文件节点
