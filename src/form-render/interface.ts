import { ModulesMap } from '../components/interface';
import { Schema } from '../schema/interface';
import { FormInstance } from 'antd';

export interface Values {
  [field: string]: any;
}
export interface FormRenderProps {
  modulesMap?: ModulesMap;
  schema: Schema;
  itemDraggable?: boolean;
  onChange?: (changedValues: Values, allValues: Values, schema: Schema) => void;
  style?: React.CSSProperties;
  // 允许传入外部自定义form，支持antd的form。使用formRender自带的form来进行实例化
  form?: FormInstance;
  // 全局是否只读
  readOnly?: boolean;
  // 全局是否不可编辑
  disabled?: boolean;
  // 是否表单而非编辑器
  formRender?: boolean;
  // 是否展示额外的标题
  showExtraTitle?: boolean;
  // 自定义表单title
  extraTitle?: (schema: Schema, index: number) => React.ReactNode;
  // 多表单场景用、表单的下标
  index?: number;
  // 其他属性
  [other: string]: any;
}
