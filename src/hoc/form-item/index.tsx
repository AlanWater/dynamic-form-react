import React, { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const noLabelTypes = ['divider'];

export default function formItemHoc(
  Component: React.FunctionComponent | React.ComponentClass,
) {
  // TODO: 接入antd formItem相关逻辑
  return ({ formProps, ...rest }: any) => {
    const {
      label,
      labelAlign,
      labelCol = {
        span: 4,
      },
      showLabel = true,
      name,
      required,
      requiredMessage,
      rules,
      labelWidth = '',
      realHideLabel = false,
    } = formProps;

    const ruleList = useMemo(() => {
      let list = [];
      if (required) {
        list.push({
          required,
          message: requiredMessage || `${label}必须填写`,
        });
      }
      const tempList = (rules || [])
        .map((rule: any) => {
          if (rule.pattern?.trim()) {
            let pattern = rule.pattern;
            let globalFlag = false;
            if (pattern?.[0] === '/') {
              pattern = pattern?.substring(1);
            }
            if (pattern?.[pattern?.length - 1] === '/') {
              pattern = pattern.substring(0, pattern.length - 1);
            }
            if (pattern?.[pattern?.length - 1] === 'g') {
              pattern = pattern.substring(0, pattern.length - 2);
              globalFlag = true;
            }
            if (rule.pattern) {
              try {
                pattern = new RegExp(pattern, globalFlag ? 'g' : '');
              } catch (e) {
                return rule;
              }
              return {
                ...rule,
                pattern,
                validator: (rule: any, value: any) => {
                  if (rule?.pattern?.test?.(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(rule.message || '正则不匹配'),
                  );
                },
              };
            } else {
              return rule;
            }
          } else {
            return undefined;
          }
        })
        .filter((r: any) => !!r);
      return [...list, ...tempList];
    }, [rules, requiredMessage, required, label]);
    const type = rest?.data?.type;
    const noLabel = noLabelTypes.includes(type);
    return (
      <div
        // @ts-ignore
        elementId={rest.__elementId__}
        style={{ width: '100%', height: 'auto' }}
        className={styles.formitem}
      >
        <FormItem
          name={name}
          key={rest.__elementId__}
          label={showLabel ? label || ' ' : realHideLabel || noLabel ? '' : ' '}
          labelAlign={labelAlign}
          colon={showLabel}
          labelCol={labelWidth ? { style: { width: labelWidth } } : labelCol}
          validateTrigger={['onBlur']}
          rules={ruleList}
        >
          <Component
            {...rest}
            key={rest.__elementId__}
            style={{ width: rest.width }}
          />
        </FormItem>
      </div>
    );
  };
}
