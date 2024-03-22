import { getUiField, isSelect, isHiddenWidget } from '../../utils/formUtils';
import { nodePath2ClassName } from '../../utils/vueCommonUtils';
import { lowerCase } from '../../utils/index';
import retrieveSchema from '../../schema/retriev';
import vueProps from '../props';
import FIELDS_MAP from '../../FIELDS_MAP';

export default {
  name: 'SchemaField',
  props: vueProps,
  functional: true,
  render(h, content) {
    const props = context.props;
    const { rootSchema } = props;
    
    // 目前不支持schema依赖和additionalProperties 展示不需要传递formData
    // const schema = retrieveSchema(props.schema, rootSchema, formData);
    const schema = retrieveSchema(props.schema, rootSchema);
  }
}
