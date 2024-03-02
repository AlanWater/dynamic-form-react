import React from 'react';
import { Switch as AntSwitch, SwitchProps } from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  PropConfigMap,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  value: false,
  formProps: {
    dataType: {
      type: DataType.Boolean,
      isList: false,
    },
  },
};

// 属性配置区
export const propsConfig: PropConfigMap = {
  ...basePropConfigs,
  value: {
    type: 'switch',
    formProps: {
      name: 'value',
      label: '默认状态',
    },
    props: {
      value: false,
    },
  },
  checkedChildren: {
    type: 'input',
    formProps: {
      name: 'checkedChildren',
      label: '打开文本',
    },
  },
  unCheckedChildren: {
    type: 'input',
    formProps: {
      name: 'unCheckedChildren',
      label: '关闭文本',
    },
  },
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'switch',
  title: '开关',
  groupName: '其他控件',
  icon: <Icon type="icon-kaiguan" />,
};

export default function Switch(props: SwitchProps) {
  const onChange = (checked: boolean, e: MouseEvent) => {
    props?.onChange?.(!!checked, e);
  };
  // @ts-ignore
  return <AntSwitch {...props} onChange={onChange} checked={!!props.value} />;
}
