import Vue from 'vue';
import {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main,
  Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem, Card,
  Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox,
  Tag, Tree, Select, Option, Cascader, Alert, TabPane, Tabs, Steps, Step,
  CheckboxGroup, Checkbox, Upload
} from 'element-ui';

Vue.use(Upload);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Alert);
Vue.use(Cascader);
Vue.use(Option);
Vue.use(Select);
Vue.use(Tree);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
