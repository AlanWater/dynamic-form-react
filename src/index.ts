export { default as FormEditor } from './form-editor';
export { default as FormRender } from './form-render';
export { default as FormPreview } from './form-render/form-preview';
export { default as modulesMap } from './components';
export { default as schemaUtils } from './schema/schema-utils';
import * as propsConfig from './common/base-prop-configs';
export { propsConfig };
export { DataType } from './common/enum';

import Icon from './components/icon';

const UIComponent = {
  Icon,
};

export { UIComponent };
