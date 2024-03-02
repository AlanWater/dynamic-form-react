import { PropConfig } from '../components/interface';

export interface PropConfigMap {
  [name: string]: PropConfig;
}
// 基础控件组
export const basePropConfigs: PropConfigMap = {
  'formProps.label': {
    type: 'textarea',
    formProps: {
      label: '标签名',
      name: 'formProps.label',
      required: true,
    },
    props: {
      maxLength: 10,
      placeholder: '请输入',
      showCount: true,
      rows: 1,
      className: 'form-input-label',
    },
  },
  'formProps.showLabel': {
    type: 'switch',
    formProps: {
      label: '显示标签',
      name: 'formProps.showLabel',
    },
  },
  // 'formProps.name': {
  //   type: 'input',
  //   formProps: {
  //     label: '字段名',
  //     name: 'formProps.name',
  //     required: true,
  //     requiredMessage: '字段名必须填写',
  //   },
  // },
  disabled: {
    type: 'switch',
    formProps: {
      label: '禁用',
      name: 'disabled',
    },
    props: {
      value: false,
    },
  },
  'formProps.labelWidth': {
    type: 'inputNumber',
    formProps: {
      label: '标签宽度',
      name: 'formProps.labelWidth',
    },
    props: {
      min: 0,
      max: 4880,
    },
  },
  width: {
    type: 'inputNumber',
    formProps: {
      label: '组件宽度',
      name: 'width',
    },
    props: {
      min: 1,
      max: 4880,
    },
  },
};

// 输入控件属性组
export const inputPropConfigs: PropConfigMap = {
  value: {
    type: 'input',
    formProps: {
      label: '默认值',
      name: 'value',
    },
  },
  placeholder: {
    type: 'input',
    formProps: {
      label: '提示信息',
      name: 'placeholder',
    },
  },
  maxLength: {
    type: 'inputNumber',
    formProps: {
      label: '长度限制',
      name: 'maxLength',
    },
    props: {
      min: 1,
    },
  },
};

// 时间控件通用属性
export const datePropConfig: PropConfigMap = {
  format: {
    type: 'select',
    formProps: {
      name: 'format',
      label: '时间格式',
    },
    props: {
      options: [
        {
          label: '年-月-日',
          value: 'YYYY-MM-DD',
        },
        {
          label: '年-月',
          value: 'YYYY-MM',
        },
        {
          label: '年',
          value: 'YYYY',
        },
        {
          label: '年-月-日 时:分:秒',
          value: 'YYYY-MM-DD HH:mm:ss',
        },
        // {
        //   label: '周',
        //   value: 'week',
        // },
      ],
      value: 'YYYY-MM-DD',
    },
  },
};

// 表单校验相关属性组
export const formValidatorPropConfigs: PropConfigMap = {
  // 纯展示组件、不需要传formProps
  divider0: {
    type: 'divider',
    props: {
      text: '表单校验',
      orientation: 'left',
    },
  },
  'formProps.required': {
    type: 'switch',
    formProps: {
      name: 'formProps.required',
      label: '必填',
    },
    props: {
      value: false,
    },
  },
  'formProps.requiredMessage': {
    type: 'input',
    formProps: {
      name: 'formProps.requiredMessage',
      label: '错误提示',
    },
    props: {
      placeholder: '请输入',
    },
  },
  divider1: {
    type: 'divider',
  },
  'formProps.rules[0].pattern': {
    type: 'input',
    formProps: {
      name: 'formProps.rules[0].pattern',
      label: '正则',
    },
  },
  'formProps.rules[0].message': {
    type: 'input',
    formProps: {
      name: 'formProps.rules[0].message',
      label: '错误提示',
    },
  },
};

// 多选项目自定义
export const optionsPropConfigs: PropConfigMap = {
  divider2: {
    type: 'divider',
    props: {
      text: '选项组',
      orientation: 'left',
    },
  },
  optionsType: {
    type: 'select',
    formProps: {
      name: 'optionsType',
      label: '数据来源',
    },
    props: {
      options: [
        {
          label: '自定义',
          value: 'custom',
        },
        {
          label: '接口获取',
          value: 'interface',
        },
      ],
      value: 'custom',
      placeholder: '请选择',
    },
  },
  url: {
    type: 'input',
    formProps: {
      name: 'url',
      label: '请求URL',
    },
    props: {
      placeholder: 'http://example.com/api',
    },
    hiddenExpression: 'eq("optionsType", "custom")',
  },
  params: {
    type: 'input',
    formProps: {
      name: 'params',
      label: '参数Query',
    },
    props: {
      placeholder: 'a=1&b=2&c=3',
    },
    hiddenExpression: 'eq("optionsType", "custom")',
  },
  labelPath: {
    type: 'input',
    formProps: {
      name: 'labelPath',
      label: '标签路径',
    },
    props: {
      placeholder: 'data.label',
    },
    hiddenExpression: 'eq("optionsType", "custom")',
  },
  valuePath: {
    type: 'input',
    formProps: {
      name: 'valuePath',
      label: '值路径',
    },
    props: {
      placeholder: 'data.value',
    },
    hiddenExpression: 'eq("optionsType", "custom")',
  },
  options: {
    type: 'optionsList',
    formProps: {
      name: 'options',
      showLabel: false,
    },
    hiddenExpression: 'eq("optionsType", "interface")',
  },
};

// 级联的自定义属性、90%的级联场景数据都是从外部获取非写死，否则级联意义不大
export const cascadePropConfigs: PropConfigMap = {
  divider2: {
    type: 'divider',
    props: {
      text: '数据源',
      orientation: 'left',
    },
  },
  requestType: {
    type: 'radio',
    formProps: {
      name: 'requestType',
      label: '请求方式',
    },
    props: {
      optionType: 'button',
      options: [
        {
          label: '全量',
          value: '1',
        },
        {
          label: '逐级',
          value: '2',
        },
      ],
    },
  },
  url: {
    type: 'input',
    formProps: {
      name: 'url',
      label: '请求URL',
    },
    props: {
      placeholder: 'http://example.com/api',
    },
  },
  params: {
    type: 'input',
    formProps: {
      name: 'params',
      label: '参数Query',
    },
    props: {
      placeholder: 'a=1&b=2&c=3',
    },
  },
  labelPath: {
    type: 'input',
    formProps: {
      name: 'labelPath',
      label: '标签路径',
    },
    props: {
      placeholder: 'data.label',
    },
  },
  valuePath: {
    type: 'input',
    formProps: {
      name: 'valuePath',
      label: '值路径',
    },
    props: {
      placeholder: 'data.value',
    },
  },
  divider$2: {
    type: 'divider',
    // 全量获取数据不需要逐级调用请求
    hiddenExpression: 'eq("requestType", "1")',
    props: {
      text: '下级请求设置',
      orientation: 'left',
    },
  },
  paramName: {
    type: 'input',
    hiddenExpression: 'eq("requestType", "1")',
    formProps: {
      name: 'paramName',
      label: '参数名称',
      required: true,
      requiredMessage: '请求参数名必填',
    },
    props: {
      placeholder: '本次请求的参数名称',
    },
  },
  // parentParamName: {
  //   type: 'input',
  //   hiddenExpression: 'eq("requestType", "1")',
  //   formProps: {
  //     name: 'parentParamName',
  //     label: '上级参数',
  //     required: true,
  //     requiredMessage: '上级参数名必填'
  //   },
  //   props: {
  //     placeholder: '下级请求的上级参数值来源',
  //   },
  // },
};
