import React from 'react';
import { Row as AntRow, RowProps } from 'antd';

export default function Row({
  children,
  ...rest
}: RowProps & { [prop: string]: any }) {
  return <AntRow {...rest}>{children}</AntRow>;
}
