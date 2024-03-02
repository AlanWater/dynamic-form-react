// 右侧属性配置区、提供配置组件props的能力
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Collapse, Form } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import useEditorContext from '../../../form-editor/hooks/use-editor-context';
import { PropConfig } from '../../../components/interface';
import { ROOT_ID } from '../../../schema/schema-utils';
import formItemHoc from '../../../hoc/form-item';
import Input from '../../../components/input';
import InputNumber from '../../../components/number';
import YesNo from '../../../components/yes-no';
import TextArea from '../../../components/textarea';
import Divider from '../../../components/divider';
import Switch from '../../../components/switch';
import Select from '../../../components/select';
import Radio from '../../../components/radio';
import { cloneDeep, get } from 'lodash';
import styles from './index.less';
import Checkbox from '../../../components/checkbox';
import { parseExpression } from '../../../common/expression';
import OptionsList, { OptionTypeProps } from '../../../components/options-list';
import { debounce } from 'lodash';
import Text from '../../../components/text';

const { Panel } = Collapse;

// 控件注册表
// TODO: 类型报错待解决
const componentMap: {
  [type: string]: any;
} = {
  input: formItemHoc(Input),
  inputNumber: formItemHoc(InputNumber),
  // @ts-ignore
  yesno: formItemHoc(YesNo),
  // @ts-ignore
  switch: formItemHoc(Switch),
  textarea: formItemHoc(TextArea),
  divider: Divider,
  checkbox: Checkbox,
  select: formItemHoc(Select),
  // @ts-ignore
  optionsList: formItemHoc(OptionsList),
  radio: formItemHoc(Radio),
  text: Text,
};

interface DynamicRenderProps {
  type: string;
  props: any;
  config: PropConfig;
  index: number;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
}

const optionsModeMap: {
  [type: string]: string;
} = {
  radio: 'single',
  select: 'single',
  checkbox: 'multiple',
};

// 动态渲染属性配置面板组件
const dynamicRenderComponent = ({
  type,
  props,
  config,
  index,
  onBlur,
  onFocus,
}: DynamicRenderProps) => {
  let Component = componentMap[config.type];

  // 生成props
  const getProps = () => {
    const { name } = config.formProps || {};
    let temp = {
      ...(config.props || {}),
      // mode: optionsModeMap[type],
    };
    switch (name) {
      case 'value': {
        // 最大长度控制
        temp['maxLength'] = props['maxLength'];
        break;
      }
      default: {
        break;
      }
    }
    return temp;
  };

  // 判断是否存在表达式、如果存在，更新显隐状态
  let hidden = false;
  if (config.hiddenExpression) {
    hidden = parseExpression(props, config.hiddenExpression);
  }
  if (hidden) return null;

  return (
    <Component
      key={`${props.__elementId__}${index}`}
      {...getProps()}
      onBlur={onBlur}
      onFocus={onFocus}
      formProps={{
        ...config.formProps,
        realHideLabel: true,
        hidden,
        labelCol: {
          span: 7,
        },
      }}
    />
  );
};

const getValuesByCheckedOptions = (options: OptionTypeProps[]) => {
  return options
    ?.map(({ checked, value }) => (checked ? value : undefined))
    .filter(Boolean);
};

export default function PropsPanel() {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<string | string[]>(ROOT_ID);
  const editorContext = useEditorContext();
  const { activeElementId, schema, modulesMap } = editorContext;

  const propElementId = useMemo(() => {
    return activeKey === ROOT_ID || activeElementId === ROOT_ID
      ? ROOT_ID
      : activeElementId;
  }, [activeKey, activeElementId, schema]);

  const onChange = debounce((changedFields: FieldData[]) => {
    const type = schema.elements[propElementId].type;
    editorContext.propsChange(
      propElementId,
      changedFields?.reduce((pre, cur) => {
        const name = (cur?.name as string[])?.[0];
        if (!name) return pre;
        const temp = {
          [name]: cur.value,
        };
        // 如果为options、需要过滤出所有checked的选项并作为value更新
        if (name === 'options') {
          temp.value = getValuesByCheckedOptions(cur.value);
          if (['radio', 'select'].includes(type)) {
            temp.value = temp.value?.[0];
          }
        }
        return {
          ...pre,
          ...temp,
        };
      }, {}),
    );
  }, 100);
  // 失去焦点后、需要记录schema
  const onBlur = () => {
    setTimeout(() => {
      editorContext.onPropsBlur?.();
    }, 500);
  };
  // 获得焦点的时候不允许撤回重做
  const onFocus = () => {
    editorContext.onPropsFocus();
  };
  const renderPropsPanel = useCallback(
    (elementId: string) => {
      const element = schema.elements[elementId];
      const { props, type } = element || {};
      const { propsConfig = {} } = modulesMap[type] || {};
      return Object.values(propsConfig)?.map((config, index) => {
        return dynamicRenderComponent({
          type,
          props,
          config,
          index,
          onBlur,
          onFocus,
        });
      });
    },
    [activeElementId, schema, modulesMap],
  );

  const updateFormValues = useCallback(
    (elementId: string) => {
      const element = schema.elements[elementId];
      const { props, type } = element || {};
      const { propsConfig = {} } = modulesMap[type] || {};
      // 更新表单数据
      form.setFieldsValue(
        Object.values(propsConfig)?.reduce((pre, cur) => {
          const name = cur.formProps?.name;
          if (!name) return pre;
          const propsValue = get(props, name);
          const value =
            propsValue !== undefined ? propsValue : cur?.props?.value;
          return {
            ...pre,
            [name]: value,
          };
        }, {}),
      );
    },
    [propElementId, schema],
  );

  useEffect(() => {
    if (activeElementId && activeElementId !== ROOT_ID) {
      setActiveKey('component');
    } else {
      setActiveKey(ROOT_ID);
    }
  }, [activeElementId]);

  useEffect(() => {
    if (propElementId) updateFormValues(propElementId);
  }, [propElementId, schema]);

  const handleActiveChange = (key: string | string[]) => {
    key = key as string;
    setActiveKey(key);
    if (key?.length) {
      editorContext.onSelect(ROOT_ID);
    }
  };

  return (
    <div className={styles.panel}>
      {/* @ts-ignore */}
      <Form form={form} onFieldsChange={onChange}>
        <Collapse activeKey={activeKey} onChange={handleActiveChange}>
          <Panel header="表单属性" key={ROOT_ID}>
            {renderPropsPanel(ROOT_ID)}
          </Panel>
          {activeElementId !== ROOT_ID ? (
            <Panel
              disabled
              showArrow={false}
              className={styles.component}
              header="组件属性"
              key="component"
            >
              {renderPropsPanel(activeElementId)}
            </Panel>
          ) : null}
        </Collapse>
      </Form>
    </div>
  );
}
