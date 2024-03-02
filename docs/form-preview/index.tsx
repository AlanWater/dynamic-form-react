import React, { useEffect, useState } from 'react';
import SchemaUtils from '../../src/schema/schema-utils';
import queryString from 'querystring';
import FormPreview from '../../src/form-render/form-preview';
import { Button } from 'antd';
import FormRender from '../../src/form-render';

export default function Preview() {
  const [schema, setSchema] = useState(SchemaUtils.getInitialSchema());
  const { schemaId } =
    queryString.parse(window.location.search.substring(1)) || {};
  const [form] = FormRender.useForm();

  useEffect(() => {
    if (schemaId) {
      const localSchema = localStorage.getItem(schemaId as string);
      if (localSchema) {
        setSchema(JSON.parse(localSchema));
      }
    }
  }, [schemaId]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 999,
        background: '#F4F6F9',
      }}
    >
      <Button
        onClick={() => {
          form.resetFields();
        }}
      >
        清空
      </Button>
      <Button
        onClick={() => {
          form.validateFields();
        }}
      >
        校验
      </Button>
      <FormPreview form={form} schemaList={[schema, schema]} />
    </div>
  );
}
