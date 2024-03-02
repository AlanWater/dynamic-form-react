import React from 'react';
import { Divider as AntDivider, DividerProps } from 'antd';
import { PropConfigMap } from '../../common/base-prop-configs';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  formProps: {
    showLabel: false,
  },
};

// 属性配置区
export const propsConfig: PropConfigMap = {
  dashed: {
    type: 'switch',
    formProps: {
      name: 'dashed',
      label: '是否虚线',
    },
  },
  text: {
    type: 'input',
    formProps: {
      name: 'text',
      label: '文本信息',
    },
  },
  plain: {
    type: 'radio',
    formProps: {
      name: 'plain',
      label: '文本类型',
    },
    props: {
      options: [
        {
          label: '标题',
          value: '0',
        },
        {
          label: '正文',
          value: '1',
        },
      ],
      value: '0',
    },
  },
  orientation: {
    type: 'radio',
    formProps: {
      name: 'orientation',
      label: '文本信息',
    },
    props: {
      options: [
        {
          label: '左',
          value: 'left',
        },
        {
          label: '中',
          value: 'center',
        },
        {
          label: '右',
          value: 'right',
        },
      ],
      optionType: 'button',
    },
  },
};

// 物料区配置
export const materialsConfig = {
  type: 'divider',
  title: '分割线',
  groupName: '其他控件',
  icon: <Icon type="icon-fengexian" />,
};

export default function Divider(props: DividerProps & { text?: string }) {
  const { plain = '0' } = props;
  return (
    <AntDivider {...props} plain={plain === true || `${plain}` === '1'}>
      {props.text}
    </AntDivider>
  );
}
