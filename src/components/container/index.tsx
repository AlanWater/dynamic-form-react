// 中间画布层、提供拖拽后的组件释放能力
import React, { useRef, useMemo } from 'react';
import { ItemTypes } from '../../common/drag-drop';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { DragItem } from '../../form-editor/interface';
import Divider from '../divider';
import Row from '../row';
import Col from '../col';
import useEditorContext from '../../form-editor/hooks/use-editor-context';
import styles from './index.less';
import classNames from 'classnames';
import { PropConfigMap } from '../../common/base-prop-configs';
import BundingRect from '../../form-editor/components/bunding-rect';
import { ROOT_ID } from '../../schema/schema-utils';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  title: '',
  showBorder: true,
  rowNum: 1,
  colNum: 2,
};

// 属性配置区
export const propsConfig: PropConfigMap = {
  title: {
    type: 'input',
    formProps: {
      name: 'title',
      label: '容器标题',
    },
    props: {
      maxLength: 20,
      placeholder: '请输入容器标题',
    },
  },
  rowNum: {
    type: 'inputNumber',
    formProps: {
      name: 'rowNum',
      label: '行数',
    },
    props: {
      valueChangeTrigger: 'onBlur',
      min: 1,
    },
  },
  colNum: {
    type: 'inputNumber',
    formProps: {
      name: 'colNum',
      label: '列数',
    },
    props: {
      valueChangeTrigger: 'onBlur',
      min: 1,
    },
  },
  showBorder: {
    type: 'switch',
    formProps: {
      name: 'showBorder',
      label: '展示边框',
    },
  },
  width: {
    type: 'inputNumber',
    formProps: {
      name: 'width',
      label: '宽度',
    },
  },
  height: {
    type: 'inputNumber',
    formProps: {
      name: 'height',
      label: '高度',
    },
  },
  marginTop: {
    type: 'inputNumber',
    formProps: {
      name: 'marginTop',
      label: '上间距',
    },
  },
  marginBottom: {
    type: 'inputNumber',
    formProps: {
      name: 'marginBottom',
      label: '下间距',
    },
  },
};

// 物料区配置
export const materialsConfig = {
  type: 'container',
  title: '容器',
  groupName: '布局控件',
  icon: <Icon type="icon-rongqi" />,
};

interface ContainerProps {
  // 标题
  title?: string;
  // 是否展示边框
  showBorder?: boolean;
  // 子元素
  children?: React.ReactNode;
  // 行数
  rowNum: number;
  // 列数
  colNum: number;
  // 宽度
  width: React.CSSProperties['width'];
  // 高度
  height: React.CSSProperties['height'];
  [other: string]: any;
}

// 行容器
export default function Container({
  title = '',
  showBorder = true,
  rowNum = 1,
  colNum = 2,
  readOnly,
  disabled,
  schema: customSchema,
  modulesMap: customModulesMap,
  width = '100%',
  height = '100%',
  ...rest
}: ContainerProps) {
  const editorContext = useEditorContext();

  const clazz = classNames({
    'container': true,
    [styles.container]: true,
    [styles.header]: !!title,
    [styles.border]: showBorder,
    [styles.noborder]: !showBorder,
  });

  const schema = customSchema || editorContext.schema;
  const modulesMap = customModulesMap || editorContext.modulesMap;

  const { activeElementId } = editorContext;

  const { layout } = schema;
  const containerLayout: string[] = layout[rest.__elementId__] as string[];
  const renderComponent = (colId: string, index: number) => {
    const elementId = layout[colId]?.[0];
    if (!elementId) return null;
    const element = schema.elements[elementId];
    if (!element) return null;
    const { type, props } = element;
    const module = modulesMap[type];
    if (!module) return null;
    if (props.formProps?.hidden) return null;
    const Component = module.default;
    let renderResult = (
      <Component
        {...(module?.defaultProps || {})}
        {...props}
        data={element}
        key={elementId}
        ____elementId__={elementId}
        __parentElementId__={colId}
        __index__={index}
        readOnly={readOnly}
        disabled={disabled || props.disabled}
      />
    );
    // 如果存在被选中的元素id并和当前选中元素id相同且不为根元素，就需要进行选择包装
    if (
      activeElementId &&
      activeElementId === props.__elementId__ &&
      activeElementId !== ROOT_ID
    ) {
      renderResult = (
        <BundingRect __parentElementId__={colId} hideCopy key={elementId}>
          {renderResult}
        </BundingRect>
      );
    }
    return renderResult;
  };

  return (
    <div
      className={styles.box}
      style={{
        marginTop: rest.marginTop,
        marginBottom: rest.marginBottom,
        width,
        height,
      }}
    >
      <div className={clazz}>
        <Divider orientation={'left'} text={title} />
        {containerLayout?.map((rowId: string) => {
          const cols: string[] = layout[rowId] as string[];
          return (
            <Row
              gutter={[24, 24]}
              key={rowId}
              __elementId__={rowId}
              __parentElementId__={rest.__elementId__}
            >
              {cols?.map((colId: string, index: number) => {
                return (
                  <Col
                    key={colId}
                    span={24 / colNum}
                    __elementId__={colId}
                    __parentElementId__={rowId}
                    formRender={rest.formRender}
                  >
                    {renderComponent(colId, 0)}
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </div>
    </div>
  );
}
