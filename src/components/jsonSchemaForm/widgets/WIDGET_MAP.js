import widgetComponents from './index';
const {
  CheckboxesWidget,
  RadioWidget,
  SelectWidget,
  TimePickerWidget,
  DatePickerWidget,
  DateTimePickerWidget
} = widgetComponents;

export default {
  types: {
    boolean: 'el-switch',
    string: 'el-input',
    number: 'el-input-number',
    integer: 'el-input-number',
  },
  formats: {
    color: 'el-color-picker',
    time: TimePickerWidget, // 20:20:39+00:00
    date: DatePickerWidget, // 2018-11-13
    'date-time': DateTimePickerWidget, // 2018-11-13T20:20:39+00:00
  },
  common: {
    select: SelectWidget,
    radioGroup: RadioWidget,
    checkboxGroup: CheckboxesWidget,
  },
  widgetComponents
}