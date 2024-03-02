// schema json操作相关工具方法集
import { MaterialConfig, Module } from '../form-editor/interface';
import { PropConfig } from '../components/interface';
import { Element, FormProps, Schema } from './interface';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, get, set } from 'lodash';
import { defaultProps as pageDefaultProps } from '../components/page-container';

export const ROOT_ID = 'pageContainer';

const generateElementId = (type: string) => {
  return `${type}-${uuidv4()}`.replaceAll('-', '_');
};

// 判断是否容器组件
export const containerTypes = ['container', 'pageContainer'];

const getInitialFormProps = (
  propsConfig: PropConfig[],
  materialsConfig: MaterialConfig,
  elementId: string,
) => {
  let formProps: FormProps = {
    name: elementId,
    label: materialsConfig.title,
    showLabel: true,
    labelWidth: 148,
  };
  return formProps;
};

export const parseModule2Element = (module: Module): Element => {
  const { defaultProps = {}, materialsConfig, propsConfig } = module;

  const type = materialsConfig?.type!;
  const elementId = generateElementId(type);

  return {
    type,
    props: {
      __elementId__: elementId,
      __isModule__: true,
      ...defaultProps,
      formProps: {
        ...getInitialFormProps(
          Object.values(propsConfig || {}),
          materialsConfig!,
          elementId,
        ),
        ...defaultProps.formProps,
      },
    },
  };
};

// 获取对应element所在容器节点的位置
const getOffset = (schema: Schema, parentId: string, elementId: string) => {
  return schema.layout[parentId]?.indexOf(elementId);
};

// 插入普通元素（非容器）
const insertNormal = (
  schema: Schema,
  element: Element,
  parentId: string = ROOT_ID,
  targetIndex?: number,
) => {
  const { layout, form } = schema;
  const elementId = element.props.__elementId__;
  // 设置form.name跟元素的映射关系
  if (element.props.formProps?.name) {
    form[element.props.formProps.name] = elementId;
  }
};

// 生辰初始化的row元素
const generateRowElement = (): Element => {
  return {
    type: 'row',
    props: {
      __elementId__: generateElementId('row'),
      __isModule__: false,
    },
  };
};
// 生成初始化的col元素
const generateColElement = (): Element => {
  return {
    type: 'col',
    props: {
      __elementId__: generateElementId('col'),
      __isModule__: false,
    },
  };
};

const insertContainer = (
  schema: Schema,
  element: Element,
  parentId: string = ROOT_ID,
  targetIndex?: number,
) => {
  const { layout, elements } = schema;
  if (element.type === 'container') {
    // 生成行
    const { rowNum, colNum } = element.props;
    for (let rowIdx = 0; rowIdx < rowNum; rowIdx++) {
      const row = generateRowElement();
      const rowElementId = row.props.__elementId__;
      elements[rowElementId] = row;
      layout[element.props.__elementId__] =
        layout[element.props.__elementId__] || [];
      (layout[element.props.__elementId__] as string[]).push(rowElementId);
      for (let colIdx = 0; colIdx < colNum; colIdx++) {
        const col = generateColElement();
        const colElementId = col.props.__elementId__;
        elements[colElementId] = col;
        layout[rowElementId] = layout[rowElementId] || [];
        (layout[rowElementId] as string[]).push(colElementId);
        layout[colElementId] = layout[colElementId] || [];
      }
    }
  }
};

// 插入操作、指定某个元素的位置插入
export const insertElement = (
  schema: Schema,
  element: Element,
  parentId: string = ROOT_ID,
  targetIndex: number,
  replaceFlag?: boolean,
): Schema => {
  const { elements, layout } = schema;
  const elementId = element.props.__elementId__;
  layout[parentId] = layout[parentId] || [];
  // 将元素添加到elements集中
  elements[elementId] = element;
  if (replaceFlag) {
    // 如果是替换的，直接进行替换、并删除当前位置的元素
    deleteElement(schema, parentId, layout[parentId][targetIndex]);
    (layout[parentId] as string[])[targetIndex] = element.props.__elementId__;
  } else {
    // 找到位置、插入到所在元素后面
    (layout[parentId] as string[]).splice(targetIndex, -1, elementId);
  }
  if (!containerTypes.includes(element.type)) {
    insertNormal(schema, element, parentId, targetIndex);
  } else {
    // 插入容器
    insertContainer(schema, element, parentId, targetIndex);
  }
  // 处理插入操作
  return {
    ...schema,
  };
};
// 删除元素操作、删除指定元素
export const deleteElement = (
  schema: Schema,
  parentId: string = ROOT_ID,
  elementId: string,
): [Schema, string] => {
  const { elements, layout, form } = schema;
  const element = elements[elementId];
  if (!element) {
    return [
      {
        ...schema,
      },
      '',
    ];
  }
  // 删除表单和元素的映射关系
  if (element.props.formProps?.name) {
    delete form[element.props.formProps.name];
  }
  // 删除elements中的元素
  if (elements[elementId]) delete elements[elementId];
  // 删除layout中的元素
  const parent: string[] = layout[parentId] as string[];
  const deleteIndex = parent?.findIndex((ele) => ele === elementId);
  if (layout[elementId]) delete layout[elementId];
  let lastElementId;
  parent.splice(deleteIndex, 1);
  if (deleteIndex === 0) {
    lastElementId = parent[0];
  } else if (deleteIndex === parent?.length) {
    lastElementId = parent[parent?.length - 1];
  } else {
    lastElementId = parent[deleteIndex];
  }
  // 处理删除操作
  return [
    {
      ...schema,
    },
    lastElementId,
  ];
};

const deleteRecursion = (
  schema: Schema,
  parentId: string = ROOT_ID,
  elementId: string,
) => {
  const nextElements = schema.layout[elementId] as string[];
  const len = nextElements?.length;
  for (let i = len - 1; i >= 0; i--) {
    const ele = nextElements[i];
    deleteRecursion(schema, elementId, ele);
    deleteElement(schema, elementId, ele);
  }
};

// 如果是容器、需要递归删除
export const deleteContainer = (
  schema: Schema,
  parentId: string = ROOT_ID,
  elementId: string,
): [Schema, string] => {
  // 删除layout中的元素
  const parent: string[] = schema.layout[parentId] as string[];
  const deleteIndex = parent.findIndex((ele) => ele === elementId);
  let lastElementId = parent[deleteIndex - 1];
  deleteRecursion(schema, parentId, elementId);
  deleteElement(schema, parentId, elementId);
  // 处理删除操作
  return [
    {
      ...schema,
    },
    lastElementId,
  ];
};

// 移动元素
export const moveElement = (
  schema: Schema,
  srcParentId: string = ROOT_ID,
  srcIndex: number,
  tarParentId: string = ROOT_ID,
  tarIndex: number,
  dropInContainer = false,
): Schema => {
  // 如果相等说明未移动、不需要进行移动操作
  if (srcIndex === tarIndex && tarParentId === srcParentId) {
    return schema;
  }
  const srcParent = schema.layout[srcParentId] as string[];
  const tarParent = schema.layout[tarParentId] as string[];
  // 如果是同一个父节点，则需要进行移动
  if (srcParentId === tarParentId) {
    const temp = srcParent[srcIndex];
    if (srcIndex < tarIndex) {
      // 插入
      srcParent.splice(tarIndex + 1, -1, temp);
      // 删除
      srcParent.splice(srcIndex, 1);
    } else {
      // 删除
      srcParent.splice(srcIndex, 1);
      // 插入
      srcParent.splice(tarIndex, -1, temp);
    }
  } else {
    // 不在一个父节点中、直接移动
    // @ts-ignore
    srcParent[srcIndex] = srcParent[srcIndex] || [];
    // @ts-ignore
    tarParent[tarIndex] = tarParent[tarIndex] || [];
    const temp = srcParent[srcIndex];
    if (dropInContainer) {
      const removeElement = tarParent[0];
      // 如果是容器控件、直接替换而不是插入
      tarParent[0] = temp;
      // 删除被替换的元素
      delete schema.elements[removeElement];
      delete schema.layout[removeElement];
    } else {
      // 移动到目标位置
      tarParent.splice(tarIndex, -1, temp);
    }
    // 删除起始目标
    srcParent.splice(srcIndex, 1);
  }
  // 处理交换操作
  return {
    ...schema,
  };
};

// 交换两个元素所在的位置
export const swapElement = (
  schema: Schema,
  srcParentId: string = ROOT_ID,
  srcIndex: number,
  tarParentId: string = ROOT_ID,
  tarIndex: number,
): Schema => {
  const srcParent = schema.layout[srcParentId] as string[];
  const tarParent = schema.layout[tarParentId] as string[];
  // 必须存在可拖拽的才能交换
  if (srcParent[srcIndex]) {
    const temp = srcParent[srcIndex];
    srcParent[srcIndex] = tarParent[tarIndex];
    tarParent[tarIndex] = temp;
  }
  // 处理交换操作
  return {
    ...schema,
  };
};

// 复制元素到下一个位置
export const copyElement = (
  schema: Schema,
  parentElementId: string,
  elementId: string,
): [Schema, string] => {
  const parent: string[] = schema.layout[parentElementId] as string[];
  const element: Element = schema.elements[elementId];
  const copyIndex = parent.findIndex((ele) => ele === elementId);
  if (copyIndex < 0) return [schema, elementId];
  const copyElement = cloneDeep(element);
  const copyElementId = generateElementId(element.type);
  copyElement.props.__elementId__ = copyElementId;
  if (copyElement.props.formProps) {
    copyElement.props.formProps.name = copyElementId;
  }
  parent.splice(copyIndex + 1, -1, copyElementId);
  schema.elements[copyElementId] = copyElement;
  return [
    {
      ...schema,
    },
    copyElementId,
  ];
};

// 获得初始化的内容
export const getInitialSchema = (): Schema => {
  return {
    elements: {
      pageContainer: {
        type: ROOT_ID,
        props: {
          __isModule__: false,
          __elementId__: generateElementId(ROOT_ID),
          // 页面本身不可被拖拽
          draggable: false,
          ...pageDefaultProps,
        },
      },
    },
    layout: {
      root: ROOT_ID,
      pageContainer: [],
    },
    form: {},
  };
};
// 转换表单属性
export const transformSchema = (
  schema: Schema,
  itemDraggable: boolean = false,
): Schema => {
  const { layout, elements } = schema;
  Object.entries(elements)?.forEach(([elementId, element]) => {
    if (element.type !== ROOT_ID) {
      element.props.draggable = itemDraggable;
    }
  });
  return {
    ...schema,
  };
};

// 删除行
const deleteContainerRow = (schema: Schema, element: Element) => {
  const { layout, elements } = schema;
  const rows = layout[element.props.__elementId__];
  const row = rows?.[rows?.length - 1];
  if (row) {
    const cols = layout[row];
    // 循环删除列
    for (let colIdx = 0; colIdx < cols?.length; colIdx++) {
      const colElementId = cols[colIdx];
      delete elements[colElementId];
      const innerElement = layout[colElementId]?.[0];
      if (innerElement) {
        delete elements[innerElement];
        delete layout[innerElement];
      }
      delete layout[colElementId];
    }
    // 删除行
    delete elements[row];
    delete layout[row];
    (rows as string[]).pop();
  }
};
// 新增行
const addContainerRow = (schema: Schema, element: Element) => {
  const { layout, elements } = schema;
  layout[element.props.__elementId__] =
    layout[element.props.__elementId__] || [];
  const rowElement = generateRowElement();
  const rowElementId = rowElement.props.__elementId__;
  (layout[element.props.__elementId__] as string[]).push(
    rowElement.props.__elementId__,
  );
  elements[rowElementId] = rowElement;
  layout[rowElementId] = [];
  const colNum = element.props.colNum || 2;
  // 添加列
  for (let colIdx = 0; colIdx < colNum; colIdx++) {
    const col = generateColElement();
    const colElementId = col.props.__elementId__;
    elements[colElementId] = col;
    layout[rowElementId] = layout[rowElementId] || [];
    (layout[rowElementId] as string[]).push(colElementId);
    layout[colElementId] = layout[colElementId] || [];
  }
};
// 容器行操作
const doContainerRows = (
  schema: Schema,
  element: Element,
  preValue: any,
  nextValue: any,
) => {
  let dec = nextValue - preValue;
  let delFlag = false;
  if (dec < 0) {
    delFlag = true;
    dec = Math.abs(dec);
  }
  for (let idx = 0; idx < dec; idx++) {
    if (!delFlag) {
      addContainerRow(schema, element);
    } else {
      deleteContainerRow(schema, element);
    }
  }
};
// 删除列
const deleteContainerCol = (schema: Schema, element: Element) => {
  const { layout, elements } = schema;
  const rows = layout[element.props.__elementId__];
  for (let rowIdx = 0; rowIdx < rows?.length; rowIdx++) {
    const rowElementId = rows[rowIdx];
    const cols = layout[rowElementId] as string[];
    const colElementId = cols?.[cols?.length - 1];
    if (colElementId) {
      delete elements[colElementId];
      const innerElement = layout[colElementId]?.[0];
      if (innerElement) {
        delete elements[innerElement];
        delete layout[innerElement];
      }
      delete layout[colElementId];
    }
    cols?.pop();
  }
};
// 新增列
const addContainerCol = (schema: Schema, element: Element) => {
  const { layout, elements } = schema;
  const rows = layout[element.props.__elementId__];
  for (let rowIdx = 0; rowIdx < rows?.length; rowIdx++) {
    const rowElementId = rows[rowIdx];
    const cols = (layout[rowElementId] as string[]) || [];
    const colElement = generateColElement();
    cols.push(colElement.props.__elementId__);
    elements[colElement.props.__elementId__] = colElement;
  }
};
// 容器列操作
const doContainerCols = (
  schema: Schema,
  element: Element,
  preValue: any,
  nextValue: any,
) => {
  let dec = nextValue - preValue;
  let delFlag = false;
  if (dec < 0) {
    delFlag = true;
    dec = Math.abs(dec);
  }
  for (let idx = 0; idx < dec; idx++) {
    if (!delFlag) {
      addContainerCol(schema, element);
    } else {
      deleteContainerCol(schema, element);
    }
  }
};

export const setValues = (
  schema: Schema,
  elementId: string,
  values: { [name: string]: any },
) => {
  const element: Element = schema.elements[elementId];
  if (element) {
    Object.entries(values).forEach(([name, value]) => {
      let val = value;
      // 若name为formProps.name修改form中的映射
      if (name === 'formProps.name') {
        const field = get(element, `props.${name}`);
        delete schema.form[field];
        schema.form[value] = elementId;
      }
      // 如果是容器组件、需要对schema进行操作来修改行列关系
      if (element.type === 'container') {
        const preValue = get(element, `props.${name}`);
        if (name === 'rowNum') {
          // 行操作
          doContainerRows(schema, element, preValue, value);
        }
        if (name === 'colNum') {
          // 列操作
          doContainerCols(schema, element, preValue, value);
        }
      }
      // 如果是描述组件、将展示标题设置为false
      if (element.type === 'text') {
        const preValue = get(element, `props.${name}`);
        if (name === 'contentType') {
          // 重置隐藏标题选项，1: 正文显示label 2: 标题隐藏label
          set(element, 'props.formProps.showLabel', value === '1');
        }
      }
      if (element.type === 'switch') {
        val = !!val;
      }
      // if (element.type === 'pageContainer') {
      //   if (name === 'heightWidthType') {
      //     // 如果单位类型发生变化、重置默认值
      //     set(element, 'props.height', '');
      //     set(element, 'props.width', '');
      //   }
      // }
      // 修改属性
      set(element, `props.${name}`, val);
    });
  }
  return {
    ...schema,
  };
};

export const updateSchema = (schema: Schema, values: any): Schema => {
  Object.entries(values).forEach(([name, value]) => {
    if (!name) return;
    const elementId = schema.form?.[name];
    if (!elementId) return;
    const element = schema.elements[elementId];
    if (!element) return;
    element.props.value = value;
  });
  return {
    ...schema,
  };
};

// 做一些脏检查、返回干净的schema
export const parseCleanSchema = (schema: Schema): Schema => {
  const newSchema = cloneDeep(schema);
  // 去掉pagecontainer中不干净的值
  const { layout } = newSchema;
  layout[ROOT_ID] = (layout[ROOT_ID] as string[])?.filter(
    (eleId) => !!eleId?.length,
  );
  return {
    ...newSchema,
  };
};

const SchemaUtils = {
  insertElement,
  deleteElement,
  swapElement,
  moveElement,
  updateSchema,
  getInitialSchema,
  transformSchema,
  parseModule2Element,
  setValues,
  copyElement,
  deleteContainer,
  parseCleanSchema,
};

export default SchemaUtils;
