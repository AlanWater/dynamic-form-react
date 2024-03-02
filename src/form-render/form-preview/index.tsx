import React, { useState, useEffect, useMemo } from 'react';
import { Anchor, Divider, FormInstance } from 'antd';
import { Schema } from '../../schema/interface';
import styles from './index.less';
import { ROOT_ID } from '../../schema/schema-utils';
import FormRender from '../';
import classNames from 'classnames';
import { ModulesMap } from '@/components/interface';

const { Link } = Anchor;

export interface FormPreviewProps {
  schemaList: Schema[];
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
  anchorStyle?: React.CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  showExtraTitle?: boolean;
  extraTitle?: (schema: Schema, index: number) => React.ReactNode;
  anchorTitle?: (schema: Schema, index: number) => React.ReactNode;
  showHeader?: boolean;
  form?: FormInstance;
  modulesMap?: ModulesMap;
}

export default function FormPreview({
  schemaList,
  title,
  toolbar,
  anchorStyle,
  disabled = false,
  readOnly = false,
  showExtraTitle = false,
  extraTitle,
  anchorTitle,
  showHeader = true,
  form,
  modulesMap,
}: FormPreviewProps) {
  const [refresh, setRefresh] = useState(false);

  const headerRef = React.useRef(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [anchorTop, setAnchorTop] = useState<any>();
  const [anchorRight, setAnchorRight] = useState<any>();

  const { top, left, width } =
    contentRef?.current?.getBoundingClientRect() || {};

  const height = `calc(100vh - ${top ? `${top + 24}px` : ''})`;

  const calcRight = () => {
    let anchorRight =
      window.document.body.clientWidth - (left || 0) - (width || 0) - 168;
    if (anchorRight < 24) {
      anchorRight = 24;
    }
    setAnchorRight(anchorRight);
  };

  const targetOffset = (contentRef?.current?.clientHeight || 0) / 2;

  useEffect(() => {
    calcRight();
    window.addEventListener('resize', () => {
      setRefresh(true);
    });
  }, []);

  useEffect(() => {
    calcRight();
    if ((top || top === 0) && !anchorTop) {
      setAnchorTop(top);
    }
  }, [contentRef, top, left, width]);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <div className={styles['form-preview']}>
      {showHeader ? (
        <div className={styles.header} ref={headerRef}>
          <div className={styles.title}>
            {title ||
              schemaList?.[0]?.elements[ROOT_ID].props.title ||
              '请输入模板名称'}
          </div>
          <div className={styles.toolbar}>{toolbar}</div>
        </div>
      ) : null}
      <div
        className={classNames({
          [styles.content]: true,
          'form-content': true,
        })}
        ref={contentRef}
        style={{ height }}
      >
        {schemaList?.map((schema, index) => {
          return (
            <>
              <div id={`schema${index}`} />
              <FormRender
                schema={schema}
                key={index}
                showExtraTitle={showExtraTitle || schemaList?.length > 1}
                extraTitle={extraTitle}
                disabled={disabled}
                readOnly={readOnly}
                index={index}
                form={form}
                modulesMap={modulesMap}
              />
              {index !== schemaList?.length - 1 ? <Divider /> : null}
            </>
          );
        })}
        {schemaList?.length > 1 ? (
          <Anchor
            style={{ top: '35%', right: anchorRight, ...anchorStyle }}
            // @ts-ignore
            getContainer={() => contentRef?.current || document.body}
            targetOffset={targetOffset}
            className={styles.anchor}
          >
            {schemaList?.map((schema, index) => {
              return (
                <Link
                  href={`#schema${index}`}
                  title={
                    anchorTitle
                      ? anchorTitle?.(schema, index)
                      : schema.elements?.[ROOT_ID]?.props?.title
                  }
                />
              );
            })}
          </Anchor>
        ) : null}
      </div>
      <div style={{ height: 24 }}></div>
    </div>
  );
}
