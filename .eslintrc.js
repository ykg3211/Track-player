module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  // ignorePatterns: ["src/Common/vue/libs"],
  plugins: ["html", "vue"], //vue  把vue打开会导致 console 报错  暂时注释  发布的时候加上
  "globals": {
    "axios": true,
    "describe": true,
    "it": true,
    "ActiveXObject": true,
    "PRODUCT_TYPE": true,
    "MODULE_BUILD": true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:vue/strongly-recommended"
  ],
  rules: {
    // Possible Errors
    "no-cond-assign": ["error"],       //禁止条件表达式中出现赋值操作，while条件中使用括号可以避免错误
    "no-console": 0, //禁止使用console
    "no-constant-condition": ["error"],         //禁止条件表达式中出现常量
    "no-control-regex": ["error"],              //禁止正则表达式中出现控制字符
    "no-debugger": ["error"],                   //禁止使用debugger
    "no-dupe-args": ["error"],                  //禁止函数定义中出现重复参数
    "no-dupe-keys": ["error"],                  //禁止对象定义中出现重复的key
    "no-duplicate-case": ["error"],             //禁止switch中出现重复的case条件
    "no-empty-character-class": ["error"],      //禁止正则表达式中出现空的类
    "no-empty": ["error"],                      //禁止内容为空的块语句，增加注释可以避免错误
    "no-ex-assign": ["error"],                  //禁止catch语句中对异常参数重新赋值
    "no-extra-boolean-cast": ["error"],         //禁止不必要的BOOL类型转换
    "no-extra-semi": ["error"],                 //禁止不必要的分号
    "no-func-assign": ["error"],                //禁止对已定义的函数进行重新赋值
    "no-invalid-regexp": ["error"],             //禁止RegExp函数中出现无效的正则字符串
    "no-negated-in-lhs": ["error"],             //禁止在in表达式中对左操作数取反
    "no-obj-calls": ["error"],                  //禁止将Math 和 JSON这两个全局对象作为函数来调用
    "no-regex-spaces": ["error"],               //禁止正则表达式中出现多个空格
    "no-sparse-arrays": ["error"],              //禁止稀疏数组
    "no-unexpected-multiline": ["error"],       //禁止错误的分行
    "no-unreachable": ["error"],                //禁止不可能执行到的代码
    "no-unsafe-finally": ["error"],             //禁止finally块中出现控制语句
    "use-isnan": ["error"],                     //使用isNaN函数进行NaN判断
    "valid-jsdoc": ["off"],                   //使用 JSDoc 注释风格
    "valid-typeof": ["error"],                  //禁止将typeof表达式的结果与无效的字符串进行比较

    // Best Practices
    "array-callback-return": ["error"],         //Array方法中的回调函数必须要有return返回
    curly: ["error"], //if, while, for后面的{}不能省略
    "default-case": ["error"],                  //switch语句最后必须有default
    eqeqeq: ["error"], //必须使用全等
    //"no-alert": ["error"],                      //禁止使用alert confirm prompt
    "no-caller": ["error"],                     //禁止使用arguments.caller或arguments.callee
    "no-case-declarations": ["error"],          //不允许在case内定义变量
    "no-div-regex": ["error"],                  //不能使用看起来像除法的正则表达式/=foo/
    "no-else-return": ["error"],                //如果if语句里面有return,后面不能跟else语句
    "no-empty-function": ["error"],             //禁止定义空函数（增加注释可避免报错）
    "no-eval": ["error"],                       //禁止使用eval
    "no-extend-native": ["error"],              //禁止扩展native对象
    "no-extra-bind": ["error"],                 //禁止不必要的函数绑定
    "no-extra-label": ["error"],                //禁止不必要的label
    "no-fallthrough": ["error"],                //禁止switch穿透
    "no-floating-decimal": ["error"],           //禁止省略浮点数中的0
    "no-implicit-globals": ["error"],           //禁止省略全局变量的所属对象window
    "no-implied-eval": ["error"],               //禁止使用隐式eval
    //"no-invalid-this": ["error"],               //禁止无效的this
    "no-iterator": ["error"],                   //禁止使用__iterator__ 属性
    "no-labels": ["error"],                     //禁止标签声明
    "no-lone-blocks": ["error"],                //禁止不必要的嵌套块
    "no-loop-func": ["error"],                  //禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
    "no-multi-spaces": [
      "error",
      {
        //不能用多余的空格
        ignoreEOLComments: true
      }
    ],
    "no-multi-str": ["error"],                  //字符串不能用\换行
    "no-native-reassign": ["error"],            //不能重写native对象
    "no-new-func": ["error"],                   //禁止使用new Function
    "no-new-wrappers": ["error"],               //禁止使用new创建包装实例，new String new Boolean new Number
    "no-new": ["error"],                        //禁止在使用new构造一个实例后不赋值
    "no-octal-escape": ["error"],               //禁止使用八进制转义序列，用Unicode转义序列
    "no-octal": ["error"],                      //禁止使用八进制数字
    "no-proto": ["error"],                      //禁止使用__proto__属性
    "no-redeclare": ["error"],                  //禁止重复声明变量
    "no-return-assign": ["error"],              //return 语句中不能有赋值表达式
    "no-script-url": ["error"],                 //禁止使用javascript:void(0)
    "no-self-compare": ["error"],               //不能比较自身
    "no-sequences": ["error"],                  //禁止使用逗号运算符
    "no-throw-literal": ["error"],              //禁止抛出字面量错误 throw "error";
    "no-unused-labels": ["error"],              //禁止无用的标签
    "no-useless-call": ["error"],               //禁止不必要的call和apply
    "no-useless-concat": ["error"],             //禁止不必要的字符串连接操作
    "no-useless-escape": ["error"],             //禁止不必要的字符转义  张文凯注释
    "no-void": ["error"],                       //禁用void操作符
    "no-with": ["error"],                       //禁用with
    radix: ["error"], //parseInt必须指定第二个参数
    "wrap-iife": ["error", "inside"],           //立即执行函数表达式的小括号风格

    // Variables
    "no-delete-var": ["error"],                 //不允许删除已定义变量，“use strict”模式下会报错
    "no-label-var": ["error"],                  //禁止语句标签与变量共享一个名称
    "no-shadow-restricted-names": ["error"],    //禁止声明、使用 与关键词或全局对象同名的变量、参数、或函数
    "no-shadow": ["off"],                     //禁止变量覆盖定义
    "no-undef-init": ["error"],                 //禁止初始化变量为undefined
    "no-undef": ["error"],                      //禁止使用未声明的变量
    //"no-undefined": ["error"],                  //禁止使用undefined作为变量名 todo
    "no-unused-vars": ["error"],                //禁止定义了又不使用的变量
    "no-use-before-define": [
      "error",
      {
        //禁止在声明变量前使用变量
        functions: false //不会影响未声明使用的函数
      }
    ],

    // Stylistic Issues
    "array-bracket-spacing": ["error", "never"],                            //数组里面有多余的空格
    "brace-style": ["error", "1tbs"],                                       //大括号风格
    // "camelcase": ["error"],                                              //驼峰法命名
    "comma-dangle": ["error", "never"],                                     //对象不能尾随逗号
    "comma-spacing": ["error", { before: false, after: true }], //逗号前后的空格
    "comma-style": ["error", "last"],                                       //逗号风格，换行时在行首还是行尾
    "computed-property-spacing": ["error", "never"],                        //获取对象属性，key前后空格
    "func-names": ["error", "never"],                                       //函数表达式必须有名字
    indent: ["error", 2, { SwitchCase: 1, ignoredNodes: ["TemplateLiteral"] }], //代码缩进
    "key-spacing": ["error", { beforeColon: false, afterColon: true }], //对象的键和冒号间的空格
    "keyword-spacing": ["error", { before: true, after: true }], //条件语句和括号间的空格
    // "linebreak-style": ["error", "windows"],                             //换行风格
    "new-cap": ["error", { properties: false }], //new类名大写开头
    "new-parens": ["error"],                                                //new时必须加小括号
    // "newline-before-return": ["error"],                                  //return 前需要空一行, 2017/12/07讨论去除
    "no-array-constructor": ["error"],                                      //使用[]构造
    "no-mixed-spaces-and-tabs": ["error"],                                  //禁止混用tab和空格
    "no-multiple-empty-lines": ["error", { max: 2 }], //空行最多不能超过2行
    "no-new-object": ["error"],                                             //禁止使用new Object()
    "no-spaced-func": ["error"],                                            //函数调用时 函数名与()之间不能有空格
    "no-trailing-spaces": ["error", { skipBlankLines: true }], //一行结束后面不要有空格
    "no-unneeded-ternary": ["error"],                                       //禁止不必要的三元表达式
    "no-whitespace-before-property": ["error"],                             //属性访问点号后没有空格
    // "object-property-newline": ["error"],                                   //对象属性换行
    "one-var-declaration-per-line": ["error", "always"],                    //每一行一个var声明
    "one-var": ["error", "never"],                                          //多个var连续声明
    // "operator-linebreak": ["error", "before"],                              //换行时运算符在行尾/行首
    "padded-blocks": ["error", "never"],                                    //块语句内行首/行尾是否要空行
    "semi-spacing": ["error", { before: false, after: true }], //分号前后空格
    semi: ["error", "always"], //语句强制分号结尾
    "space-before-blocks": ["error", "always"],                             //条件判断语句块和{之间不要有空格
    "space-in-parens": ["error", "never"],                                  //小括号里面要不要有空格
    "space-infix-ops": ["error"],                                           //二元运算符周围要不要有空格
    "space-unary-ops": ["error", { words: true, nonwords: false }], //一元运算符的前/后要不要加空格
    // "wrap-regex": ["error"],
    "vue/attributes-order": 0, //正则表达式用小括号包起来
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "never",
          normal: "any",
          component: "any"
        },
        svg: "always",
        math: "always"
      }
    ],
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 3,
        multiline: {
          max: 3,
          allowFirstLine: true
        }
      }
    ],
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    "vue/name-property-casing": ["error", "PascalCase"],
    "vue/singleline-html-element-content-newline": 0, // 在单行元素的内容前后需要换行符
    "vue/multiline-html-element-content-newline": 0 // 在多行元素的内容之前和之后需要换行符
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    jquery: true
  }
};
