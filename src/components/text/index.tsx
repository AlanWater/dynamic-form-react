import React from 'react';
import { Typography } from 'antd';
import { basePropConfigs } from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';

const { Text: AntText, Title } = Typography;
// 属性配置区的默认属性值
export const defaultProps = {
  formProps: {
    dataType: {
      type: DataType.String,
      isList: false,
    },
  },
  contentType: '1',
  level: '1',
};
// 属性配置区
export const propsConfig = {
  ...basePropConfigs,
  'formProps.label': {
    type: 'input',
    hiddenExpression: 'eq("contentType", "2")',
    formProps: {
      label: '标签名',
      name: 'formProps.label',
      required: true,
    },
  },
  'formProps.showLabel': {
    type: 'switch',
    hiddenExpression: 'eq("contentType", "2")',
    formProps: {
      label: '显示标签',
      name: 'formProps.showLabel',
    },
  },
  contentType: {
    type: 'radio',
    formProps: {
      label: '文本类型',
      name: 'contentType',
    },
    props: {
      options: [
        {
          label: '正文',
          value: '1',
        },
        {
          label: '标题',
          value: '2',
        },
      ],
      optionType: 'button',
    },
  },
  level: {
    type: 'radio',
    hiddenExpression: 'eq("contentType", "1")',
    formProps: {
      label: '标题大小',
      name: 'level',
    },
    props: {
      optionType: 'button',
      options: [
        {
          label: 'h1',
          value: '1',
        },
        {
          label: 'h2',
          value: '2',
        },
        {
          label: 'h3',
          value: '3',
        },
        {
          label: 'h4',
          value: '4',
        },
        {
          label: 'h5',
          value: '5',
        },
      ],
    },
  },
  text: {
    type: 'input',
    // hiddenExpression: 'eq("contentType", "2")',
    formProps: {
      label: '描述文本',
      name: 'text',
    },
    props: {
      placeholder: '请输入描述',
    },
  },
};
// 物料区配置
export const materialsConfig = {
  type: 'text',
  title: '描述',
  groupName: '其他控件',
  icon: <Icon type="icon-jilu-xian" />,
};

export default function Text(props: any) {
  const { text, contentType } = props;
  // 为正文则返回text
  if (contentType === '1') {
    return <AntText {...props}>{text}</AntText>;
  }
  // 为标题则返回title
  return (
    <Title {...props} level={+(props.level || 1)}>
      {text}
    </Title>
  );
}
