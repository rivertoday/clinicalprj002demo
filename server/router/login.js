let html = require('fs').readFileSync(__dirname + '/../views/index.html')
const express = require("express");
const request = require("request");
const router = express.Router();
var myConst = require("./const");

/* 返回的token信息,这一段信息不会出现在实际代码中,会存储在cookie里。每隔4小时access_token要重新获取
const tokenInfo = {
    "access_token": "wnMVGlrG5cZ4q7fKJ4srO4I0WTPPcT",
    "expires_in": 28800,
    "token_type": "Bearer",
    "scope": "prj002",
    "refresh_token": "H1z2KGXjH08MrWeAgAHcEujWkxrDCL"}
*/

//登录请求
router.post('/',function (req, res, next) {
    // 1. 接受vue请求         网页通过axios的发送请求是这里的req,req.body包含用户名和密码
    console.log('login.js 1. ', req.body)
      //登录参数
    const loginInfo = {
      "username":req.body.username,
      "password":req.body.password,
      "grant_type":"password",
      "scope":"prj002",
      "client_id": myConst.client_id,
      "client_secret":myConst.client_secret
      }
    const url = myConst.apiurl + "/o/token/"

    // 2. 发送server请求      结合req.body里的信息和其它关键信息,通过request向服务器(server)发送请求,获取token
    request.post({url: url, form: loginInfo}, function (error, response, body) {

    // 3. 接受server返回信息   服务器(server)返回的信息在response.body里,也可以直接使用这里的body
        console.log('login.js 2. ', response.body)
        // tip 返回的状态码存在statusCode,200表示成功
        console.log('login.js 3. ', response.statusCode)
        if ( !error && response.statusCode == 200 ) {
          // tip 注意直接从server拿到的body信息都是json的字符串格式,程序里要使用需要先把body转换为js里的 object 格式
          var tokenInfo = JSON.parse(body)
          console.log('获取的token',tokenInfo)

    // 4. 必要信息存入cookie   把body里的token信息存入cookie,后续再向服务器发送请求就不必每次把token写到请求里了
          // tip maxAge表示cookie有4小时有效时间
          res.cookie("prj002token", tokenInfo, {maxAge: 1000 * 60 * 60 * 8, httpOnly: true})
          res.cookie("userinfo", {"username": req.body.username,"password": req.body.password}, {maxAge: 1000 * 60 * 60 * 8, httpOnly: true})
          // tip 所有的cookie信息可以在Set-Cookie查看
          // console.log(res.get('Set-Cookie字段信息:', 'Set-Cookie'))

    // 5. 向vue返回登录结果     把server返回的登录信息(成功或者失败)再返回到vue前端
          //TODO
          let user = {'username':loginInfo.username, 'password':loginInfo.password}
          res.send({ code: response.statusCode, msg: '登录成功', user })
        } else {
          let user = {'username':loginInfo.username, 'password':loginInfo.password}
          res.send({ code: response.statusCode, msg: '登录失败', user})
        }

    })

})

router.get('/', (req, res) => {
  res.status(200).end(html)
})

module.exports = router;
