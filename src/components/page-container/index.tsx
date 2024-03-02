// 表单根元素、用于解析表单页面级别本身
import React, { useMemo } from 'react';
import { PropConfigMap } from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import styles from './index.less';

// 属性配置区的默认属性值
export const defaultProps = {
  title: '',
  heightWidthType: '2',
  height: 100,
  width: 100,
};

// 属性配置区
export const propsConfig: PropConfigMap = {
  title: {
    type: 'textarea',
    formProps: {
      name: 'title',
      label: '模板名称',
      required: true,
      requiredMessage: '请输入模板名称',
    },
    props: {
      maxLength: 20,
      placeholder: '请输入模板名称',
      showCount: true,
      rows: 1,
      className: styles['page-title'],
    },
  },
  // no: {
  //   type: 'input',
  //   formProps: {
  //     name: 'no',
  //     label: '模板编号',
  //   },
  //   props: {
  //     disabled: true,
  //   },
  // },
  heightWidthType: {
    type: 'radio',
    formProps: {
      name: 'heightWidthType',
      label: '单位类型',
    },
    props: {
      options: [
        {
          label: '自适应(%)',
          value: '2',
        },
        {
          label: '固定值(px)',
          value: '1',
        },
      ],
      optionType: 'button',
    },
  },
  width: {
    type: 'inputNumber',
    hiddenExpression: 'eq("heightWidthType", "2")',
    formProps: {
      name: 'width',
      label: '宽度(px)',
    },
    props: {
      max: 4880,
      min: 1,
      value: 1024,
    },
  },
  height: {
    type: 'inputNumber',
    hiddenExpression: 'eq("heightWidthType", "2")',
    trigger: ['blur'],
    formProps: {
      name: 'height',
      label: '高度(px)',
    },
    props: {
      max: 4880,
      min: 1,
      value: 768,
    },
  },
  widthPercent: {
    type: 'inputNumber',
    hiddenExpression: 'eq("heightWidthType", "1")',
    trigger: ['blur'],
    formProps: {
      name: 'widthPercent',
      label: '宽度(%)',
    },
    props: {
      max: 100,
      min: 1,
      value: 100,
    },
  },
  heightPercent: {
    type: 'inputNumber',
    hiddenExpression: 'eq("heightWidthType", "1")',
    formProps: {
      name: 'heightPercent',
      label: '高度(%)',
    },
    props: {
      max: 100,
      min: 1,
      value: 100,
    },
  },
  desc: {
    type: 'textarea',
    formProps: {
      name: 'desc',
      label: '模版说明',
    },
    props: {
      maxLength: 50,
    },
  },
  mark: {
    type: 'textarea',
    formProps: {
      name: 'mark',
      label: '备注',
    },
    props: {
      maxLength: 200,
    },
  },
};

// 属性配置区
// 物料区配置
export const materialsConfig = {
  type: 'input',
  title: '页面容器',
  dataType: {
    type: DataType.String,
    isList: false,
  },
};

export default function PageContainer({
  children,
  width,
  height,
  widthPercent,
  heightPercent,
  heightWidthType = '2',
}: {
  children?: React.ReactNode;
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  widthPercent?: React.CSSProperties['width'];
  heightPercent?: React.CSSProperties['height'];
  heightWidthType?: '1' | '2';
}) {
  const [styleWidth, styleHeight] = useMemo(() => {
    return heightWidthType === '2'
      ? [`${widthPercent || 100}%`, `${heightPercent || 100}%`]
      : [width, height];
  }, [width, height, heightWidthType, widthPercent, heightPercent]);

  return (
    <div
      className={styles['page-container']}
      style={{ width: styleWidth, height: styleHeight }}
    >
      {children}
    </div>
  );
}
