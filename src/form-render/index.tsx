// 表单渲染器：根据传入的组件库、schema json来渲染最终的表单
import React, { useMemo, useCallback, useEffect } from 'react';
import { Form, Typography } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import defaultModulesMap, { formatFormModulesMap } from '../components';
import SchemaUtils, {
  containerTypes,
  ROOT_ID,
  transformSchema,
} from '../schema/schema-utils';
import { FormRenderProps } from './interface';
import useEditorContext from '../form-editor/hooks/use-editor-context';
import styles from './index.less';
import BundingRect from '../form-editor/components/bunding-rect';
import FormUtils from './form';
import useForm from './hooks/use-form';
import classNames from 'classnames';

FormRender.useForm = useForm;

const { Title } = Typography;

export default function FormRender({
  schema: customSchema,
  modulesMap: customModulesMap,
  itemDraggable = false,
  onChange,
  style,
  form: customForm,
  readOnly,
  disabled,
  formRender = true,
  showExtraTitle = false,
  extraTitle,
  index,
}: FormRenderProps) {
  const editorContext = useEditorContext();
  const [defaultForm] = Form.useForm();

  const form = useMemo(() => {
    return customForm || defaultForm;
  }, [defaultForm, customForm]);

  const { activeElementId } = editorContext;

  const schema = useMemo(() => {
    return transformSchema(customSchema, itemDraggable);
  }, [customSchema]);

  // 如果schema发生变化、收集发生改变的values并更新
  useEffect(() => {
    const changedValues = FormUtils.getChangedValuesBySchema(schema);
    form.setFieldsValue(changedValues);
  }, [schema, form]);

  const modulesMap = useMemo(() => {
    return formatFormModulesMap(
      {
        ...defaultModulesMap,
        ...customModulesMap,
      },
      ['form'],
    );
  }, [customModulesMap]);

  const recursionRender = useCallback(
    (elementId: string, parentElementId: string | undefined, index: number) => {
      const { elements, layout } = schema;
      const element = elements[elementId];
      if (!element) return null;
      const module = modulesMap[element.type];
      if (!module) return null;
      const props = elements[elementId].props;
      const { formProps } = props;
      // 若不展示则跳过
      if (formProps?.hidden) return null;
      const Component = module.default;
      const children = layout[elementId];
      let renderResult = (
        <Component
          {...(module?.defaultProps || {})}
          {...props}
          type={element.type}
          data={element}
          key={elementId}
          ____elementId__={elementId}
          __parentElementId__={parentElementId}
          __index__={index}
          readOnly={readOnly}
          disabled={props.disabled || disabled}
          schema={schema}
          modulesMap={modulesMap}
          formRender={formRender}
        >
          {!containerTypes?.includes(element.type) ||
          parentElementId !== ROOT_ID
            ? (children as string[])?.map((child, index) => {
                return recursionRender(child, elementId, index);
              })
            : null}
        </Component>
      );
      // 如果存在被选中的元素id并和当前选中元素id相同且不为根元素，就需要进行选择包装
      if (
        activeElementId &&
        activeElementId === props.__elementId__ &&
        activeElementId !== ROOT_ID
      ) {
        renderResult = (
          <BundingRect
            __parentElementId__={parentElementId}
            hideCopy={containerTypes.includes(element.type)}
            key={activeElementId}
          >
            {renderResult}
          </BundingRect>
        );
      }
      return renderResult;
    },
    [schema, modulesMap, activeElementId, disabled, readOnly],
  );

  // 当表单属性发生change的时候、更新schema
  const onFieldsChange = useCallback(
    (changedFieldsValues: FieldData[], allFieldsValues: FieldData[]) => {
      if (changedFieldsValues?.length) {
        const changedValues =
          FormUtils.generateFieldData2Values(changedFieldsValues);
        const allValues = FormUtils.generateFieldData2Values(allFieldsValues);
        const newSchema = SchemaUtils.updateSchema(schema, changedValues);
        onChange?.(changedValues, allValues, newSchema);
      }
    },
    [form],
  );

  const clazz = classNames(styles['form-editor'], {
    'form-render': true,
    [styles['form']]: true,
  });

  return (
    <div className={clazz} style={style}>
      {showExtraTitle ? (
        extraTitle ? (
          extraTitle?.(schema, index || 0)
        ) : (
          <Title style={{ textAlign: 'center' }} level={4}>
            {schema.elements[ROOT_ID].props.title}
          </Title>
        )
      ) : null}
      <Form form={form} onFieldsChange={onFieldsChange}>
        {/* 递归遍历用于渲染所有组件 */}
        {recursionRender(schema.layout.root, undefined, 0)}
      </Form>
    </div>
  );
}
