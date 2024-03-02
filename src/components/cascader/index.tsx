import React from 'react';
import { Cascader as AntCascader } from 'antd';
import {
  basePropConfigs,
  cascadePropConfigs,
  formValidatorPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请选择',
  formProps: {
    dataType: {
      type: DataType.String,
      isList: true,
    },
  },
  requestType: '1',
};

// 属性配置区
export const propsConfig = {
  ...basePropConfigs,
  ...cascadePropConfigs,
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'cascader',
  title: '级联选择',
  groupName: '选择控件',
  icon: <Icon type="icon-jilianxuanze" />,
};

export default function Cascader(props: any) {
  return <AntCascader {...props} />;
}
