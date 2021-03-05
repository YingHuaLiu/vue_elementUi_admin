module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 0, //关闭分号结尾
    'space-before-function-paren': [0, 'always'], //函数定义时括号前面要不要有空格
    'keyword-spacing': 0 //关闭关键词后面加括号
  }
};
