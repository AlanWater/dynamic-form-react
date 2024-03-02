// 表达式解析工具集

import { get } from 'lodash';

const eqFunc = (obj: any, path: string, value: any) => {
  return get(obj, path) === value;
};

// 解析表达式、返回结果
export const parseExpression = (
  // 数据源对象
  sourceObj: any,
  // 表达式
  expression: string,
) => {
  // TODO:目前只有eq、只是为了快速迭代业务、后面需要调研整体方案
  const eq = eqFunc.bind(this, sourceObj);
  return eval(expression);
};
