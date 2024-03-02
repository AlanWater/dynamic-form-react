// 选中框、用于渲染被选中组件所拥有的基本操作功能
import React from 'react';
import useEditorContext from '../../hooks/use-editor-context';
import { Tooltip } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';

export default function BundingRect(props: any) {
  const editorContext = useEditorContext();
  const { hiddenTools = false, hideDelete = false, hideCopy = false } = props;
  return (
    <div className={styles['bunding-rect']} style={props.style}>
      {!hiddenTools ? (
        <div className={styles['box-tools']}>
          {!hideCopy ? (
            <Tooltip placement="top" title={'复制'}>
              <CopyOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  editorContext.onCopy(props.__parentElementId__);
                  return false;
                }}
                style={{
                  backgroundColor: '#4D9BEE',
                  color: '#fff',
                  fontSize: 12,
                  padding: 2,
                  marginRight: 2,
                  cursor: 'pointer',
                  zIndex: 1111,
                }}
              />
            </Tooltip>
          ) : null}
          <Tooltip placement="top" title={'删除'}>
            <DeleteOutlined
              onClick={(e) => {
                e.stopPropagation();
                editorContext.onDelete(props.__parentElementId__);
                return false;
              }}
              style={{
                backgroundColor: '#FF4D4F',
                color: '#fff',
                fontSize: 12,
                padding: 2,
                cursor: 'pointer',
                zIndex: 1111,
              }}
            />
          </Tooltip>
        </div>
      ) : null}
      {props.children}
    </div>
  );
}
