import React from 'react';
import { Radio as AntRadio, RadioProps } from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  optionsPropConfigs,
  PropConfigMap,
} from '../../common/base-prop-configs';
import Icon from '../../components/icon';
import { DataType } from '../../common/enum';

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
export const propsConfig: PropConfigMap = {
  ...basePropConfigs,
  optionType: {
    type: 'radio',
    formProps: {
      name: 'optionType',
      label: '按钮样式',
    },
    props: {
      options: [
        {
          label: '默认',
          value: 'default',
        },
        {
          label: '按钮',
          value: 'button',
        },
      ],
      value: 'default',
    },
  },
  ...optionsPropConfigs,
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'radio',
  title: '单选框',
  groupName: '选择控件',
  icon: <Icon type="icon-danxuankuang" />,
};

export default function Radio(props: RadioProps) {
  const onChange = (e: any) => {
    props?.onChange?.(e?.target?.value);
  };

  return <AntRadio.Group {...props} onChange={onChange} />;
}
