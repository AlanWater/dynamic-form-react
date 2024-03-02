// 专门用于处理左侧物料相关逻辑的工具
import { ModulesMap } from '../components/interface';

// 加工初始传入的modulesMap、进行分组处理
export const modulesMapFactory = (modulesMap: ModulesMap) => {
  return Object.entries(modulesMap).reduce(
    (
      pre: { [groupName: string]: Array<ModulesMap[keyof ModulesMap]> },
      [compType, compValue],
    ) => {
      const { materialsConfig } = compValue;
      const { groupName } = materialsConfig || {};
      if (!groupName) return pre;
      pre[groupName] = pre[groupName] || [];
      pre[groupName].push(compValue);
      return {
        ...pre,
      };
    },
    {},
  );
};
