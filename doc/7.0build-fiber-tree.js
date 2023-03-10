//1.把虚拟DOM构建成fiber树

/*
type Fiber = {
  //类型
  type: any,
  //父节点
  return: Fiber,
  // 指向第一个子节点
  child: Fiber,
  // 指向下一个弟弟
  sibling: Fiber
}
*/

// child 子节点，指向自身下面的第一个儿子，太子，大儿子
// sibling 兄弟组件, 指向一个兄弟节点
// return 父节点，指向上一个fiber
let A1 = { type: 'div', props: { id: 'A1' } };
let B1 = { type: 'div', props: { id: 'B1' }, return: A1 };
let B2 = { type: 'div', props: { id: 'B2' }, return: A1 };
let C1 = { type: 'div', props: { id: 'C1' }, return: B1 };
let C2 = { type: 'div', props: { id: 'C2' }, return: B1 };

//A1的第一个子节点B1
A1.child = B1;
//B1的弟弟是B2
B1.sibling = B2;
//B1的第一个子节点C1
B1.child = C1;
//C1的弟弟是C2
C1.sibling = C2;

//下一个工作单元
let nextUnitOfWork = null;
//每帧还剩时间
const hasTimeRemaining = () => Math.floor(Math.random() * 10) % 2 == 0;

// 我们可以通过某些调度策略合理分配 CPU 资源，从而提高用户的响应速度
// 通过 Fiber 架构，让自己的调和过程变成可被中断。 适时地让出 CPU 执行权，除了可以让浏览器及时地响应用户的交互
// Fiber 是一个执行单元,每次执行完一个执行单元, React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去

// 每次渲染有两个阶段：Reconciliation(协调render阶段)和Commit(提交阶段)
// 协调阶段: 可以认为是 Diff 阶段, 这个阶段可以被中断, 这个阶段会找出所有节点变更，例如节点新增、删除、属性变更等等, 这些变更React 称之为副作用(Effect)
// 提交阶段: 将上一个阶段计算出来的需要处理的副作用(Effects)一次性执行了。这个阶段必须同步执行，不能被打断

// render工作循环
function workLoop() {
  //工作循环每一次处理一个fiber,处理完以后可以暂停
  //如果有当前工作单元并且有剩余的时间的话，就执行当前工作单元并返回下一个工作单元，也就是一个fiber
  while (nextUnitOfWork && hasTimeRemaining()) {
    //执行一个任务并返回下一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  console.log('render阶段结束');
  //render阶段结束
}

// 返回下一个要执行的工作单元fiber

// React 目前的做法是使用链表, 每个虚拟节点内部表示为一个Fiber
// 从顶点开始遍历
// 如果有第一个儿子，先遍历第一个儿子
// 如果没有第一个儿子，标志着此节点遍历完成
// 如果有弟弟遍历弟弟
// 如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
// 没有父节点遍历结束

// 先儿子，后弟弟，再叔叔,辈份越小越优先
// 什么时候一个节点遍历完成? 没有子节点，或者所有子节点都遍历完成了
// 没爹了就表示全部遍历完成了

function performUnitOfWork(fiber) {
  // A1
  let child = beginWork(fiber);
  //如果执行完A1之后，会返回A1的第一个子节点
  //深度优先遍历，一直找到第一个没有大儿子的节点，才标志着第一个节点遍历完成
  if (child) {
    return child;
  }
  //如果没有子节点
  while (fiber) {
    //如果没有子节点说明当前节点已经完成了渲染工作
    completeUnitOfWork(fiber); //可以结束此fiber的渲染了
    if (fiber.sibling) {
      //如果它有弟弟就返回弟弟
      return fiber.sibling;
    }
    fiber = fiber.return; //如果没有弟弟让爸爸完成，然后找叔叔
  }
}

// 执行完工作后并且返回该fiber的第一个儿子
function beginWork(fiber) {
  console.log('beginWork', fiber.props.id);
  return fiber.child; //B1
}

// 如果没有第一个儿子，标志着此节点遍历完成
function completeUnitOfWork(fiber) {
  console.log('completeUnitOfWork', fiber.props.id);
}

// 从顶点rootFiber开始遍历
nextUnitOfWork = A1;

workLoop();
// requestIdleCallback(workLoop);
