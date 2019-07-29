<template>
  <section>
    <!--上方工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchPatient">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPatient">新增</el-button>
        </el-form-item>
        <!-- 测试 -->
        <!-- <el-form-item>
          <el-button type="primary" @click="showDialog = true">test</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>

    <!--主要内容 列表-->
    <el-table :data="patientsList" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;" height="500"><!--height固定表头-->
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="40" fixed>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="90" sortable fixed>
      </el-table-column>
      <el-table-column prop="birth" label="出生日期" width="100" sortable>
      </el-table-column>
      <!-- <el-table-column prop="age" label="年龄" width="100" sortable>
      </el-table-column> -->
      <el-table-column prop="phone" label="手机号码" width="110" sortable>
      </el-table-column>
      <el-table-column prop="hospital" label="就诊医院" width="150" sortable>
      </el-table-column>
      <el-table-column prop="career" label="职业" min-width="90" sortable>
      </el-table-column>
      <el-table-column label="操作" width="610">
        <template v-slot="scope">
          <el-button-group>
          <el-button type="primary" size="small" @click="openInfoForm(scope.$index, scope.row)">一般情况</el-button>
          <el-button type="success" size="small">病情概要</el-button>
          <el-button type="info"    size="small">专科病史</el-button>
          <el-button type="warning" size="small">实验室检查</el-button>
          <el-button type="primary" size="small">经阴道或经肛门B超</el-button>
          <el-button type="success" size="small">治疗</el-button>
          <!-- <el-button size="small" style="background:purple">治疗</el-button> -->
          </el-button-group>
          <el-button type="danger" size="small" style="margin-left:8px" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--下方工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next, jumper"
                    @current-change="handleCurrentChange"
                    :page-size="10" :total="totalNum"
                    style="float:right;">
      </el-pagination>
    </el-col>
    <!-- <span>共{{totalNum}}条</span> -->

    <!-- 一般情况dialog -->
    <InfoForm ref="infoForm" ></InfoForm>
    <!-- 新增信息dialog -->
    <AddPatient ref="addPatient" ></AddPatient>

  </section>
</template>

<script>
import util from '@/common/js/util'
// axios请求,向express做请求
import { apiGetPatientsList, apiGetPatientInfoForm, apiRemovePatient, apiSearchPatient, batchRemoveUser} from '@/api/api'
// 批量导入子组件
import {AddPatient,InfoForm,SummaryForm,HistoryForm,ExperimentForm,BxrayForm,CureForm} from '@/components/forms'
export default {
  name:'Table',
  components:{AddPatient,InfoForm,SummaryForm,HistoryForm,ExperimentForm,BxrayForm,CureForm},
  data () {
    return {
      filters: {
        name: ''
      },
      patientsList: [], // 数据列表
      totalNum: 0, //  数据总条数
      page: 1, //当前页码
      listLoading: false,
      sels: [], // 列表选中列

    }
  },
  methods: {
    searchPatient () {
      console.log('开始搜索')
      let para = {
        name:'测试',
        page:1
        //phone:'', hospital:'', birth:'', career:'', address:''
      }
      apiSearchPatient(para).then( (res) => {
        console.log('修改前',this.patientsList)
        this.patientsList = res.data.searchResults
        this.totalNum = res.data.searchResultsNum
        console.log('修改前',this.patientsList)
        this.listLoading = false
      })
    },
    addPatient ( ) {
      this.$refs.addPatient.$emit("addEvent")
    },
    openInfoForm (index, row) {
      //获取单个患者一般信息
      let para = {page: this.page, url: row.url}
      console.log("获取单个患者一般信息",para)
      apiGetPatientInfoForm(para)
      .then((res)=> {
        console.log(res.data)
        //父组件通过emit发送 事件 及 所需的参数
        this.$refs.infoForm.$emit("openEvent", res.data)
      })
      .catch(() => {})
    },
    handleCurrentChange (val) {
      this.page = val
      this.getPatients()
    },
    // 获取患者列表
    getPatients () {
      let para = {
        page: this.page
      }
      console.log("获取数据列表时需要传的参数",para)
      this.listLoading = true
      apiGetPatientsList(para).then((res) => {
        console.log(res.data)
        this.patientsList = res.data.patientsList
        this.totalNum = res.data.totalNum
        this.listLoading = false
      })
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'})
      .then(() => {
        this.listLoading = true
        let para = { url: row.url }
        console.log(row.url)
        apiRemovePatient(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getPatients()
        })
      }).catch(() => {})
    },

    selsChange: function (sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = { ids: ids }
        batchRemoveUser(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getPatients()
        })
      }).catch(() => {

      })
    }
  },
  mounted () {
    this.getPatients()
  }
}

</script>

<style scoped>

</style>
