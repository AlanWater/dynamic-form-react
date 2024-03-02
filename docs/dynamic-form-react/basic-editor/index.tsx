import React from 'react';
import FormEditor from '../../../src/form-editor';

export default function BasicEditor() {
  return (
    <FormEditor
      storage
      titleEditable
      onSave={(schema) => {
        console.log(schema);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 999,
      }}
    />
  );
}
