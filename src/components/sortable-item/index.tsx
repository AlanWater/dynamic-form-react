import classNames from 'classnames';
import React from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import styles from './index.less';

export interface SortableItemProps {
  children: React.ReactNode;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  row: any;
  list: any[];
  // 接收和使用的拖拽类型
  type: symbol;
}

const SortableItem = ({
  children,
  onMove,
  row,
  list,
  type,
}: SortableItemProps) => {
  const ref = React.useRef(null);
  const index = list.indexOf(row);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: DropTargetMonitor<any>) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index
            ? styles['drop-over-downward']
            : styles['drop-over-upward'],
      };
    },
    drop: (item: any) => {
      onMove(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  const clazz = classNames({
    [styles['sortable-list-item']]: true,
    [dropClassName]: isOver,
  });
  return (
    <div ref={ref} className={clazz} style={{ cursor: 'move' }}>
      {children}
    </div>
  );
};

export default SortableItem;
