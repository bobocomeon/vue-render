import { isObject } from '../utils/index';
import { intersection } from '../utils/arrayUtils';  
import findSchemaDefinition from './findSchemaDefinition';

export default function retrieveSchema(schema, rootSchema = {}, formData = {}) {
  if (!isObject(schema)) {
    return {};
  }
  return resolveSchema(schema, rootSchema, formData);
}

export function resolveAllOf(schema, rootSchema, formData) {
  const resolvedAllOfRefSchema = {
    ...schema,
    allOf: schema.allOf.map(allOfItem => retrieveSchema(allOfItem, rootSchema, formData))
  };
  try {
    const { allOf, ...originProperties } = resolvedAllOfRefSchema;
    return mergeSchemaAllOf(originProperties, ...allOf)
  } catch (e) {
    console.error(`无法合并allOf，丢弃allOf配置继续渲染: \n${e}`);
    // eslint-disable-next-line no-unused-vars
    const { allOf: errAllOf, ...resolvedSchemaWithoutAllOf } = resolvedAllOfRefSchema;
    return resolvedSchemaWithoutAllOf;
  }
}

// resolve Schema
function resolveSchema(schema, rootSchema = {}, formData = {}) {
  // allOf 、$ref、dependencies 可能被同时配置
  // allOf
  if (schema.hasOwnProperty('allOf')) {
    schema = resolveSchema(schema, rootSchema, formData);
  }
  // $ref
  if (schema.hasOwnProperty('$ref')) {
    schema = resolveReference(schema, rootSchema, formData);
  }
  return schema;
}
// resolve Schema - $ref
function resolveReference(schema, rootSchema, formData) {
  const $refSchema = findSchemaDefinition(schema.$ref, rootSchema);
  const { $ref, ...localSchema } = schema;
  return retrieveSchema(
    { ...$refSchema, ...localSchema },
    rootSchema,
    formData,
  )
}
// 深度递归合并 合并allOf的每2项
function mergeSchemaAllOf(...args) {
  if (args.length < 2) return args[0];
  let preVal = {};
  const copyArgs = [...args];
  while (copyArgs.length >= 2) {
    const obj1 = isObject(copyArgs[0]) ? copyArgs[0] : {};
    const obj2 = isObject(copyArgs[1]) ? copyArgs[1] : {};
    preVal = Object.assign({}, obj1);
    Object.keys(obj2).reduce((acc, key) => {
      const left = obj1[key];
      const right = obj2[key];
      // 左右一边为object
      if (isObject(left) || isObject(right)) {
        // 两边同时为object
        if (isObject(left) && isObject(right)) {
          acc[key] = mergeSchemaAllOf(left, right);
        } else {
          // 其中一边为object
          const [objTypeData, baseTypeData] = isObject(left) ? [left, right] : [right, left];
          if (key === 'additionalProperties') {
            // 适配类型： 一边配置了对象一边没配置或者true false
            // {
            //     additionalProperties: {
            //         type: 'string',
            //     },
            //     additionalProperties: false
            // }
            // 如果不是对象的那一方(baseTypeData)为true，则表示附加属性是允许的，因此保留对象类型的定义(objTypeData)。
            // 否则，设置additionalProperties为false，表示不允许任何未在模式中定义的附加属性。
            acc[key] = baseTypeData === true ? objTypeData : false;
          } else {
            acc[key] = objTypeData;
          }
        }
      } else if (Array.isArray(left) || Array.isArray(right)) {
        // 同为数组取交集
        if (Array.isArray(left) && Array.isArray(right)) {
          // 数组里面嵌套对象不支持 因为我不知道该怎么合并
          if (isObject(left[0]) || isObject(right[0])) {
            throw new Error('暂不支持如上数组对象元素合并');
          }
          // 交集
          const intersectionArray = intersection([].concat(left), [].concat(right));
          // 没有交集
          if (intersectionArray.length <= 0) {
            throw new Error('无法合并如上数据');
          }
          if (intersectionArray.length === 0 && key === 'type') {
            // 自己取出值
            acc[key] = intersectionArray[0]
          } else {
            acc[key] = intersectionArray;
          }
        } else {
          // 其中一边为 Array
          // 查找包含关系
          const [arrayTypeData, baseTypeData] = Array.isArray(left) ? [left, right] : [right, left];
          // 空值直接合并另一边
          if (baseTypeData === undefined) {
            acc[key] = baseTypeData
          } else {
            if (!arrayTypeData.includes(baseTypeData)) {
              throw new Error('无法合并如下数据');
            }
            acc[key] = baseTypeData;
          }
        }
      } else if (left !== undefined && right !== undefined ) {
        // 两边都不是 undefined - 基础数据类型 string number boolean...
        if (key === 'maxLength' || key === 'maximum' || key === 'maxItems' || key === 'exclusiveMaximum' || key === 'maxProperties') {
          acc[key] = Math.min(left, right);
        } else if (key === 'minLength' || key === 'minimum' || key === 'minItems' || key === 'exclusiveMinimum' || key === 'minProperties') {
          acc[key] = Math.max(left, right);
        } else if (key === 'multipleOf') {
          // 获取最小公倍数
          acc[key] = scm(left, right);
        } else {
          // if (left !== right) {
          //     throw new Error('无法合并如下数据');
          // }
          acc[key] = left;
        }
      } else {
        // 一边为undefined
        acc[key] = left === undefined ? right : left;
      }
      return acc;
    }, preVal);
    copyArgs.splice(0, 2, preVal);
  }
  return preVal;
}