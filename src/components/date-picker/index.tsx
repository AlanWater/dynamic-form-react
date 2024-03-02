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

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请输入',
  formProps: {
    dataType: {
      type: DataType.String,
      isList: false,
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
  type: 'datePicker',
  title: '时间选择',
  groupName: '时间控件',
  icon: <Icon type="icon-shijian" />,
};

export default function DatePicker(props: any) {
  const formatProps = useDateFormat(props.format);

  const onChange = (moment: moment.Moment, dateString: string) => {
    props?.onChange?.(dateString, moment);
  };

  const valueString = useMemo(() => {
    if (props.value) {
      if (typeof props.value !== 'string') {
        return props.value;
      } else {
        return moment(props.value);
      }
    }
    return '';
  }, [props.value]);
  // @ts-ignore
  return (
    <AntDatePicker
      {...props}
      {...formatProps}
      onChange={onChange}
      value={valueString}
    />
  );
}
