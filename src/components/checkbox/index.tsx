import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  optionsPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请输入',
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
      isList: true,
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
  type: 'checkbox',
  title: '多选框',
  groupName: '选择控件',
  icon: <Icon type="icon-duoxuankuang" />,
};

export default function Checkbox(props: CheckboxGroupProps) {
  const onChange = (value: any) => {
    props?.onChange?.(value);
  };

  return <AntCheckbox.Group {...props} onChange={onChange} />;
}
