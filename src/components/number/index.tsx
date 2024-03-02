import React from 'react';
import { InputNumber as AntInputNumber, InputNumberProps } from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  inputPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';
import { BaseConfigProps } from '../interface';

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请输入',
  formProps: {
    dataType: {
      type: DataType.Number,
      isList: false,
    },
  },
};

// 属性配置区
export const propsConfig = {
  ...basePropConfigs,
  value: {
    type: 'inputNumber',
    formProps: {
      name: 'value',
      label: '默认值',
    },
  },
  placeholder: {
    type: 'input',
    formProps: {
      label: '提示信息',
      name: 'placeholder',
    },
  },
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'inputNumber',
  title: '数字',
  groupName: '输入控件',
  icon: <Icon type="icon-shuzi" />,
};

export default function InputNumber({
  valueChangeTrigger = 'onChange',
  ...rest
}: InputNumberProps & BaseConfigProps) {
  const onChange = (value: any) => {
    if (valueChangeTrigger === 'onChange') {
      rest?.onChange?.(value);
    }
  };
  const onBlur = (value: any) => {
    if (valueChangeTrigger === 'onBlur') {
      rest?.onChange?.(value);
    }
  };
  const onStep = (value: any) => {
    if (valueChangeTrigger === 'onBlur') {
      onBlur(value);
    } else {
      onChange(value);
    }
  };

  return (
    <AntInputNumber
      {...rest}
      onChange={onChange}
      onBlur={onBlur}
      onStep={onStep}
    />
  );
}
