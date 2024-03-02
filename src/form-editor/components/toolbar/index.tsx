import React from 'react';
import { Button, Tooltip } from 'antd';
import Icon from '../../../components/icon';
import styles from './index.less';
import useEditorContext from '../../hooks/use-editor-context';
import { schemaStack } from '../../../form-editor';
import classNames from 'classnames';

interface ToolBarProps {
  onSave: () => void;
  onPreview: () => void;
  propsFocus?: boolean;
}

export default function ToolBar({
  onPreview,
  onSave,
  propsFocus,
}: ToolBarProps) {
  const editorContext = useEditorContext();
  const onUndo = () => {
    if (propsFocus) return;
    schemaStack?.undo();
    editorContext.updateSchema(schemaStack?.getTop()!);
  };
  const onRedo = () => {
    if (propsFocus) return;
    schemaStack?.redo();
    editorContext.updateSchema(schemaStack?.getTop()!);
  };
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <Button
          size="small"
          type="text"
          onClick={onUndo}
          className={classNames({
            [styles.disabled]: schemaStack?.getStack()?.length <= 1,
          })}
        >
          <Icon type="icon-chehui" />
          撤销
        </Button>
        <Button
          size="small"
          type="text"
          onClick={onRedo}
          className={classNames({
            [styles.disabled]: schemaStack?.getUndoStack()?.length <= 0,
          })}
        >
          <Icon type="icon-chehui" style={{ transform: 'rotateY(180deg)' }} />
          重做
        </Button>
      </div>
      <div className={styles.right}>
        <Button onClick={onPreview}>预览</Button>
        <Button onClick={onSave} type="primary">
          保存
        </Button>
      </div>
    </div>
  );
}
