// 中间画布层、提供拖拽后的组件释放能力
import React, { useRef, useMemo, useEffect } from 'react';
import { ItemTypes } from '../../../common/drag-drop';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { DragItem } from '../../../form-editor/interface';
import FormRender from '../../../form-render';
import useEditorContext from '../../../form-editor/hooks/use-editor-context';
import styles from './index.less';
import { ROOT_ID } from '../../../schema/schema-utils';
import classNames from 'classnames';
import ArrayUtils from '../../../common/array';
import { positionState } from '../../../form-editor';

export default function Canvas() {
  const editorContext = useEditorContext();
  const ref = useRef<HTMLDivElement>(null);

  const cancelMove = () => {
    // 重置位置计算变量
    positionState.srcIndex = undefined;
    positionState.tarIndex = undefined;
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.component.valueOf(),
      drop: (
        { data, elementId, parentElementId }: DragItem,
        monitor: DropTargetMonitor,
      ) => {
        // 计算是否在可落范围内
        const formDom = document.querySelector('.form-render');
        if (formDom) {
          const bundingRect = formDom.getBoundingClientRect();
          const { top, left, width, height } = bundingRect;
          const hoverPosition = monitor.getClientOffset();
          const dropResult = monitor.getDropResult();
          const { x, y } = hoverPosition! || {};

          // 鼠标位置不被监听、说明取消移动
          if ((!x || !y) && !dropResult) {
            cancelMove();
            return;
          }
          // 左右边界判定
          if (x < left + 16 || x > left + width - 16) {
            cancelMove();
            return;
          }
          // 上下边界判定
          if (y < top + 16) {
            positionState.tarIndex = 0;
          } else if (y > top + height - 16) {
            let len = editorContext.schema.layout[ROOT_ID]?.length;
            positionState.tarIndex = len;
          }
        }
        editorContext.onDrop(data, monitor, parentElementId);
      },
      canDrop: () => {
        const { overContainerList = [] } = positionState;
        return (
          overContainerList?.includes(ROOT_ID) &&
          overContainerList?.length === 1
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [editorContext.schema],
  );

  const onSelect = () => {
    editorContext.onSelect(ROOT_ID);
  };

  drop(ref);

  const clazz = useMemo(() => {
    return classNames({
      'form-editor': true,
      [styles.canvas]: true,
      [styles.active]: editorContext.activeElementId === ROOT_ID,
      [styles.blank]: editorContext.schema.layout[ROOT_ID]?.length < 1,
    });
  }, [editorContext.activeElementId, editorContext.schema]);

  useEffect(() => {
    const { overContainerList } = positionState;
    if (isOver) {
      ArrayUtils.removeExists(overContainerList, ROOT_ID);
      overContainerList?.push(ROOT_ID);
    } else {
      ArrayUtils.removeExists(overContainerList, ROOT_ID);
    }
  }, [isOver]);

  return (
    <div className={styles['canvas-box']} onClick={onSelect}>
      <div className={clazz} ref={ref}>
        <FormRender
          modulesMap={editorContext.modulesMap}
          schema={editorContext.schema}
          itemDraggable
          readOnly
          formRender={false}
        />
      </div>
    </div>
  );
}
