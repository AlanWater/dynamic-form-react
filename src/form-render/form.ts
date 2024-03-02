import { Element, Schema } from '../schema/interface';
import { FieldData } from 'rc-field-form/lib/interface';

// 比对前后两次schema并返回发生改变的value、只做浅比较
// 若不传preSchema、返回全量values
const getChangedValuesBySchema = (nextSchema: Schema, preSchema?: Schema) => {
  return Object.entries(nextSchema['elements']).reduce(
    (pre, [elementId, element]) => {
      const { props } = element;
      const { formProps } = props;
      if (!formProps?.name) return pre;
      const { name } = formProps;
      return {
        ...pre,
        [name]: props.value,
      };
    },
    {},
  );
};

// 根据fieldData返回values
const generateFieldData2Values = (fieldsValues: FieldData[]) => {
  return fieldsValues?.reduce((pre, field) => {
    const { name, value } = field;
    if (!(name as string[]).length) return pre;
    const fieldName = (name as string[])[0];
    return {
      [fieldName]: value,
    };
  }, {});
};

const FormUtils = {
  getChangedValuesBySchema,
  generateFieldData2Values,
};

export default FormUtils;
