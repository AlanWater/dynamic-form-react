import { OptionType } from 'antd/lib/select';
import { get } from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';

interface IProps {
  // 异步请求服务地址
  url?: string;
  [rest: string]: any;
}

export async function fetchAsync(url: string) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (e) {
    return {};
  }
}

export function transformResponse(data: any, label: string, value: string) {
  // label路径
  const labelPath = label?.split('.');
  const labelField: string = labelPath?.[labelPath?.length - 1] || 'label';
  // value路径
  const valuePath = value?.split('.');
  const valueField: string = valuePath?.[valuePath?.length - 1] || 'value';
  const list = get(data, labelPath?.slice(0, labelPath?.length - 1), []);
  return list?.map((d: any, index: number) => ({
    key: d[valueField] || index,
    label: d[labelField] || '',
    value: d[valueField] || index,
  }));
}

export default function asyncHoc(
  Component: React.FunctionComponent | React.ComponentClass,
  getHandle?: any,
) {
  return ({ url, ...rest }: IProps) => {
    const [dataSource, setDataSource] = useState();

    const fetchDataSource = async (url: string) => {
      // 使用外部传入的get请求方法或者默认的，主要用于业务场景自带token的请求
      const data = await (getHandle || fetchAsync)(url);
      setDataSource(transformResponse(data, rest?.labelPath, rest?.valuePath));
    };

    useEffect(() => {
      if (url) {
        fetchDataSource(`${url}?${rest.params || ''}`);
      }
    }, [url, rest.params, rest.labelPath, rest.valuePath]);

    const options = useMemo(() => {
      if (url) return dataSource || [];
      return rest.options;
    }, [dataSource, rest.options]);

    // @ts-ignore
    return <Component {...rest} options={options} key="async" />;
  };
}
