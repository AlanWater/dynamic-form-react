// 左侧物料区、提供可被拖拽的不同物料
import { modulesMapFactory } from '../../../common/modules-map';
import React, { useMemo } from 'react';
import useEditorContext from '../../../form-editor/hooks/use-editor-context';
import Icon from '../../../components/icon';
import styles from './index.less';
import dragItemHoc from '../../../hoc/drag-item';

interface CompLabelProps {
  title?: string;
  icon?: any;
}
// 左侧单个组件类型
const CompLabel = ({ title, icon }: CompLabelProps) => {
  return (
    <div className={styles['comp-label']}>
      {icon}
      {title}
    </div>
  );
};

// @ts-ignore
const Component = dragItemHoc(CompLabel);

export default function MaterialsArea() {
  const editorContext = useEditorContext();

  const { modulesMap } = editorContext;

  const groupModulesMap = useMemo(() => {
    return modulesMapFactory(modulesMap);
  }, [modulesMap]);

  return (
    <div className={styles['materials-area']}>
      {/* 遍历组件、生成左侧组件区域 */}
      {Object.entries(groupModulesMap).map(
        ([groupName, compValueArray], index) => {
          return (
            <div className={styles.group} key={index}>
              <div className={styles.title}>{groupName}</div>
              <div className={styles.items}>
                {compValueArray.map((module, jndex) => {
                  return (
                    <Component
                      title={module.materialsConfig?.title}
                      data={module}
                      icon={module.materialsConfig?.icon}
                      type={module.materialsConfig?.type}
                      __isModule__
                      style={{ width: 'auto', cursor: 'move' }}
                      key={jndex}
                    />
                  );
                })}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
