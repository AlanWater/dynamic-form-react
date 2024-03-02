import React from 'react';
import { Select as AntSelect } from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  optionsPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请选择',
  options: [
    {
      label: '选项一',
      value: '1',
    },
    {
      label: '选项二',
      value: '2',
    },
    {
      label: '选项三',
      value: '3',
    },
  ],
  optionsType: 'custom',
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
  ...optionsPropConfigs,
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'select',
  title: '下拉选框',
  groupName: '选择控件',
  icon: <Icon type="icon-xialaxuankuang" />,
};

export default function Select(props: any) {
  return <AntSelect {...props} />;
}
