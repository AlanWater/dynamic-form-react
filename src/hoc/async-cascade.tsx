import { get } from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAsync, transformResponse } from './async';

interface IProps {
  // 异步请求服务地址
  url?: string;
  // 请求方式 1: 全量（一次性拿到所有数据）2: 逐级（只拿到当前选中的下一级数据）
  requestType?: '1' | '2';
  [rest: string]: any;
}

export default function asyncCascadeHoc(
  Component: React.FunctionComponent | React.ComponentClass,
  getHandle?: any,
) {
  return ({ url, requestType, paramName, ...rest }: IProps) => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    const fetchDataSource = async (url: string, targetOption?: any) => {
      // 使用外部传入的get请求方法或者默认的，主要用于业务场景自带token的请求
      const realUrl = targetOption
        ? `${url}?${rest.params || ''}&${paramName}=${targetOption?.value}`
        : url;
      const data = await (getHandle || fetchAsync)(realUrl);
      const options = transformResponse(
        data,
        rest?.labelPath,
        rest?.valuePath,
      )?.map((opt: any) => ({
        ...opt,
        isLeaf: opt.isLeaf || false,
      }));
      if (targetOption) {
        targetOption.loading = false;
        targetOption.children = options;
      }
      setDataSource([...(targetOption ? dataSource : options)]);
    };

    useEffect(() => {
      if (url) {
        fetchDataSource(`${url}?${rest.params || ''}`);
      }
    }, [url, rest.params, rest.labelPath, rest.valuePath]);

    const loadData = (selectedOptions: any) => {
      if (!url) return;
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      fetchDataSource(url, targetOption);
    };

    const asyncParams = useMemo(() => {
      const temp: any = {
        changeOnSelect: true,
      };
      if (requestType === '2') {
        temp.loadData = loadData;
        delete rest.showSearch;
      } else {
        temp.showSearch = true;
      }
      return {
        ...temp,
      };
    }, [requestType, rest.paramName, loadData]);

    const options = useMemo(() => {
      if (url) return dataSource || [];
      return rest.options;
    }, [dataSource, rest.options, requestType]);
    // @ts-ignore
    return (
      <Component {...rest} options={options} {...asyncParams} key="async" />
    );
  };
}
