import React from 'react';
import { Slider as AntSlider, SliderSingleProps } from 'antd';
import { basePropConfigs } from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  value: 10,
  formProps: {
    dataType: {
      type: DataType.Number,
      isList: false,
    },
  },
};

// 属性配置区
export const propsConfig = { ...basePropConfigs };

// 物料区配置
export const materialsConfig = {
  type: 'slider',
  title: '滑块',
  groupName: '其他控件',
  icon: <Icon type="icon-huakuai" />,
};

export default function Slider(props: SliderSingleProps) {
  const onChange = (value: number) => {
    props?.onChange?.(value);
  };
  // @ts-ignore
  return <AntSlider {...props} onChange={onChange} />;
}
