<template>
  <el-dialog title="一般情况" :visible.sync="dialogVisible" :close-on-click-modal="false" width="100%">
    <el-form ref="infoForm" :model="infoForm" label-width="130px" label-position="left">
      <el-form-item label="患者姓名">
        <el-input v-model="infoForm.name"></el-input>
        <!-- <el-input v-model="infoForm.name"><template slot="prepend">患者姓名</template></el-input> -->
      </el-form-item>

      <el-form-item label="民族">
        <el-select v-model="infoForm.nation" placeholder="请选择">
          <el-option v-for="item in nationSelection" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="职业">
        <el-select v-model="infoForm.career" placeholder="请选择">
          <el-option v-for="item in careerSelection" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="特殊工作环境">
        <el-checkbox v-for="item in specialCheckbox" :key="item.content" :label="item.content" v-model="infoForm[item.name]">
        </el-checkbox>
      </el-form-item>

      <el-form-item label="病人现住址">
        <el-input v-model="infoForm.address"></el-input>
      </el-form-item>

      <el-form-item label="饮食偏好">
        <el-checkbox v-for="item in dietCheckbox" :key="item.content" :label="item.content" v-model="infoForm[item.name]">
        </el-checkbox>
      </el-form-item>

      <el-form-item label="身高">
        <el-input v-model="infoForm.height"></el-input>
      </el-form-item>

      <el-form-item label="体重">
        <el-input v-model="infoForm.weight"></el-input>
      </el-form-item>

      <el-form-item label="臀围">
        <el-input v-model="infoForm.hipline"></el-input>
      </el-form-item>

      <el-form-item label="腰围">
        <el-input v-model="infoForm.waistline"></el-input>
      </el-form-item>

      <el-form-item label="多毛评分">
        <el-input v-model="infoForm.hairy"></el-input>
      </el-form-item>

      <el-form-item label="患者是否有痤疮">
        <el-switch v-model="infoForm.acne" active-text="是" inactive-text="否"></el-switch>
        <div v-if="infoForm.acne">
          <el-form-item label="请描述具体部位">
            <el-input v-model="infoForm.acne_part"></el-input>
          </el-form-item>
          <el-form-item label="评分">
            <el-slider v-model="infoForm.acne_score" :max="5" show-stops></el-slider>
          </el-form-item>
            <el-table :data="acneData" style="width: 100%">
              <el-table-column prop="field1" label="评分"></el-table-column>
              <el-table-column prop="field2" label="类型"></el-table-column>
              <el-table-column prop="field3" label="地址"></el-table-column>
            </el-table>
        </div>
      </el-form-item>

      <el-form-item label="患者是否有皮脂腺分泌过旺">
        <el-switch v-model="infoForm.glandula" active-text="是" inactive-text="否"></el-switch>
        <div v-if="infoForm.glandula">
          <el-form-item label="分泌过旺具体部位">
            <el-input v-model="infoForm.glandula_part"></el-input>
          </el-form-item>
          <el-form-item label="分泌过旺程度">
            <el-radio v-model="infoForm.glandula_level" label="轻">轻</el-radio>
            <el-radio v-model="infoForm.glandula_level" label="中">中</el-radio>
            <el-radio v-model="infoForm.glandula_level" label="重">重</el-radio>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="患者是否有雄性脱发">
        <el-switch v-model="infoForm.male" active-text="是" inactive-text="否"></el-switch>
        <div v-if="infoForm.male">
          <el-form-item label="患者是否有雄性脱发">
            <el-input v-model="infoForm.male_part"></el-input>
          </el-form-item>
          <el-form-item label="脱发程度">
            <el-radio v-model="infoForm.male_level" label="轻">轻</el-radio>
            <el-radio v-model="infoForm.male_level" label="中">中</el-radio>
            <el-radio v-model="infoForm.male_level" label="重">重</el-radio>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateInfoForm">确定</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
import { apiUpdatePatientInfoForm } from '@/api/api'
export default {
  name: "InfoForm",
  data() {
    return {
      dialogVisible: false,
      infoForm: {},
      nationSelection: ["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族",
                        "瑶族","白族","土家族","哈尼族","哈萨克族","傣族","黎族","傈傈族","佤族","畲族","高山族","拉祜族",
                        "水族","东乡族","纳西族","景颇族","科尔克孜族","土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族",
                        "毛难族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族","乌孜别克族","俄罗斯族","鄂温克族",
                        "崩龙族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族","其它"],
      careerSelection: ["学生","个体","农民","军人","工人","财会人员","技术人员","服务业","科教文卫","行政管理","无业","其它"],
      specialCheckbox: [{content:"高温", name:"special_gaowen"},{content:"低温", name:"special_diwen"},{content:"夜班", name:"special_yeban"},
                        {content:"噪声", name:"special_zao"},{content:"辐射", name:"special_fu"},{content:"化工污染", name:"special_hua"},
                        {content:"剧烈运动", name:"special_ju"},{content:"汽油", name:"special_qi"},{content:"高空", name:"special_kong"},
                        {content:"无", name:"special_wu"}],
      dietCheckbox:    [{content:"无特殊",name:"yinshi_wuteshu"},{content:"素食",name:"yinshi_sushi"},{content:"酸",name:"yinshi_suan"},
                        {content:"咸",name:"yinshi_xian"},{content:"辛辣",name:"yinshi_xinla"},{content:"油",name:"yinshi_you"},
                        {content:"生冷",name:"yinshi_shengleng"},{content:"含咖啡因食物或饮品",name:"yinshi_cafei"},{content:"其他",name:"yinshi_qita"}],
      acneData:[{field1: '0', field2: '无', field3: '无'},
                {field1: '1', field2: '轻微', field3: '痤疮≥2mm，面部或躯干<10个'},
                {field1: '2', field2: '轻', field3: '痤疮10-20个'},
                {field1: '3', field2: '中', field3: '痤疮>20个或脓疱<20个'},
                {field1: '4', field2: '重', field3: '脓疱≥20个'},
                {field1: '5', field2: '囊性', field3: '炎性病损≥5mm'}],
      }
  },
  methods: {
    updateInfoForm () {
      let para = {
        url: this.infoForm.url,
        infoForm: this.infoForm
      }
      console.log("提交参数",para)
      apiUpdatePatientInfoForm(para)
      .then((res)=> {
        this.$message({message: '提交成功',type: 'success'})
        this.dialogVisible = false
        this.$parent.getPatients()
      })
      .catch(
        // this.$message({message: '修改失败',type: 'error'})
      )
    }
  },
  created() {
      this.$on("openEvent", (data)=>{
        this.infoForm = data;
        this.dialogVisible = true;
      });
    }
};
</script>
