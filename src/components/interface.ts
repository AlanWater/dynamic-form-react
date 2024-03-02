import { MaterialConfig } from '../form-editor/interface';
import { FormProps } from '../schema/interface';
import { PropConfigMap } from '../common/base-prop-configs';

export interface PropConfig {
  // 属性面板组件类型
  type: string;
  // 表单属性
  formProps?: FormProps;
  // 组件属性
  props?: any;
  // 是否隐藏的表达式、直接跟元素的属性挂钩
  // 例如：props为{ a: 1 }、expression为 eq('optionsType', 1)表示props.a === 1 此时组件隐藏
  hiddenExpression?: string;
  // 修改schema的触发时机
  trigger?: Array<'blur' | 'change'>;
}
export interface ModulesMap {
  [componentType: string]: {
    // TODO: react组件类型待修复
    default: any;
    // TODO: 配置项类型后续增加
    defaultProps?: any;
    propsConfig?: PropConfigMap;
    materialsConfig?: MaterialConfig;
    itemHocs?: Array<'drag' | 'form' | 'async' | 'asyncCascade'>;
  };
}

export interface BaseConfigProps {
  valueChangeTrigger?: 'onChange' | 'onBlur';
}
