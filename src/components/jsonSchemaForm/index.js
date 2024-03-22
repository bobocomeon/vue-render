import WIDGET_MAP from './widgets/WIDGET_MAP';
import './style.css';

const globalOptions = Object.freeze({
  WIDGET_MAP: Object.freeze(WIDGET_MAP),
  COMPONENT_MAP: Object.freeze({
    form: 'el-form',
    formItem: 'el-form-item',
    button: 'el-button',
    popover: 'el-popover'
  }),
  HELPERS: {
    // 是否mini显示 description
    isMiniDes(formProps) {
      return formProps && ['left', 'right'].includes(formProps.labelPosition);
    }
  },
})