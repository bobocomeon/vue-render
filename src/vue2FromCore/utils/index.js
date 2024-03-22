// 打开新页面
export function openNewPage(url, target = '_blank') {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.target = target;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
// is object
export function isObject(object) {
  return Object.prototype.toString.call(object) === '[object Object]';
}

// 定义的数据推导出shema类型
export const guessType = function guessType(value) {
  if (Array.isArray(value)) {
    return 'array';
  } if (typeof value === 'string') {
    return 'string';
  } if (typeof value === 'null') {
    return 'null';
  } if (typeof value === 'boolean') {
    return 'boolean';
  } if (!isNaN(value)) {
    return 'number';
  } if (typeof value === 'object') {
    return 'object';
  }
  return 'string';
}

// 获取给定schema类型
export function getSchemaType(schema) {
  const { type } = schema;
  // 通过const申明的常量 做类型推断
  if (!type && schema.const) {
    return guessType(schema.const);
  }
  // 枚举默认字符串
  if (!type && schema.enum) {
    return 'string';
  }
  // items 推断为 array 类型
  if (!type && (schema.items)) {
    return 'array';
  }
  // anyOf oneOf 不申明 type 字段
  if (!type && (schema.properties || schema.additionalProperties)) {
    return 'object';
  }
  if (type instanceof Array && type.length === 2 && type.includes('null')) {
    return type.find(curType => curType !== 'null');
  }
  return type;
}
// 字符串首字母小写
export function lowerCase (str) {
  if (undefined === str) return str;
  return String(str).replace(/^./, s => s.toLocaleLowerCase());
}