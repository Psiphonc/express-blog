## 关于模版中的外链资源的路径问题
- 模版文件中使用的相对路径是相对于浏览器地址栏的路径
  -  例如：localhost/admin/login表示admin目录下的login文件，因此当前路径是admin
  -  所以在模版文件中要把所有外链资源的路径修改成绝对路径
     -  html中/就表示绝对路径

# 登陆功能实现
1. 创建用户集合，初始化用户
   1. 连接数据库
   2. 创建用户集合
   3. 初始化用户
2. 为登陆表单设置请求地址、求情方式以及表单name属性
3. 当用户点击登陆按钮时候，客户端验证用户是否填写了登陆表单
   1. 若其中一项没有输入 就阻止表单提交
4. 服务器端接受请求参数，验证用户是否填写了登陆表单
   1. 如果其中一项没有输入，为客户端做出响应，阻止程序向下执行
5. 根据邮箱地址查询用户信息
   1. 如果用户不存在，为客户端作出响应阻止程序向下执行
   2. 如果用户村子啊，将用户名和密码进行比对
      1. 比对成功 登陆成功
      2. 比对失败 登陆失败

## 数据库密码加密
哈希加密是单程加密方式
在加密的密码中加入随机字符串可以增加密码被破解的难度
   ### bcrypt 
   #### 加密
   ```js
    const bcrypt = require("bcrypt");
    // 随机字符串的长度为10
    let salt = await bcrypt.genSalt(10);
    // 使用随机字符串对密码进行加密
    let pass = await bcrypt.hash("明文密码", salt)
   ```
   #### 解密
   ```js
   let isEqual = await bcrypt.compare("明文密码", "加密密码");
   ```


## cookie & session
### http的无状态性
在完成一次客户端与服务端的连接后，他们之间就断开了，没有联系了
所以在成功登陆后即使把username存到req对象中，也无法显示用户名
### cookie
cookie实际上是浏览器在硬盘中开辟的一块空间以供服务器存储数据
- cookie中的数据是以域名的形式进行区分的
- cookie中的数据是有过期时间的
- cookie中的数据会随着请求被自动发送到服务器
### session
session是一个对象，存储在服务器的内存中，在session对象中也可以存储多条数据，每一条数据都有一个sessionid作为唯一标识
### 利用session和cookie实现登陆功能
![img](./assets/01.jpg)
#### express-session
```js
const session = require("express-session");
app.use(session({secret: "secret key"}));
```
### 退出登陆
```js
module.exports = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/admin/login");
    });
}
```

## 登陆拦截
在没有登陆成功的状态下需要拦截访问管理页面的请求
1. 在路由前，使用use中间件拦截访问以/admin开头的请求
2. 判断当前登陆状态
   1. 若未登陆并将其重定向回登陆页面
   2. 若已登陆，显示管理页面

# 添加用户功能
1. 为用户列表页面的新增用户按钮添加链接
2. 添加一个链接对应的路由，在路由处理函数中渲染新增用户模版
3. 为新增用户表单指定请求地址、请求方式、为表单项添加name属性
4. 增加实现添加用户的功能路由
5. 接收到客户端传递过来的请求参数
6. 对请求参数的格式进行验证
7. 验证当前要注册的邮箱地址是否已经被注册
8. 对密码进行加密处理
9. 将用户信息添加到数据库中
10. 重定向页面到用户列表页面
## 用Joi模块进行后端字段验证
javascript对象的规则描述语言和验证器
```js
const Joi = require("joi");
const schema = {
    username: Joi.string().alpahnum().min(3).max(30).required().error(new Error("信息错误"));
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max(2013),
    email:Joi.string().email()
};
Joi.validate({username:"abcd", birthyear: 1994}, schema).
    then((result) => {
        result.dosomething();
    }).
    catch((err) => {
        console.log(err);
    });
```
## 错误处理
- next只能接收一个字符串参数
- 所以需要使用JSON.stringify()将对象转换成一个字符串
- 再使用JSON.parse()把字符串转换成对象

# 管理员用户列表页面
1. 数据库中查询所有用户
2. 模版渲染

## 数据分页
### 分页功能核心要素
- 当前页：用户通过点击上一页、下一页和页码产生，客户端通过get参数方式传递到服务器端
- 总页数：根据总页数判断当前页是否为最后一页，根据判断结果作出响应
  - 总页数 = Math.ceil(总数据条数 / 每页显示数据条数) 
  - 文档的构造函数下有一个方法countDocuments({查询条件})可以查询文档的数目
``` js
User.countDocuments({});
```
### mongodb的查询
```js
limit(2) // 限制查询的数量 传入每页显示的数据量
skip(1) // 跳过几条数据 传入显示数据的开始位置
```
- 数据的开始查询位置 = (当前页 - 1) * 每页显示的数据
- 模版的分页器中要用原始for循环
  - js的减号有隐式类型转换 加号没有 所以加法运算要写成-0+1
```html
<!-- 分页 -->
<ul class="pagination">
    <li style="display:<%= page-1 > 0 ? "inline" : "none" %>">
        <a href="/admin/user?page={{(page-1) < 0 ? 0 : (page-1)}}">
        <span>&laquo;</span>
        </a>
    </li>
    <% for (var i = 1; i <= total; ++i) { %>
    <li><a href="/admin/user?page={{i}}">{{i}}</a></li>
    <% } %> 
    <li style="display:<%= page-0+1 > total ? "none" : "inline" %>">
        <a href="/admin/user?page={{(page-0+1)>total ? total : (page-0+1)}}">
        <span>&raquo;</span>
        </a>
    </li>
</ul>
<!-- /分页 -->
```

# 修改用户
1. 将要修改的用户ID传递到服务器
2. 建立用户信息修改功能对应的路由
3. 接收客户端表单传递过来的请求参数
4. 根据id查询用户信息，并将客户端传递过来的密码和数据库中的密码进行比对
5. 密码比对失败对客户端作出响应
6. 密码比对成功将用户信息更新到数据库

# 删除用户
1. 在确认删除框中添加隐藏域以存储要删除用户的ID
2. 为删除按钮添加自定义属性以存储要删除的用户ID
3. 为删除按钮添加点击事件，在事件处理函数中获取自定义属性中存储的ID并将ID存储在表单的隐藏域中
4. 为删除表单添加提交地址以及提交方法
5. 在服务器端建立删除功能路由
6. 接收客户端传递过来的id参数

# 文章管理
## 建立集合Schema
```js
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
```
### 多集合联合查询
let articles = await Article.find({}).populate("author");
populate("字段")，顺着该字段的ref属性去多集合联查
## 表单中如果有文件 需要以二进制的形式提交
### html from的enctype属性
    - 默认值 application/x-www-form-urlencoded
      - name=Tom&age=20
    - multipart/form-data 将表单数据编码成二进制类型

### 使用formidable模块处理二进制数据
```js
const formidable = require("formidable");
// 创建表单解析对象
const form = new formidable.IncomingForm();
// 设置文件上传路径
form.uploadDir = "/file/uoload/dir";
// 保留文件后缀名
form.keepExtensions = true;
// 解析表单
form.parse(req, (err, fields, files) => {
    //fields: 存储普通请求参数
    // files: 存储上传的文件信息
})
```
### 读取文件FileReader
```js
var reader = new FileReader();
reader.readAsDataURL("文件");
reader.onload = function() {
    console.log(reader.result);
}
```
这个对象实际上就是把文件编码成dataurl，直接填写在src属性里

## 日期格式化 dateformat模块
```js
const dateformat = require("dateformat");
const tempalate = require("art-template");
tempalate.defaults.imports.dateformat = dateformat;
```
``` html
<td>{{dateformat($value.publishDate, "yyyy-mm-dd")}}</td>
```
## 分页
### mongoose-sex-page
``` js
const pagination = require("mongoose-sex-page");
pagination(集合的构造函数).page(1).size(20).display(8).exec();
```
- page：当前页
- size：每页数据条数
- display：客户端一次性显示几个页码
```js
// 查询返回结果
{
    "page": 1, // 当前页
    "size": 2, // 每页显示的数据条数
    "total": 8, // 总共的数据条数
    "records": [
        // 查询结果数组
        {
            "_id": "blablabla",
            "title": "blabla",
            ...
        },
        {
            ...
        },
        ...
    ],
    "pages": 4, // 总页数
    "display": [1 , 2, 3, 4] // 客户端此时要显示的页码
}
```

# mongoDB数据库添加账号
## 创建超级管理员账号
1. 切换到admin数据库 use admin
2. 创建超级管理员账户 db.createUser()
```
db.createUser({user:'root',pwd:'root',roles:['root']})
```

## 创建普通账户
1. 切换到其他数据库 use somedb
2. db.createUser()
```
db.createUser({user:'psiphonc',pwd:'abcd1234',roles:['readWrite']})
```

# 开发环境与生产环境
## 环境变量
通过环境变量NODE_ENV的值来判断当前是生产环境还是开发环境
```js
if (process.env.NODE_ENV == "development") {
    console.log(”开发环境”);
}
```
## morgan中间件
在开发环境使用morgan中间件可以将每次服务器访问自动打印到控制台上
```js
const morgan = require("morgan");
if(process.env.NODE_ENV == "development") {
    console.log("开发环境");
    app.use(morgan("dev"));
}
```
## 第三方模块config
允许开发人员将不同运行环境下的配置信息抽离到配置文件，将运行环境的判断和设置托管给模块
### 使用步骤
1. 使用npm install config命令下载模块
2. 在项目根目录下新建config文件夹
3. 在config文件夹下创建default.json、development.json、production.json
4. 导入模块，使用模块内部提供的get方法获取配置信息
### 将敏感信息存储到系统环境变量中
1. 在config文件夹下建立custom-enviroment-variables.json
2. 配置项属性的值填写系统环境变量的名字

# 文章评论
1. 创建评论集合
2. 判断用户是否登陆
3. 在服务器创建评论功能的路由
4. 在路由请求处理函数中接收客户端传递过来的评论信息
5. 将评论信息存储在评论集合中
6. 将页面重定向回文章详情页
7. 在文章详情页面路由中获取文章评论信息并展示在页面中