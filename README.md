# clinicalprj002

> A Vue.js project

## Build Setup

``` bash
1、安装环境
# install dependencies
npm install

2、打包vue前端
# build for production with minification
npm run build

3、将vue前端打包好的文件拷贝到Express的后台
cp dist/index.html ./server/views
cp -r dist/static ./server/

4、运行Express后台
node server/app.js
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
