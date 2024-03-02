import SchemaUtils from '../../schema/schema-utils';
import { useContext, createContext } from 'react';
import { EditorContextProps } from '../interface';

const initialValues: any = {
  modulesMap: {},
  schema: SchemaUtils.getInitialSchema(),
};

export const EDITOR_CONTEXT = createContext<EditorContextProps>(initialValues);

export default function useEditorContext() {
  const context: EditorContextProps = useContext(EDITOR_CONTEXT);
  return context;
}
