import Vue from 'vue'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css';
import {
  Dialog,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  DatePicker,
  TimeSelect,
  TimePicker,
  Form,
  FormItem,
  Row,
  Col
} from 'element-ui';
Vue.use(Dialog);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Row);
Vue.use(Col);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
