import SchemaStack from '../schema/stack';
import { DropTargetMonitor } from 'react-dnd';
import { ModulesMap } from '../components/interface';
import { Element, Schema } from '../schema/interface';

export interface FormEditorProps {
  className?: string;
  style?: React.CSSProperties;
  schema?: Schema;
  modulesMap?: ModulesMap;
  onSave?: (schema: Schema) => void;
  onPreview?: (schma: Schema) => void;
  // 是否本地缓存、默认不缓存
  storage?: boolean;
  onSchemaChange?: (schema: Schema) => void;
  // 业务自带的get请求方法
  getHandle?: any;
  // title是否可编辑
  titleEditable?: boolean;
}

export type DragDataType = Module | Element;
// 记录位置相关信息
export interface PositionState {
  srcIndex?: number;
  tarIndex?: number;
  hoverIndex?: number;
  preHoverIndex?: number;
  // 同时在多个container之上
  overContainerList?: string[];
}
export interface EditorContextProps {
  modulesMap: ModulesMap;
  schema: Schema;
  updateSchema: (schema: Schema) => void;
  onDrop: (
    module: DragDataType,
    monitor: DropTargetMonitor,
    srcParentElementId?: string,
    tarParentElementId?: string,
  ) => void;
  onSelect: (elementId: string) => void;
  onCopy: (parentElementId: string) => void;
  onDelete: (parentElementId: string) => void;
  reset: () => void;
  activeElementId: string;
  onPropsBlur: () => void;
  onPropsFocus: () => void;
  // 是否属性编辑中
  propsFocus: boolean;
  propsChange: (elementId: string, values: { [field: string]: any }) => void;
  // 拖拽到容器中
  onDropInContainer: (
    data: DragItem,
    tarParentElementId: string,
    srcParentElementId?: string,
  ) => void;
  onHover: (state: PositionState) => void;
  positionState: PositionState;
  schemaStack: SchemaStack;
}

export type Module = ModulesMap[keyof ModulesMap];

export interface MaterialConfig {
  type: string;
  title: string;
  groupName?: string;
  // 图标
  icon?: any;
}

export interface DragItem {
  // 拖拽组件的传输数据
  data: DragDataType;
  // hover元素的上方或者下方
  hoverPosition?: 'top' | 'bottom';
  // 在容器中的位置
  __index__: number;
  // 元素id
  elementId: string;
  // 父元素节点id
  parentElementId: string;
  // 组件类型
  type: string;
  // 插入位置
  insertIndex: number;
}
