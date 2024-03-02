import React, { useMemo } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import {
  basePropConfigs,
  datePropConfig,
  formValidatorPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import moment from 'moment';
import useDateFormat from '../hooks/use-date-format';
import Icon from '../icon';

const { RangePicker } = AntDatePicker;

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: ['开始时间', '结束时间'],
  formProps: {
    dataType: {
      type: DataType.String,
      isList: true,
    },
  },
  format: 'YYYY-MM-DD HH:mm:ss',
};

// 属性配置区
export const propsConfig = {
  ...basePropConfigs,
  ...datePropConfig,
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'rangeDatePicker',
  title: '时间范围',
  groupName: '时间控件',
  icon: <Icon type="icon-shijianfanwei" />,
};

export default function RangeDatePicker(props: any) {
  const formatProps = useDateFormat(props.format);
  const onChange = (moments: moment.Moment[], dateStrings: string[]) => {
    props?.onChange?.(dateStrings, moments);
  };
  const valueString = useMemo(() => {
    if (props.value?.length) {
      if (typeof props.value[0] !== 'string') {
        return props.value;
      } else {
        return props.value.filter(Boolean).map((v: string) => moment(v));
      }
    }
    return [];
  }, [props.value]);
  // @ts-ignore
  return (
    <RangePicker
      {...props}
      {...formatProps}
      onChange={onChange}
      value={valueString}
    />
  );
}
