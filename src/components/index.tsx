import * as Input from './input';
import * as TextArea from './textarea';
import * as Text from './text';
import * as PageContainer from './page-container';
import * as Container from './container';
import * as AutoComplete from './auto-complete';
import * as InputNumber from './number';
import * as Checkbox from './checkbox';
import * as Radio from './radio';
import * as DatePicker from './date-picker';
import * as RangeDatePicker from './range-date-picker';
import * as Switch from './switch';
import * as Slider from './slider';
import * as YesNo from './yes-no';
import * as Select from './select';
import * as Cascader from './cascader';
// import * as Upload from './upload';
import * as Divider from './divider';
import * as Row from './row';
import * as Col from './col';
import { ModulesMap } from './interface';
import formItemHoc from '../hoc/form-item';
import asyncHoc from '../hoc/async';
import dragItemHoc from '../hoc/drag-item';
import asyncCascadeHoc from '../hoc/async-cascade';
import { ROOT_ID } from '../schema/schema-utils';

const modulesMap: ModulesMap = {
  pageContainer: PageContainer,
  input: Input,
  textarea: TextArea,
  autoComplete: AutoComplete,
  inputNumber: InputNumber,
  radio: Radio,
  checkbox: Checkbox,
  select: Select,
  cascader: Cascader,
  datePicker: DatePicker,
  rangeDatePicker: RangeDatePicker,
  switch: Switch,
  slider: Slider,
  yesno: YesNo,
  // upload: Upload,
  divider: Divider,
  text: Text,
  container: Container,
  row: Row,
  col: Col,
};

export default modulesMap;

export const formatFormModulesMap = (
  modulesMap: ModulesMap,
  hocList: ('form' | 'drag')[],
  getHandle?: any,
): ModulesMap => {
  return Object.entries(modulesMap).reduce((pre, [type, module]) => {
    const { defaultProps } = module;
    const { formProps } = defaultProps || {};
    const tempModule = { ...module };
    tempModule.itemHocs = tempModule.itemHocs || [];
    if (
      formProps &&
      hocList.includes('form') &&
      !tempModule.itemHocs?.includes('form')
    ) {
      tempModule.default = formItemHoc(tempModule.default);
      tempModule.itemHocs.push('form');
    }
    if (
      type !== ROOT_ID &&
      hocList.includes('drag') &&
      !tempModule.itemHocs?.includes('drag')
    ) {
      tempModule.default = dragItemHoc(tempModule.default);
      tempModule.itemHocs.push('drag');
    }
    // 赋予异步查询的能力，下拉选框、单选框、多选框数据源可选择异步接口
    if (
      ['select', 'radio', 'checkbox', 'autoComplete', 'cascader'].includes(
        type,
      ) &&
      !tempModule.itemHocs?.includes('async')
    ) {
      tempModule.default = asyncHoc(tempModule.default, getHandle);
      tempModule.itemHocs.push('async');
    }
    // 级联特殊处理
    if (
      ['cascader'].includes(type) &&
      !tempModule.itemHocs?.includes('asyncCascade')
    ) {
      tempModule.default = asyncCascadeHoc(tempModule.default, getHandle);
      tempModule.itemHocs.push('asyncCascade');
    }
    return {
      ...pre,
      [type]: tempModule,
    };
  }, {});
};
