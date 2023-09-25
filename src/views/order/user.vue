<template>
  <div>
    <!-- 侧边栏 -->
    <el-drawer title="报告分析" :visible.sync="drawer" direction="rtl">
      <h1>{{'体检编号:'+inCase.id}}</h1>
      <el-descriptions class="margin-top" :column="1" :size="size" border>
        <!-- <el-descriptions-item v-for=" value,key of targetMap" :key="key">
          <template slot="label">
            {{diseaseName[key]}}
          </template>  
          {{value}}
        </el-descriptions-item> -->
        <el-descriptions-item v-for=" targetItem,index in targetList" :key="index" label-class-name="my_label_40">
          <template slot="label">
            <i class="el-icon-price-tag" style="transform: rotate(90deg)"></i>{{diseaseName[targetItem.key]}}
          </template>
            {{typeof targetItem.value =='number'?  (targetItem.value * 100 + '%') : 
              arrayToString(targetItem.value)
            }}
            <el-button v-if="typeof targetItem.value =='number' && targetItem.value> 0.2" type="info" 
            icon="el-icon-document-add" @click="addUserTag(inCase.id, targetItem)" 
            size="mini">添加{{diseaseName[targetItem.key]}}标签</el-button>
        </el-descriptions-item>    
      </el-descriptions>  
    </el-drawer>  

    <el-table :data=" userList.filter( (data) => !search || data.phone.toLowerCase().includes(search.toLowerCase()) ) " style="width: 100%" >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions class="margin-top" :column="4" :size="size" border>
            <el-descriptions-item v-for="(item, name, index) of props.row.info" :key="index" >
              <template slot="label"> {{ infoName[name] ? infoName[name] : name }} </template>
              <span v-if="name === 'sex'">{{ item ? "男" : "女" }}</span>
              <span v-else>{{ item }}</span>
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions class="margin-top" :column="1" :size="size" border >
            <el-descriptions-item label="体检信息" label-class-name="my_label">
              <el-collapse accordion>

                <el-collapse-item :title="timestampToTime(item.date)" v-for="(item, name, index) of props.row.cases" :key="index" >
                    <el-button size="mini" @click=" funxi(item) " type="danger" >报告分析</el-button >
                    <!-- <el-button size="mini" >导出数据</el-button > -->
                    <el-descriptions :column="3" :size="size" border>
                      <el-descriptions-item v-for="(item1, name1, index1) of newItem(item)" :key="index1" >
                      <template slot="label"> <i class="el-icon-price-tag" style="transform: rotate(90deg)"></i>{{ caseName[name1] ? caseName[name1] :name1 }} </template>
                      <span >{{ caseValue[name1] ? " " + (typeof caseValue[name1] === "string" ? item1 + " " + caseValue[name1] : caseValue[name1][item1]) : item1 }}</span>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-collapse-item>
              </el-collapse>
            </el-descriptions-item>  
          </el-descriptions>


          <!-- name1 字段名英文 item1 数据 -->
          <!-- <el-carousel height="360px" arrow="never"  :autoplay="false">
            <el-carousel-item v-for="(item, name) of props.row.cases" :key="name" >
              <el-container>
                <el-header>
                  <h3 class="medium"> <i class="header-icon el-icon-date"></i >{{ timestampToTime(item.date) }} </h3>
                </el-header>

                <el-main>
                  <div style="display: inline-block" v-for="(item1, name1, index1) of item" :key="index1" v-show="name1 != 'date'" > 
                    <el-tag effect="plain"> 
                      <i class="el-icon-price-tag" style="transform: rotate(90deg)" ></i> {{ caseName[name1] ? caseName[name1] : name1 }}</el-tag >
                    <el-tag type="info" effect="plain">{{ caseValue[name1] ? " " + (typeof caseValue[name1] === "string" ? item1 + " " + caseValue[name1] : caseValue[name1][item1]) : item1 }}</el-tag>
                  </div>
                </el-main>

                <el-footer>
                  <i class="el-icon-search">
                    <el-select v-model="selectDisease[item.id]" multiple filterable allow-create default-first-option placeholder="请选择检测项目">
                      <el-option v-for="_case,index in diseaseName" :label="_case" :key="_case" :value="index"> </el-option>
                    </el-select>
                  </i>

                  <div v-for="diseaseKey in selectDisease[item.id]" :key="diseaseKey">
                    <div v-if="(findNoCase(item, diseaseValue[diseaseKey])).length > 0">
                        <el-tag type="warning">{{diseaseName[diseaseKey]}}缺失:</el-tag>
                        <el-tag v-for="losekey in findNoCase(item,diseaseValue[diseaseKey]) " :key="losekey">
                            {{caseName[losekey]}}
                        </el-tag>
                    </div>
                    <div v-else >
                      <el-popover placement="right-start" width="200" trigger="click" :content="temp"  > 
                        <el-button type="success" slot="reference" @click="diagnosis(diseaseKey, item)">{{diseaseName[diseaseKey]}}  </el-button>
                      </el-popover>
                    </div>
                  </div>
                </el-footer>

              </el-container>
            </el-carousel-item>
          </el-carousel> -->
          
        </template>
      </el-table-column>

      <el-table-column label="用户ID" prop="id" sortable> </el-table-column>
      <el-table-column label="姓名" prop="info.name" sortable> </el-table-column>
      <el-table-column label="手机号码" prop="phone" sortable>
        <template slot-scope="scope">
          <i class="el-icon-mobile-phone">{{ scope.row.phone }}</i>
        </template>
      </el-table-column>

      <!-- 要修改tags格式 -->
      <el-table-column label="标签" prop="tags" sortable>
        <template slot-scope="scope">
          <el-tag
            size="small"
            v-for="tagItem,tagName of scope.row.tags"
            :key="tagName"
            :type="tagType[Math.ceil(tagItem.slice(-1)[0].target * 3) - 1]"
          >
            <i class="el-icon-price-tag" style="transform: rotate(90deg)"></i>
            {{diseaseName[tagName] ?  diseaseName[tagName] :tagName}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <div>{{ scope.row }}</div>
          <!-- 防止报错： 'scope' is defined but never used. -->
          <el-input v-model="search" size="mini" placeholder="输入手机号搜索" />
        </template>
        <!-- <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" >修改</el-button >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          > 
        </template> -->
      </el-table-column>
    </el-table>

    
<!-- 
    <el-descriptions class="margin-top" :column="1" :size="size" border v-for="user of userList" :key="user.id" :title="'用户 ' + user.phone" >
      <template slot="extra">
        <el-button type="primary" size="small">修改</el-button>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          手机号
        </template>
        {{ user.phone }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-price-tag">标签</i>
        </template>
        <el-tag size="small" v-for="(item, name, index) of user.tags" :key="index" :type="tagType[Math.ceil(item * 3) - 1]" >
          {{ name }}
        </el-tag>
      </el-descriptions-item>

      <el-descriptions-item v-show="user.info">
        <template slot="label">
          <i class="el-icon-document">用户信息</i>
        </template>
        <div v-for="(item, name, index) of user.info" :key="index" class="text item" >
          <el-tag>{{ infoName[name] ? infoName[name] : name }} </el-tag >{{ item }}
        </div>
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-document">健康档案</i>
          <i> </i>
          <i class="el-icon-s-data">分析</i>
        </template>
        <el-collapse accordion>
          <el-collapse-item :title="timestampToTime(item.date)" v-for="(item, name, index) of user.cases" :key="index" >
            <div v-for="(item1, name1, index1) of item" :key="index1" v-show="name1 != 'date'" >
              <el-tag>{{ caseName[name1] ? caseName[name1] : name1 }}</el-tag>
              {{ caseValue[name1] ? " " + (typeof caseValue[name1] === "string" ? item1 + " " + caseValue[name1] : caseValue[name1][item1]) : item1 }} </div>
          </el-collapse-item>
        </el-collapse>
      </el-descriptions-item>
    </el-descriptions> -->
  </div>
</template>
<script>
export default {
  inject:['reload'],
  data() {
    return {
      inCase:{},// 传入体检字段
      drawer: false,
      host: "http://localhost:8088/admin",
      search: "",
      size: "20%",
      userList: [],
      tagType: ["success", "warning", "danger"],
      infoName: {},
      caseName: {},
      caseValue: {},
      diseaseName:{},
      diseaseValue:{},

      targetMap:{},
      targetList:[]

      //selectDisease: {}, //选中的检测项目 已废弃
      // target:{} ,// 结果 已废弃
      //temp:"等待中"


    };
  },
  methods: {
    addUserTag(orderId, targetItem){
      //{ "orderId": "621c5e9b7bdf101566cb7db5", "key": "DM", "value": 0 }
      this.$axios.post(this.host + "/addTag", 
         { "orderId":orderId, "key": targetItem.key, "value":Number(targetItem.value) },
          { headers: { token: sessionStorage.getItem("token") }, }
        ).then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              console.log("非法请求");
            } else {
              console.log("设置成功");
              this.reload()
            }
          }
        });
    },

    newItem(item){
      var newI = JSON.parse(JSON.stringify(item)) // 对象、数组 深拷贝
      delete newI.date
      return newI
    },

    arrayToString(arr){
      var str = '缺失数据:'
      for(var item  of arr){
        str += ' ' + (this.caseName[item] ? this.caseName[item] : item) 
      }
      return str
    },    

    diagnosis(key, dataMap){
      // if(key === 'EH'){ console.log(this.EH(dataMap)) }
      this.$axios.post("http://localhost:5000/diagnosis", 
        { "value":key, "data":dataMap }
        ).then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              console.log("非法请求");
            } else {
              //console.log("设置成功");
              this.targetMap[key] = res.data["target"]
              this.targetList.push({key: key, value: res.data["target"]})
            }
          }
        });
    },

    funxi(inCase){
      this.targetMap = {} // 不要用map 大坑
      this.targetList = []
      this.inCase = inCase
 

      for(var diseaseKey in this.diseaseName){
          var lose = this.findNoCase(this.diseaseValue[diseaseKey])
          if (lose.length == 0){
            this.diagnosis(diseaseKey, inCase)          
          }else{
            this.targetMap[diseaseKey] = lose
            this.targetList.push({key: diseaseKey, value: lose})
          }
          //console.log(diseaseKey,lose)
      }
      this.drawer = true;  
      //console.log(this.targetMap)
    },

    // EH(dataMap){
    //   //  收缩压≥140mmHg(18．6kPa)和（或）舒张压≥90mmHg(12kPa)者。
    //   this.target[dataMap.id] = (dataMap["sbp"] >= 140 && dataMap["dbp"] >= 90)
    // },

    setInfo(type, fun) {
      var path = this.host + "/getTags";
      // console.log(path);
      this.$axios
        .get(path + "?type=" + type, {
          headers: { token: sessionStorage.getItem("token") },
        })
        .then((res) => {
          if (!res.data) console.log("非法请求" + path);
          else fun(res.data);
        });
    },

    timestampToTime(date) {
      var year = date.substr(0, 4);
      var month = date.substr(5, 2);
      var day = date.substr(8, 2);
      return year + "年" + month + "月" + day + "日";
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },

    setInfoName(data) {
      this.infoName = data[0].nameInfo;
    },

    setCases(data) {
      this.caseName = data[0].nameInfo;
      this.caseValue = data[0].valueInfo;
    },

    setDisease(data){
      this.diseaseName = data[0].nameInfo;
      this.diseaseValue = data[0].valueInfo;
    },

    findNoCase(NeedCase){ // (onCase, NeedCase)
      var onCase = this.inCase

      //console.log(NeedCase ,this.inCase)

      return NeedCase.filter((key) =>{ 
          return key in onCase ? false : true
      });
    },
  },

  created() {
    // 这行代码的意思是定义一个全局变量，等于该组件的实例
    window.my = this;

    this.setInfo("userInfo", this.setInfoName);
    this.setInfo("cases", this.setCases);
    this.setInfo("disease",this.setDisease);

    var path = this.host + "/allUser";
    this.$axios
      .get(path, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        if (res.status == 200) {
          if (!res.data) {
            alert("非法请求" + path);
          } else {
            this.userList = res.data;
            //console.log(this.userList);
          }
      }
      });
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.my_label{
  width: 20px;
}
.my_label_40{
  width: 80px;
}
</style>