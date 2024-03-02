import React, { useRef, useEffect } from 'react';
import { Col as AntCol, ColProps } from 'antd';
import styles from './index.less';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import useEditorContext from '../../form-editor/hooks/use-editor-context';
import { ItemTypes } from '../../common/drag-drop';
import { DragItem } from '../../form-editor/interface';
import classNames from 'classnames';
import ArrayUtils from '../../common/array';
import { containerTypes } from '../../schema/schema-utils';
import { positionState } from '../../form-editor';

export default function Col({
  children,
  onOver,
  ...rest
}: ColProps & { [prop: string]: any }) {
  const editorContext = useEditorContext();
  const ref = useRef<HTMLDivElement>(null);

  const classzz = classNames({
    [styles.col]: true,
    [styles.form]: rest.formRender,
  });

  if (rest.formRender) {
    return (
      <AntCol className={classzz} {...rest}>
        {children}
      </AntCol>
    );
  }

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.component.valueOf(),
      drop: (item: DragItem, monitor: DropTargetMonitor) => {
        editorContext.onDropInContainer(item, rest.__elementId__);
      },
      canDrop: (item: DragItem) => {
        return !containerTypes.includes(item.type);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [editorContext.schema],
  );

  const clazz = classNames({
    [styles.over]: isOver,
    [styles.col]: true,
  });

  drop(ref);

  useEffect(() => {
    const { overContainerList } = positionState;
    if (isOver) {
      ArrayUtils.removeExists(overContainerList, rest.__elementId__);
      overContainerList?.push(rest.__elementId__);
      const upDom = document.querySelector('.drop-over-top');
      const downDom = document.querySelector('.drop-over-bottom');
      if (upDom) {
        upDom.className = '';
      }
      if (downDom) {
        downDom.className = '';
      }
    } else {
      ArrayUtils.removeExists(overContainerList, rest.__elementId__);
    }
  }, [isOver]);

  return (
    <AntCol className={clazz} {...rest} ref={ref}>
      {children}
    </AntCol>
  );
}
