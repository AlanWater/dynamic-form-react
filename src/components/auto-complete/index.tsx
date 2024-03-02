import React, { useState, useMemo } from 'react';
import {
  AutoComplete as AntAutoComplete,
  AutoCompleteProps,
  SelectProps,
} from 'antd';
import {
  basePropConfigs,
  formValidatorPropConfigs,
  inputPropConfigs,
  optionsPropConfigs,
} from '../../common/base-prop-configs';
import { DataType } from '../../common/enum';
import Icon from '../icon';

// 属性配置区的默认属性值
export const defaultProps = {
  placeholder: '请输入',
  options: [
    {
      label: '选项一',
      value: '1',
    },
    {
      label: '选项二',
      value: '2',
    },
    {
      label: '选项三',
      value: '3',
    },
  ],
  optionsType: 'custom',
  formProps: {
    dataType: {
      type: DataType.String,
      isList: false,
    },
  },
};

// 属性配置区
export const propsConfig = {
  ...basePropConfigs,
  ...inputPropConfigs,
  ...optionsPropConfigs,
  ...formValidatorPropConfigs,
};

// 物料区配置
export const materialsConfig = {
  type: 'autoComplete',
  title: '自动完成',
  groupName: '输入控件',
  icon: <Icon type="icon-zidongwancheng" />,
};

export default function AutoComplete(props: AutoCompleteProps) {
  const [searchValue, setSearchValue] = useState<string>('');

  const onChange = (value: any, option: any) => {
    props?.onChange?.(value, option);
  };
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const onSelect = (value: string, option: any) => {
    props?.onChange?.(option.label, option);
  };

  const options = useMemo(() => {
    return props.options?.filter((opt) => {
      // @ts-ignore
      return opt?.label?.indexOf(searchValue) > -1;
    });
  }, [props.options, searchValue]);

  return (
    <AntAutoComplete
      {...props}
      options={options}
      onChange={onChange}
      onSelect={onSelect}
      onSearch={handleSearch}
    />
  );
}
