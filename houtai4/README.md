<p align="center">
    <a href="https://www.iviewui.com">
        <img width="200" src="https://file.iviewui.com/logo.svg">
    </a>
</p>

# iView Admin
[![](https://img.shields.io/travis/iview/iview-admin.svg?style=flat-square)](https://travis-ci.org/iview/iview-admin)
[![vue](https://img.shields.io/badge/vue-2.5.13-brightgreen.svg?style=flat-square)](https://github.com/vuejs/vue)
[![iview ui](https://img.shields.io/badge/iview-2.8.0-brightgreen.svg?style=flat-square)](https://github.com/iview/iview)
[![npm](https://img.shields.io/npm/l/express.svg)]()


## 当前版本：v1.3.1
[更新日志](https://github.com/iview/iview-admin/releases)

[使用教程](https://github.com/iview/iview-admin/wiki)

[在线访问](https://iview.github.io/iview-admin)

[English Doc](https://github.com/iview/iview-admin/blob/dev/README_EN.md)

[简化版模板](https://github.com/iview/iview-admin/tree/template)

`注：在线版本会在开发版本新小版本发布后更新到相应版本，所以如果想体验最新版本iview-admin，请clone完整项目代码到本地运行。`

install:
    cnpm install
dev:
    cnpm run init
    cnpm run dev
    cnpm run dev-build
pro:
    cnpm run build

目录结构:
    src--
        --libs 工具包
            --utils 工具类和上传地址等常量
            --accessUtils 权限的常量类
            --validateRules 常用的校验函数
            --serverConfig 服务器配置(请求url)
        --router 路由
        --store 路由工具类, 比如历史记录, 更新菜单栏等
        --views vue组件, 页面写在这里
        --main.js 入口js, 一些全局配置, 初始化, prototype绑定都写在这里