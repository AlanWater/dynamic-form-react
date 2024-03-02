import React from 'react';
import { Button, Upload as AntUpload, UploadProps } from 'antd';
import { DataType } from '../../common/enum';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  PropConfigMap,
} from '../../common/base-prop-configs';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请输入',
  formProps: {
    dataType: {
      type: DataType.String,
      isList: true,
    },
  },
};

// 属性配置区
export const propsConfig: PropConfigMap = {
  ...basePropConfigs,
  action: {
    type: 'input',
    formProps: {
      name: 'action',
      label: '上传URL',
    },
  },
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'upload',
  title: '文件上传',
  groupName: '其他控件',
  icon: <Icon type="icon-shangchuan" />,
};

export default function Upload(
  props: Omit<UploadProps, 'onChange'> & {
    onChange: (fileList: UploadFile[]) => void;
    buttonText: string;
  },
) {
  const onChange = ({ file, fileList }: UploadChangeParam) => {
    if (file.status !== 'uploading') {
      props?.onChange?.(fileList);
    }
  };

  return (
    <AntUpload {...props} onChange={onChange}>
      <Button type="primary">{props.buttonText || '点击上传'}</Button>
    </AntUpload>
  );
}
