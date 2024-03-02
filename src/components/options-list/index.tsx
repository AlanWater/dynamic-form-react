import React from 'react';
import { List, ListProps, Tooltip } from 'antd';
import { OptionType } from 'antd/lib/select';
import SortableItem from '../sortable-item';
import YesNo from '../yes-no';
import {
  DragOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import Input from '../input';
import { moveItem, ItemTypes } from '../../common/drag-drop';

export interface OptionTypeProps extends Omit<OptionType, 'isSelectOption'> {
  checked?: boolean;
  [key: string]: any;
}

export default function OptionsList({
  value,
  onChange,
  mode = 'multiple',
}: ListProps<OptionType> & {
  index: number;
  value: OptionTypeProps[];
  onChange: (value: any[]) => void;
  mode?: 'single' | 'multiple';
}) {
  const handleChange = (item: OptionTypeProps, propName: string, val: any) => {
    item[propName] = val;
    onChange([...value]);
  };
  const handleCheckedChange = (item: OptionTypeProps, val: boolean) => {
    if (mode === 'single') {
      // 取消之前所有选中状态
      value?.forEach((v) => (v.checked = false));
    }
    handleChange(item, 'checked', val);
  };
  const handleAddOption = (index: number) => {
    value?.splice(index + 1, -1, {
      checked: false,
      label: '新增选项',
      value: '',
    });
    onChange([...value]);
  };
  const handleDeleteOption = (index: number) => {
    value?.splice(index, 1);
    onChange([...value]);
  };

  return (
    <div className={styles['options-list']}>
      <List
        dataSource={value}
        renderItem={(item: OptionTypeProps, index: number) => {
          return (
            <SortableItem
              key={index}
              row={item}
              onMove={(dragIndex: number, hoverIndex: number) => {
                const newList = moveItem(value, dragIndex, hoverIndex);
                onChange([...newList]);
              }}
              list={value}
              type={ItemTypes.optionsGroup.valueOf()}
            >
              <DragOutlined />
              <YesNo
                options={[
                  {
                    label: '',
                    value: '1',
                  },
                ]}
                onChange={(value) => handleCheckedChange(item, value)}
                value={item.checked || false}
                style={{ marginLeft: 4, marginRight: 4 }}
              />
              <Input
                onChange={(value) => handleChange(item, 'label', value)}
                width={60}
                value={item.label}
                style={{ marginLeft: 4 }}
              />
              <Input
                onChange={(value) => handleChange(item, 'value', value)}
                width={60}
                value={item.value}
                style={{ marginLeft: 4 }}
              />
              <div style={{ width: 40, display: 'flex', marginLeft: 4 }}>
                <Tooltip placement="top" title="新增">
                  <PlusCircleOutlined
                    onClick={() => handleAddOption(index)}
                    style={{
                      color: '#1ba5fa',
                      cursor: 'pointer',
                      marginRight: 4,
                    }}
                  />
                </Tooltip>
                <Tooltip placement="top" title="删除">
                  {value?.length > 1 ? (
                    <MinusCircleOutlined
                      onClick={() => handleDeleteOption(index)}
                      style={{ color: '#1ba5fa', cursor: 'pointer' }}
                    />
                  ) : null}
                </Tooltip>
              </div>
            </SortableItem>
          );
        }}
      />
    </div>
  );
}
