import React from 'react';
import { Input as AntInput } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { DataType } from '../../common/enum';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  inputPropConfigs,
} from '../../common/base-prop-configs';
import Icon from '../icon';

const AntTextArea = AntInput.TextArea;

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请输入',
  formProps: {
    dataType: {
      type: DataType.String,
      isList: false,
    },
  },
};

// 属性配置区
export const propsConfig = {
  ...basePropConfigs,
  ...inputPropConfigs,
  ...formValidatorPropConfigs,
  value: {
    type: 'textarea',
    formProps: {
      name: 'value',
      label: '默认值',
    },
  },
};

// 物料区配置
export const materialsConfig = {
  type: 'textarea',
  title: '多行文本',
  groupName: '输入控件',
  icon: <Icon type="icon-duohangwenben" />,
};

export default function TextArea(props: TextAreaProps) {
  const onChange = (e: any) => {
    props?.onChange?.(e?.target?.value);
  };

  return <AntTextArea {...props} onChange={onChange} />;
}
