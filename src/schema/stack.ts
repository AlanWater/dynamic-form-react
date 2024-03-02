import { cloneDeep } from 'lodash';
import { Schema } from './interface';

export default class SchemaStack {
  private initSchema: Schema;
  private stack: Schema[] = [];
  // 存放取消操作
  private undoStack: Schema[] = [];
  constructor(schema: Schema) {
    this.initSchema = schema;
    this.push(schema);
  }
  push(schema: Schema) {
    // 进栈
    this.stack.push(cloneDeep(schema));
    this.undoStack = [];
  }
  undo() {
    if (this.stack?.length <= 1) return;
    // 取消当前操作、取消栈进栈
    this.undoStack.push(this.stack.pop()!);
  }
  redo() {
    if (this.undoStack?.length <= 0) return;
    // 撤回取消操作、并返回上一个被取消的状态
    this.stack.push(this.undoStack.pop()!);
  }
  getStack() {
    return this.stack;
  }
  getUndoStack() {
    return this.undoStack;
  }
  getTop() {
    return cloneDeep(this.stack?.[this.stack?.length - 1]);
  }
}
