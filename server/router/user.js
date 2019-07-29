// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'
// import { LoginUsers, Users } from '../src/mock/data/user'
// let _Users = Users
const request = require("request");
const express = require("express");
const router = express.Router();
var myConst = require("./const");

// 搜索
router.post('/search', function (req, res, next) {
  const options = {
    url: myConst.apiurl + "/prj002/search/",
    // 我怎么知道搜索结果有几个
    form: {name:req.body.name, page:req.body.page},//, phone:'', hospital:'', birth:'', career:'', address:''
    headers: {'Authorization': 'Bearer ' + req.cookies.prj002token.access_token}
  }
  request.post(options, function (error, response, body) {
    var bodyParse = JSON.parse(body)
    console.log("搜索", bodyParse.count)
    console.log("搜索", bodyParse.next)
    var searchResultsNum = bodyParse.count
    var searchResults = bodyParse.results
    res.send({searchResults, searchResultsNum})
  })
})
// 添加患者信息
router.post('/add', function (req, res, next) {
  // console.log('req.body.name->', req.body.patientInfo.name)
  const options = {
    url: myConst.apiurl + "/prj002/info/",
    form: req.body.patientInfo,
    headers: {'Authorization': 'Bearer ' + req.cookies.prj002token.access_token}
  }
  request.post(options, function (error, response, body) {
    console.log("增加信息", body)
    res.send({msg:'成功了'})
  })

})
// 删除患者信息
router.post('/remove', function (req, res, next) {
  const options = {
    url: req.body.url,
    headers: {'Authorization': 'Bearer ' + req.cookies.prj002token.access_token}
  }
  request.del(options, function (error, response, body) {
    res.send({msg:'删除成功了'})
  })

})


// 所有患者信息列表
router.post('/list', function(req, res, next) {
  // console.log('user.js 1.req.body->', req.body)
  // console.log('user.js 2.req.cookies->', req.cookies)
  const options = {
    url: myConst.apiurl + "/prj002/info/",
    qs: {page:req.body.page},
    headers: {'Authorization': 'Bearer ' + req.cookies.prj002token.access_token}
  }
  request.get(options, function (error, response, body) {
    var bodyParse = JSON.parse(body)
    var totalNum = bodyParse.count
    var patientsList = bodyParse.results
    // console.log('user.js 3.',patientsList)
    res.send({patientsList,totalNum})
  })

})

// GET获取一般信息表
router.get('/info', function(req, res, next) {
  console.log('user.js GET获取一般信息表', req.query)
  var options = {
    url: req.query.url,
    headers: {'Authorization': 'Bearer ' + req.cookies.prj002token.access_token}
  }
  request.get(options, function (error, response, body) {
    var patientInfo = JSON.parse(body)
    res.send(patientInfo)
  })

})
// POST修改一般信息表
router.post('/info', function(req, res, next) {
  console.log('user.js POST修改一般信息表', req.body.params)

  var options = {
    url: req.body.url,
    form: req.body.infoForm,
    headers: {'Authorization': 'Bearer ' + req.cookies.prj002token.access_token}
  }

  request.patch(options, function (error, response, body) {
    console.log('user.js 更新')
    res.send({msg:'ok'})
  })

})

router.get('/summary', function(req, res, next) {
  res.send({name:"hello"})
})
router.get('/history', function(req, res, next) {
  res.send({name:"hello"})
})
router.get('/experiment', function(req, res, next) {
  res.send({name:"hello"})
})
router.get('/bxray', function(req, res, next) {
  res.send({name:"hello"})
})
router.get('/cure', function(req, res, next) {
  res.send({name:"hello"})
})



module.exports = router;
