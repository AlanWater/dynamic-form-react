import React, { useMemo } from 'react';
import { Checkbox } from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  options: [
    {
      label: '是否选择',
      value: '1',
    },
  ],
  value: false,
  formProps: {
    dataType: {
      type: DataType.Boolean,
      isList: false,
    },
  },
};

// 属性配置区
export const propsConfig = { ...basePropConfigs, ...formValidatorPropConfigs };

// 物料区配置
export const materialsConfig = {
  type: 'yesno',
  title: '是否',
  groupName: '选择控件',
  icon: <Icon type="icon-shifou" />,
};

export default function YesNo(
  props: Omit<Omit<CheckboxGroupProps, 'onChange'>, 'value'> & {
    onChange: (value: boolean) => void;
    value: boolean | string[];
  },
) {
  const onChange = (value: any) => {
    const checkValue = !!value?.length;
    props?.onChange?.(checkValue);
  };

  const checkValue = useMemo(() => {
    if (typeof props.value === 'boolean') {
      return props.value ? ['1'] : [];
    }
    return props.value;
  }, [props.value]);

  return <Checkbox.Group {...props} onChange={onChange} value={checkValue} />;
}
