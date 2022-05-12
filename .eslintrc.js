
module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  plugins: ['babel'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'react/sort-comp': 'off',
    'class-methods-use-this': 'off',
    'no-eval': 'error',
    // 关闭禁止给 div, span 这类本身不具有事件的 dom 元素绑定事件, 拿 span 标签做按钮还是挺常见的
    'jsx-a11y/no-static-element-interactions': 'off',
    // 具有点击处理程序的可见非交互元素必须至少有一个键盘
    'jsx-a11y/click-events-have-key-events': 'off',
    // 关闭a标签无href校验
    'jsx-a11y/anchor-is-valid': 'off',
    // 关闭img必须alt属性
    'jsx-a11y/alt-text': 'off',
    'import/first': 'error',
    // 路径支持字符串拼接, 变量引用
    'import/no-dynamic-require': 'off',
    // 导入的模块可以解析为本地文件系统上的模块
    'import/no-unresolved': 'off',
    'react/jsx-props-no-spreading': 'off',
    // 导入语句后没有其他导入后, 需要有 1 个换行
    'import/newline-after-import': 'error',
    'react/jsx-filename-extension': 'off',
    /**
     * 禁止重复导入
     * 错误示例
     * import {a} from 'module'
     * import {b} from 'module'
     *
     * 正确示例
     * import {a, b} from 'module'
     */
    'no-duplicate-imports': [
      'error',
      {
        /**
         * 错误示例
         * export {a} from 'module'
         *
         * 正确示例
         * import {a, b} from 'module'
         * export {a, b}
         */
        includeExports: true,
      },
    ],
    /**
     * 类成员间需要空行来提高可读性
     * 有时候值的定义并不希望有空行, 比如两个 observable 值之间
     */
    'lines-between-class-members': 'off',
    /**
     * 禁止在花括号中使用空格
     * 正确示例
     * const a = {b: 'c'}
     */
    'object-curly-spacing': ['error', 'never'],
    /**
     * 禁止使用拖尾逗号
     * 当最后一个元素或属性与闭括号 `]` 或 `}` 在不同的行时, 要求使用拖尾逗号
     * 当在同一行时, 禁止使用拖尾逗号
     */
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    /**
     * 要求构造函数首字母大写, Error可以直接使用
     * 正确示例
     * new A()
     */
    // 'new-cap': [
    //   'error',
    //   {
    //     newIsCap: true,
    //   },
    // ],
    // 限制最大长度 200, 指定 tab 字符的宽度为 2
    'max-len': [
      'warn',
      200,
      2,
      {
        // 忽略所有拖尾注释和行内注释
        ignoreComments: true,
      },
    ],
    // 每个缩进级别由 2 个空格组成, 而不是使用 tab
    indent: [
      'error',
      2,
      {
        // switch 语句缩进 2 个空格
        SwitchCase: 1,
      },
    ],
    /**
     * 禁用不必要的 call 和 apply
     * 错误示例
     * foo.call(undefined, 1, 2, 3)
     */
    'no-useless-call': 'error',
    // 要求将变量声明放在它们作用域的顶部, 有助于提高可维护性
    'vars-on-top': 'error',
    /**
     * 与 null 进行比较使用全等比较
     * 错误示例
     * undefined == null
     *
     * 正确示例
     * undefined === null
     * if (foo === null) {
     *   bar()
     * }
     */
    'no-eq-null': 'error',
    /**
     * 禁止对函数参数再赋值
     * 错误示例
     * function foo(bar) {
     *  bar = 13
     * }
     */
    'react/prop-types': 'off',
    'react/button-has-type': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-return-assign': 'off',
    // 可以使用下划线开头的变量，兼容
    'no-underscore-dangle': 'off',
    // 条件语句要写到一行里面？
    'prettier/prettier': 'off',
    'react/state-in-constructor': 'off',
    // 循环可以使用index作为key
    'react/no-array-index-key': 'off',
    // 允许三元运算符的嵌套
    'no-nested-ternary': 'off',
    // js里面可以使用react语法
    'react/react-in-jsx-scope': 'off',
    // 允许continue 语句
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'react/no-danger': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'prefer-template': 'off'
  },
}
