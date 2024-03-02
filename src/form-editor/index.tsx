// 表单编辑器
import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import MaterialsArea from './components/materials-area';
import Canvas from './components/canvas';
import PropsPanel from './components/props-panel';
import classnames from 'classnames';
import {
  DragDataType,
  DragItem,
  FormEditorProps,
  Module,
  PositionState,
} from './interface';
import { EDITOR_CONTEXT } from './hooks/use-editor-context';
import defaultModulesMap, { formatFormModulesMap } from '../components';
import { ModulesMap } from '../components/interface';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, DropTargetMonitor } from 'react-dnd';
import { Element, Schema } from '../schema/interface';
import SchemaUtils, {
  containerTypes,
  getInitialSchema,
  parseCleanSchema,
  ROOT_ID,
} from '../schema/schema-utils';
import styles from './index.less';
import '../styles/reset.less';
import ToolBar from './components/toolbar';
import PreviewModal from './components/preview-modal';
import FormRender from '../form-render';
import { Values } from '../form-render/interface';
import { Button, message } from 'antd';
import Input from '../components/input';
import SchemaStack from '../schema/stack';
import { cloneDeep } from 'lodash';

const parseElement = (data: DragDataType): [Element, boolean] => {
  let element = data;
  const isModule = !(data as Element)?.props?.__elementId__;
  // canvas内部拖拽、此时需要插入到明确的元素后
  if (isModule) {
    element = SchemaUtils.parseModule2Element(data as Module);
  }
  return [element as Element, isModule];
};

export const positionState: PositionState = {
  srcIndex: undefined,
  tarIndex: undefined,
  hoverIndex: undefined,
  preHoverIndex: undefined,
  overContainerList: [],
};

export let schemaStack: SchemaStack;

export default function FormEditor({
  className,
  schema: customSchema,
  modulesMap: customModulesMap,
  onSave: customOnSave,
  onPreview: customOnPreview,
  style,
  storage = false,
  onSchemaChange,
  getHandle,
  titleEditable = false,
}: FormEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [form] = FormRender.useForm();
  const [visible, setVisible] = useState(false);
  const [propsFocus, setPropsFocus] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState('auto');
  const [schema, setSchema] = useState<Schema>(
    customSchema ? customSchema : getInitialSchema(),
  );
  const [activeElementId, setActiveElementId] = useState<string>(ROOT_ID);

  const modulesMap: ModulesMap = useMemo(() => {
    return formatFormModulesMap(
      {
        ...defaultModulesMap,
        ...customModulesMap,
      },
      ['form', 'drag'],
      getHandle,
    );
  }, [customModulesMap]);

  const clazz = useMemo(() => {
    return classnames(styles['form-editor'], {
      className: !!className,
    });
  }, [className]);

  // 响应拖拽的drop事件、将组件插入到schema中对应位置
  const onDrop = (
    data: DragDataType,
    monitor: DropTargetMonitor,
    srcParentElementId: string = ROOT_ID,
    tarParentElementId: string = ROOT_ID,
  ) => {
    let [element, isModule] = parseElement(data);
    // 只有从左侧拖出来的才需要新增
    if (isModule) {
      // 根据暂存的srcIndex和tarIndex来返回需要插入到哪个位置的后面
      const position = positionState.tarIndex!;
      const newSchema = SchemaUtils.insertElement(
        schema,
        element,
        tarParentElementId,
        position,
      );
      element.props.__isModule__ = false;
      setActiveElementId(element.props.__elementId__);
      schemaStack.push(newSchema);
      setSchema(newSchema);
    } else {
      if (
        positionState.srcIndex === positionState.tarIndex &&
        srcParentElementId === tarParentElementId
      ) {
        positionState.srcIndex = undefined;
        positionState.tarIndex = undefined;
        positionState.hoverIndex = undefined;
        positionState.preHoverIndex = undefined;
        return;
      }
      const newSchema = SchemaUtils.moveElement(
        schema,
        srcParentElementId,
        positionState.srcIndex!,
        tarParentElementId,
        positionState.tarIndex!,
      );
      schemaStack.push(newSchema);
      setSchema(newSchema);
    }
    // 重置暂存的index
    positionState.srcIndex = undefined;
    positionState.tarIndex = undefined;
    positionState.hoverIndex = undefined;
    positionState.preHoverIndex = undefined;
  };

  // drop到某个容器内
  const onDropInContainer = (
    { data, parentElementId, __index__ }: DragItem,
    tarParentElementId: string,
  ) => {
    let [element, isModule] = parseElement(data);
    if (isModule) {
      // 根据暂存的srcIndex和tarIndex来返回需要插入到哪个位置的后面
      const newSchema = SchemaUtils.insertElement(
        schema,
        element,
        tarParentElementId,
        0,
        true,
      );
      element.props.__isModule__ = false;
      setActiveElementId(element.props.__elementId__);
      schemaStack.push(newSchema);
      setSchema(newSchema);
    } else {
      let newSchema = schema;
      if (parentElementId !== ROOT_ID) {
        // 容器内部移动、直接交换
        newSchema = SchemaUtils.swapElement(
          schema,
          parentElementId,
          0,
          tarParentElementId,
          0,
        );
      } else {
        // 外部移动到容器内部、直接移动并覆盖
        newSchema = SchemaUtils.moveElement(
          schema,
          parentElementId,
          __index__,
          tarParentElementId,
          0,
          true,
        );
      }
      schemaStack.push(newSchema);
      setSchema(newSchema);
    }
  };

  const reset = () => {
    positionState.srcIndex = undefined;
    positionState.tarIndex = undefined;
  };

  const onSelect = (elementId: string) => {
    // 选中对应元素id
    setActiveElementId(elementId);
  };

  // 属性面板发生值改变
  const propsChange = (elementId: string, values: any) => {
    const newSchema = SchemaUtils.setValues(schema, elementId, values);
    setSchema(newSchema);
  };

  // 保存事件
  const onSave = () => {
    if (storage) {
      localStorage.setItem('__localSchema__', JSON.stringify(schema));
    }
    if (customOnSave) {
      customOnSave?.(parseCleanSchema(schema));
      // customOnSave?.(schema);
    } else {
      message.success('保存成功!');
    }
  };

  // 预览事件
  const onPreview = () => {
    if (customOnPreview) {
      customOnPreview?.(schema);
    } else {
      const uniq = new Date().getTime();
      localStorage.setItem(`${uniq}`, JSON.stringify(schema));
      window.open(`/dynamic-form-react/preview?schemaId=${uniq}`);
    }
  };

  // 复制当前选中元素
  const onCopy = (parentElementId: string) => {
    const [newSchema, copyElementId] = SchemaUtils.copyElement(
      schema,
      parentElementId,
      activeElementId,
    );
    setSchema(newSchema);
    schemaStack.push(newSchema);
    if (copyElementId !== activeElementId) {
      setActiveElementId(copyElementId);
    }
  };

  // 删除当前元素
  const onDelete = (parentElementId: string) => {
    const type = schema.elements[activeElementId].type;
    if (containerTypes.includes(type)) {
      const [newSchema, lastElementId] = SchemaUtils.deleteContainer(
        schema,
        parentElementId,
        activeElementId,
      );
      setSchema(newSchema);
      schemaStack.push(newSchema);
      setActiveElementId(lastElementId || ROOT_ID);
    } else {
      let [newSchema, lastElementId] = SchemaUtils.deleteElement(
        schema,
        parentElementId,
        activeElementId,
      );
      setSchema(newSchema);
      schemaStack.push(newSchema);
      setActiveElementId(lastElementId || ROOT_ID);
    }
  };

  // 更新schema
  const updateSchema = (schema: Schema) => {
    setSchema(schema);
  };

  const onFormChange = (
    changedValues: Values,
    allValues: Values,
    schema: Schema,
  ) => {
    // console.log(changedValues, allValues, schema);
  };

  useEffect(() => {
    // @ts-ignore
    window.__localSchema__ = schema;
    onSchemaChange?.(schema);
  }, [schema]);

  const dynamicCalHeight = useCallback(() => {
    const top = editorRef.current?.offsetTop || 0;
    setDynamicHeight(`calc(100vh - ${top}px)`);
  }, [editorRef]);

  useEffect(() => {
    const storageSchema = localStorage.getItem('__localSchema__');
    if (customSchema) {
      setSchema(customSchema);
      schemaStack = new SchemaStack(customSchema);
    } else if (!customSchema && storageSchema && storage) {
      setSchema(JSON.parse(storageSchema!));
      schemaStack = new SchemaStack(JSON.parse(storageSchema!)!);
    } else {
      schemaStack = new SchemaStack(SchemaUtils.getInitialSchema());
    }

    dynamicCalHeight();
    window.addEventListener('resize', dynamicCalHeight);
    return () => {
      window.removeEventListener('resize', dynamicCalHeight);
    };
  }, []);

  const onHover = (position: PositionState) => {
    positionState.tarIndex = position.tarIndex;
    positionState.srcIndex = position.srcIndex;
    positionState.hoverIndex = position.hoverIndex;
    positionState.preHoverIndex = position.preHoverIndex;
  };

  const handleTitleChange = (value: string) => {
    schema.elements[ROOT_ID].props.title = value;
    setSchema({ ...schema });
  };

  const onPropsBlur = () => {
    const newSchema = { ...schema };
    schemaStack.push(newSchema);
    setSchema(newSchema);
    setPropsFocus(false);
  };
  const onPropsFocus = () => {
    setPropsFocus(true);
  };

  const title = schema?.elements?.[ROOT_ID]?.props?.title || '';

  return (
    <div
      className={clazz}
      style={{ height: dynamicHeight, ...style }}
      ref={editorRef}
    >
      {/* 提供provider、用于子组件共享顶层state */}
      <EDITOR_CONTEXT.Provider
        value={{
          modulesMap,
          schema,
          updateSchema,
          onDrop,
          onSelect,
          onCopy,
          onDelete,
          reset,
          activeElementId,
          propsChange,
          onDropInContainer,
          positionState,
          onHover,
          schemaStack,
          onPropsBlur,
          onPropsFocus,
          propsFocus,
        }}
      >
        <DndProvider backend={HTML5Backend}>
          {titleEditable ? (
            <Input
              // @ts-ignore
              // @ts-nocheck
              onChange={handleTitleChange}
              maxLength={20}
              className={`${styles.title} form-title`}
              value={title}
              placeholder="请输入模板名称"
              onBlur={onPropsBlur}
              onFocus={onPropsFocus}
            />
          ) : (
            <div className={styles.title} key="title">
              {title || ''}
            </div>
          )}
          <div className={styles.container}>
            <MaterialsArea />
            <div className={styles.content}>
              {/* 工具栏 */}
              <ToolBar
                onSave={onSave}
                onPreview={onPreview}
                propsFocus={propsFocus}
              />
              {/* 表单渲染区 */}
              <Canvas />
            </div>
            <PropsPanel />
          </div>
        </DndProvider>
      </EDITOR_CONTEXT.Provider>
      <PreviewModal
        visible={visible}
        onCancel={() => setVisible(false)}
        // footer={<Button onClick={async () => {
        //   const res = await form.validateFields();
        //   console.log(res, form.getFieldsValue());
        // }}>提交</Button>}
      >
        <FormRender form={form} schema={schema} onChange={onFormChange} />
      </PreviewModal>
    </div>
  );
}
