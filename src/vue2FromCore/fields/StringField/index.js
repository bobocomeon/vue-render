import vueProps from '../props';
import Widget from '../../components/Widget';

export default {
  name: 'StringField',
  props: vueProps,
  functional: true,
  render(h, context) {
    const {
      schema, uiSchema, curNodePath, rootFormData, globalOptions: { WIDGET_MAP }
    } = context.props;

    // 可能是枚举数据使用select组件，否则使用 input
    // const enumOptions = isSelect(schema) && 
  }
}