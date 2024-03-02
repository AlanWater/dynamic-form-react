import { ColProps } from 'antd';
import { FormLabelAlign } from 'antd/lib/form/interface';

export interface DataType {
  type: number;
  isList: boolean;
}

// 表单相关属性
export interface FormProps {
  // 表单标签
  label?: string;
  // 是否展示标签部分
  showLabel?: boolean;
  // 标签宽度
  labelCol?: ColProps;
  // 标签文本位置
  labelAlign?: FormLabelAlign;
  // 表单字段名
  name: string;
  // 表单值
  value?: any;
  // 是否必填
  required?: boolean;
  // 必填提示信息
  requiredMessage?: string;
  // 是否判断唯一
  unique?: boolean;
  // 是否隐藏
  hidden?: boolean;
  // 数据类型
  dataType?: DataType;
  // 标签宽度
  labelWidth?: React.CSSProperties['width'];
}

export type ComponentType = string;

export interface Element {
  // 组件类型，比如input表示单行文本
  type: ComponentType;
  props: {
    // 元素id
    __elementId__: string;
    // 是否是module
    __isModule__: boolean;
    // 表单属性
    formProps?: FormProps;
    // 是否禁用
    disabled?: boolean;
    // 是否可拖拽、一般用于表单编辑器中
    draggable?: boolean;
    // 标签宽度
    labelWidth?: React.CSSProperties['width'];
    [others: string]: any;
  };
}

export interface Schema {
  elements: {
    [elementId: string]: Element;
  };
  layout: {
    // 根元素
    root: string;
    // 元素id和相关
    [elementId: string]: string[] | string;
  };
  // 用于保存form的name和元素的对应关系
  form: {
    [name: string]: string;
  };
}
