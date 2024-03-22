import retrieveSchema from '../schema/retriev';
import { getSchemaType } from './index';

// 通用的处理表达式方法
// 这里打破 JSON Schema 规范
const regExpression = /{{(.*)}}/;
function handleExpression(rootFormData, curNodePath, expression, fallBack) {
  // 未配置
  if (undefined === expression) {
    return undefined;
  }
  // 配置了 mustache 表达式
  const matchExpression = regExpression.exec(expression);
  regExpression.lastIndex = 0; // 重置索引
  if (matchExpression) {
    const code = matchExpression[1].trim();

    // eslint-disable-next-line no-new-func
    const fn = new Function('parentFormData', 'rootFormData', `return ${code}`);

    return fn(getPathVal(rootFormData, curNodePath, 1), rootFormData);
  }
  // 回退
  return fallBack();
}

/**
 * 单个匹配
 * 常量，或者只有一个枚举
 */

export function isConstant(schema) {
  return (
    (Array.isArray(schema.enum) && schema.enum.length === 1)
    || schema.hasOwnProperty('const')
  )
}
/**
 * 是否为选择列表
 * 枚举 或者 oneOf anyOf 每项都只有一个固定常量值
 * @param _schema
 * @param rootSchema
 * @returns {boolean|*}
 */

export function isSelect(_schema, rootSchema = {}) {
  const schema = retrieveSchema(_schema, rootSchema);
  const altSchemas = schema.oneof || schema.anyof;
  if (Array.isArray(schema.enum)) {
    return true;
  }
  if (Array.isArray(altSchemas)) {
    return altSchemas.every(altSchemasItem => isConstant(altSchemasItem));
  }
  return false;
} 

// 是否为多选
export function isMultiSelect(schema, rootSchema = {}) {
  if (!schema.uniqueItems || !schema.items) {
    return false;
  }
  return isSelect(schema.items, rootSchema);
}

// 解析当前节点 ui field
export function getUiField(FIELDS_MAP, {
  schema = {},
  uiSchema = {},
}) {
  const field = schema['ui:field'] || uischema['ui:field'];
  // vue组件，或者已注册的组件名
  if (typeof field === 'function' || typeof field === 'object' || typeof field === 'string') {
    return {
      field,
      fieldProps: uiSchema['ui:fieldProps'] || schema['ui:fieldProps'], // 自定义field ，支持传入额外的 props
    }
  }
  // 类型默认 field
  const fieldCtor = FIELDS_MAP[getSchemaType(schema)];
  if (fieldCtor) {
    return {
      field: fieldCtor
    };
  }
  // 如果包含 oneOf anyOf 返回空不异常
  // SchemaField 会附加onyOf anyOf信息
  if (!fieldCtor && (schema.anyOf || schema.oneOf)) {
    return {
        field: null
    };
  }
  // 不支持的类型
  console.error('当前schema:', schema);
  throw new Error(`不支持的field类型, type: ${schema.type}`);
}

// 是否为 hidden Widget
export function isHiddenWidget({
  schema = {},
  uiSchema = {},
  curNodePath = '',
  rootFormData = {}
}) {
  const widget = uiSchema['ui:widget'] || schema['ui:widget'];
  const hiddenExpression = uiSchema['ui:hidden'] || schema['ui:hidden'];
  // 支持配置 ui:hidden 表达式
  return widget === 'HiddenWidget' 
    || widget === 'hidden'
    || !!handleExpression(rootFormData, curNodePath, hiddenExpression, () => {
      // 配置了函数 function
      if (typeof hiddenExpression === 'function') {
          return hiddenExpression(getPathVal(rootFormData, curNodePath, 1), rootFormData);
      }

      // 配置了常量 ？？
      return hiddenExpression;
  });
}