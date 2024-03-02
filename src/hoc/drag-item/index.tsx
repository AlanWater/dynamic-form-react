// 赋予组件可拖拽能力的高阶函数
import React, { useRef, useMemo, useState } from 'react';
import { Element } from '../../schema/interface';
import { DragItem, Module } from '../../form-editor/interface';
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import useEditorContext from '../../form-editor/hooks/use-editor-context';
import { ItemTypes } from '../../common/drag-drop';
import styles from './index.less';
import { ROOT_ID } from '../../schema/schema-utils';
import { positionState } from '../../form-editor';
import classNames from 'classnames';

interface DragItemProps {
  __parentElementId__?: string;
  __elementId__?: string;
  __index__?: number;
  [otherProp: string]: any;
}

export default function dragItemHoc(
  Component:
    | React.FunctionComponent<DragItemProps>
    | React.ComponentClass<DragItemProps>,
) {
  return (props: DragItemProps) => {
    const editorContext = useEditorContext();
    const ref = useRef<HTMLDivElement>(null);
    const index = props.__index__;
    const parentElementId = props.__parentElementId__;
    const data = props.data;
    const [dropIndex, setDropIndex] = useState<number>();
    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: props.acceptType || ItemTypes.component.valueOf(),
        item: {
          data,
          type: props.type,
          __index__: index,
          elementId: props.__elementId__,
          parentElementId: props.__parentElementId__,
          hoverPosition: '',
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }),
      [index, dropIndex],
    );
    const { overContainerList = [] } = positionState;
    // @ts-ignore
    const [{ isOver, insertIndex }, drop] = useDrop(
      () => ({
        accept: props.dragType || ItemTypes.component.valueOf(),
        collect: (monitor: DropTargetMonitor<DragItem>) => {
          return {
            isOver: !!monitor.isOver(),
            insertIndex: monitor.getItem()?.insertIndex,
          };
        },
        canDrop: () => true,
        hover: (dragItem: DragItem, monitor: DropTargetMonitor<DragItem>) => {
          // 计算准备
          const { __index__ } = dragItem;
          const dragIndex = __index__;
          const hoverIndex = index!;
          // 更位置
          positionState.preHoverIndex = positionState.hoverIndex;
          positionState.hoverIndex = hoverIndex;
          positionState.srcIndex = dragIndex;
          positionState.tarIndex = hoverIndex;

          // 边界判定
          // 样式边界和位置边界判定
          const hoverXYRecord = ref.current?.getBoundingClientRect();
          if (hoverXYRecord) {
            const { left, top, right, height, width } = hoverXYRecord;
            const mouseXYRecord = monitor.getClientOffset();
            if (mouseXYRecord) {
              const { x, y } = mouseXYRecord;
              const middleY = top + height / 2 + 4;
              let dropIndex = hoverIndex;
              // 落在上方
              if (y > middleY) {
                dropIndex = hoverIndex + 1;
              }
              monitor.getItem().insertIndex = dropIndex;
              setDropIndex(dropIndex);
              positionState.tarIndex = dropIndex;
            }
          }
        },
      }),
      [index, dropIndex],
    );

    if (props.__isModule__) {
      drag(ref);
    } else {
      drag(drop(ref));
    }

    const onSelect = (e: any) => {
      if (props.__elementId__) {
        editorContext.onSelect(props.__elementId__);
        e.stopPropagation();
      }
    };

    const clazz = useMemo(() => {
      // 落在容器组件上、不需要画线
      if (
        !isOver ||
        parentElementId !== ROOT_ID ||
        overContainerList?.length > 1
      ) {
        return '';
      }
      // 在一半上方展示上位置图标、在一半下方展示下位置图标
      return insertIndex === props.__index__
        ? classNames({ [styles['drop-over-top']]: true, 'drop-over-top': true })
        : classNames({
            [styles['drop-over-bottom']]: true,
            'drop-over-bottom': true,
          });
    }, [isOver, overContainerList?.length, insertIndex, props.__index__]);

    return (
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'default',
          width: '100%',
          position: 'relative',
          ...(props.style || {}),
          padding:
            editorContext.activeElementId === props.__elementId__ ||
            props.__isModule__
              ? 0
              : '0 10px',
        }}
        // @ts-ignore
        dragId={`drag-${props.__elementId__}`}
        key={index}
        className={clazz}
        onClick={onSelect}
      >
        <Component {...props} key={index} />
      </div>
    );
  };
}
