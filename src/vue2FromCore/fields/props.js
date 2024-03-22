export default {
  formProps: {
    type: null,
  },
  globalOptions: {
    type: null,
  },
  schema: {
    type: Object,
    default: () => {},
  },
  // 当前节点Ui Schema
  uiSchema: {
    type: Object,
    default: () => ({})
  },
  // 当前节点Error Schema
  errorSchema: {
    type: Object,
    default: () => ({})
  },
  // 自定义校验
  customRule: {
    type: Function,
    default: null
  },
  // 自定义校验规则
  customFormats: {
    type: Object,
    default: () => ({})
  },
  // 根节点 Schema
  rootSchema: {
    type: Object,
    default: () => ({})
  },
  // 根节点的数据
  rootFormData: {
    type: null,
    default: () => ({})
  },
  // 当前节点路径
  curNodePath: {
    type: String,
    default: ''
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 是否需要校验数据组
    // object array 类型默认会最后追加一个校验组件校验整体数据
  needValidFieldGroup: {
    type: Boolean,
    default: true
  }
}