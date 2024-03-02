// 拖拽方法合集
import update from 'immutability-helper';

// 具备被拖拽能力的类型集合
export const ItemTypes: { [type: string]: Symbol } = {
  component: Symbol('component'),
  optionsGroup: Symbol('optionsGroup'),
};

// 排序移动交换函数
export const moveItem = (
  list: any[],
  dragIndex: number,
  hoverIndex: number,
) => {
  const dragRow = list[dragIndex];
  return update(list, {
    $splice: [
      [dragIndex, 1],
      [hoverIndex, 0, dragRow],
    ],
  });
};
