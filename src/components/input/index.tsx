import React from 'react';
import { Input as AntInput, InputProps } from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  inputPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';

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
};

// 物料区配置
export const materialsConfig = {
  type: 'input',
  title: '单行文本',
  groupName: '输入控件',
  icon: <Icon type="icon-danhangwenben" />,
};

export default function Input(props: InputProps) {
  const onChange = (e: any) => {
    props?.onChange?.(e?.target?.value);
  };

  return <AntInput {...props} onChange={onChange} />;
}
