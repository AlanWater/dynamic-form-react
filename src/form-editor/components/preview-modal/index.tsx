// 预览用弹窗、有缩放等功能
import React from 'react';
import { Modal, ModalProps } from 'antd';
import Icon from '../../../components/icon';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

export interface PreviewModalProps extends ModalProps {
  children: React.ReactNode;
}

export default function PreviewModal({ children, ...rest }: PreviewModalProps) {
  return (
    <Modal
      footer={false}
      closeIcon={
        <>
          {/* <Icon type="icon-fangda" /> */}
          {/* <Icon type="icon-suoxiao" /> */}
          <CloseOutlined />
        </>
      }
      width={1000}
      className={styles['preview-modal']}
      title="预览"
      bodyStyle={{
        maxHeight: rest.footer ? 'calc(100vh - 194px)' : 'calc(100vh - 160px)',
      }}
      {...rest}
    >
      {/* @ts-ignore */}
      {React.cloneElement(children, {
        style: {
          padding: 0,
        },
      })}
    </Modal>
  );
}
