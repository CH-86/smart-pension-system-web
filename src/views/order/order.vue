/* eslint-disable no-undef */
<template>
  <div>
    <el-button size="mini" @click="refresh">刷新 <i class="el-icon-refresh"></i> </el-button>

    <!-- <el-popover placement="top-start" title="作者简介" width="400" trigger="hover" >
      <ul class="tips-content">
        <li>昵称：webrabbit</li>
        <li>邮箱：
          <a href="mailto:admin@websmallrabbit.com" target="_blank" data-toggle="tooltip" rel="nofollow" data-placement="bottom" title="" data-original-title="Email:admin@websmallrabbit.com" >admin@websmallrabbit.com</a>
        </li>
        <li>个人网址：
          <a href="http://websmallrabbit.github.io/" title="http://websmallrabbit.github.io/" target="_blank">http://websmallrabbit.github.io/</a>
        </li>
      </ul>
      <span slot="reference">
        <a class="address">webrabbit博客</a>
      </span>
    </el-popover> -->

    <!-- 订单统计 -->
    <el-table
      :data="orderList.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
      border style="width: 100%" stripe :row-class-name="tableRowClassName"
    >
      <!-- <el-table-column prop="id" label="订单" width="100"></el-table-column> -->
      <el-table-column prop="userId" label="用户" width="100" sortable >
        <template slot-scope="scope">
          <button @click="user = getUserById(scope.row.userId);drawer = true;" style="color: green">
            <i class="el-icon-s-custom" >
            </i>
          </button>
          <span v-if="getUserById(scope.row.userId)">{{(getUserById(scope.row.userId).info.name)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="70"
        :filters="Typefilters"
        :filter-method="filterByProperty"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
            <i class="el-icon-first-aid-kit" v-if="scope.row.type === '体检'">{{scope.row.type}}</i>
            <!-- el-icon-chat-dot-round -->
            <i class="el-icon-chat-dot-square" v-else-if="scope.row.type === '咨询'">{{scope.row.type}}</i>
            <i class="el-icon-s-check" v-else>{{scope.row.type}}</i>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期时间"
        align="center"
        width="180"
        :formatter="timestampToTime"
        sortable
      >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.status < 0" style="color: red">取消</span>
          <span v-if="scope.row.status == 0" style="color: green">等待</span>
          <span v-if="scope.row.status == 1" style="color: orange">进行</span>
          <span v-if="scope.row.status == 2" >完成</span>
        </template>
      </el-table-column>
      <el-table-column prop="handler" label="负责人" width="120" sortable >
        <template slot-scope="scope" v-if="scope.row.handler">
          <el-popover placement="top-start" width="280" trigger="hover">
            <template v-if="scope.row.type === '体检'">
              <el-descriptions :column="1" border v-for="_value, _key of getHandle(scope.row.type,scope.row.handler)" :key="_key">
                <el-descriptions-item v-if="_key == 'department'" label="科室">{{_value}}</el-descriptions-item>
                <el-descriptions-item v-else-if="_key == 'position'" label="职级">{{_value}}</el-descriptions-item>
                <el-descriptions-item v-else-if="_key == 'hospital'" label="所属医院">{{_value}}</el-descriptions-item> 
              </el-descriptions>  
            </template> 
            <template v-else>
              <el-descriptions :column="1" border v-for="_value, _key of getHandle(scope.row.type,scope.row.handler)" :key="_key">
                <el-descriptions-item v-if="_key == 'department'" label="职业">{{_value}}</el-descriptions-item>
                <el-descriptions-item v-else-if="_key == 'position'" label="职级">{{_value}}</el-descriptions-item>
              </el-descriptions>  
            </template>
            <i class="el-icon-user" slot="reference">
              {{(getHandle(scope.row.type,scope.row.handler) ? getHandle(scope.row.type,scope.row.handler).name : "")}}
            </i>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template #default="scope">
          <el-button
            size="mini"
            v-show="scope.row.status == 0 || scope.row.status == 1"
            @click=" if (scope.row.status == 0 || scope.row.status == 1)
                scope.row.status ? feedback(scope.row.id, scope.row.userId,scope.row.type)
                  : handleEdit(scope.row.id, scope.row.type, scope.row.info);"
          >
            {{ scope.row.status == 0 || scope.row.status == 1 ? statusText[scope.row.status] : "" }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="info" label="内容">
        <template slot-scope="scope" v-if="scope.row.info">
          <div v-if="scope.row.type =='咨询'">
            <span v-if="scope.row.info.inText"><el-tag>问题：{{scope.row.info.inText }} </el-tag>  </span>  
            <span v-if="scope.row.info.outText"><el-tag>反馈：{{scope.row.info.outText }} </el-tag>  </span>  
          </div>
          <div v-if="scope.row.type =='护理'">
            <!-- <span><el-tag style="color: red" >需求类型:{{scope.row.info.needType}} </el-tag></span> -->
            <span><el-tag style="color: green">需求描述:{{scope.row.info.need}} </el-tag></span>
          </div>
        </template>  
      </el-table-column>
    </el-table>
    <div class="center">
      <el-pagination class="pagination" layout="prev, pager, next" :page-size="pagesize" @current-change="handleChange" :total="orderList.length" background >
      </el-pagination>
    </div>

<!--       :title="'用户 ' + userId + ' 体检报告'" -->
    <el-dialog :visible.sync="setCaseForm" width="60%" >
      <el-container>
        <el-aside>
          <div id="leftHead">
            <el-avatar :size="50" :src="circleUrl"></el-avatar>
            <br>
            <i class="el-icon-mobile-phone">{{this.user.phone}}</i>
          </div>
        </el-aside>
        <el-main>
          
          <div v-for="infoValue,infoKey in this.user.info" :key="infoKey">
            <span>{{infoName[infoKey]? infoName[infoKey] : infoKey}}</span>
            <span> : </span>
            <i v-if="infoKey === 'sex'">{{infoValue? "男":"女"}}</i>
            <i v-else>{{infoValue}}</i>
          </div >          
          </el-main>  
      </el-container>

      <el-header id="tags_header">
        <div>
        <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="tagClose(tag)" >{{ tag }} </el-tag>
        </div>
        <el-autocomplete
          placeholder="请输入内容"
          class="input-new-tag"
          v-if="inputVisible"
          ref="saveTagInput"
          size="small"
          v-model="caseName"
          :fetch-suggestions="caseNameSearch"
          @select="handleInputConfirm"
          @keyup.enter.native="handleInputConfirm"
        >
          <i class="el-input__icon el-icon-close" slot="suffix" @click=" () => { this.inputVisible = false; } " ></i>
        </el-autocomplete>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"><i class="el-icon-plus"></i>添加新标签</el-button >        
      </el-header>

      <!-- 体检表单 -->
      <el-main id="tags_form">
        <el-form ref="form" :model="userCase" label-width="70px" width="40%" @submit.native.prevent >
          <el-form-item v-for="(tag, index) in dynamicTags" :key="index">
            <!-- tag在 -->
            <div v-if="findCaseKey(tag)">
              <!-- 获得caseValue[key]是对象 -->
              <template v-if="typeof caseValue[findCaseKey(tag)] == 'object'">
                <el-tag type="info" size="medium">{{ tag }}</el-tag>

                <el-select
                  v-model.number="userCase[findCaseKey(tag)]"
                  size="small"
                  suffix-icon="el-icon-coin"
                  placeholder="请选择"
                  :prefix="tag"
                >
                  <el-option v-for="(value, index) in caseValue[findCaseKey(tag)]" 
                  :key="index" 
                  :label="value" 
                  :value="Number(index)"></el-option>
                </el-select>
              </template>
              <!-- 获得caseValue[key]是string -->
              <el-input
                type='number'
                style="width: 80%"
                suffix-icon="el-icon-coin"
                v-else
                v-model.number="userCase[findCaseKey(tag)]"
                :placeholder=" caseValue[findCaseKey(tag)] ? '单位(' + caseValue[findCaseKey(tag)] + ')' : '值' "
                ><template slot="prepend">{{ tag }}</template></el-input
              >
            </div>

            <!-- 自定义字段 -->
            <div class="demo-input-suffix" v-else>
              <el-input
                type="text"
                style="width: 40%"
                suffix-icon="el-icon-key"
                maxlength="30"
                placeholder="字段名(英文)"
                v-model="myCaseNameMap[tag]"
              >
                <template slot="prepend">{{tag}}</template>
                <template v-if="myCaseNameMap[tag] != null">
                  <i class="el-input__icon el-icon-check" slot="suffix" style="color: blue" v-if="myCaseNameCheck(tag)"></i>
                  <i class="el-input__icon el-icon-close" slot="suffix" style="color: red" v-else></i>
                </template>
              </el-input>
              
              <el-input type='number' style="width:120px" suffix-icon="el-icon-coin" v-show="myCaseNameCheck(tag)"
                    v-model.number="userCase[myCaseNameMap[tag]]" placeholder="字段值">
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </el-main>
    
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="setCase()">确 定</el-button>
          <el-button @click="setCaseForm = false;">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="填写反馈信息" :visible.sync="setInfoForm" width="300">
      <div class="demo-input-suffix">
          填写反馈信息
          <el-input type="textarea" style="width: 40%" placeholder="请填写内容" v-model="info.outText" >
          </el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="setOrderInfo">确 定</el-button>
          <el-button @click="setInfoForm = false;">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="填写注意事项" :visible.sync="setMemoForm" width="300">
      <div class="demo-input-suffix">
          填写注意事项
          <el-input type="textarea"  style="width: 40%" placeholder="请填写内容" v-model="memo" >
          </el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="pushMemo">确 定</el-button>
          <el-button @click="setMemoForm = false;">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="设置订单处理人" :visible.sync="setHandlerForm" width="300" >
      <el-form ref="form" :model="handler" label-width="70px" v-if="type=='体检'">
        <el-table :data="doctors" style="width: 100%" highlight-current-row @current-change="handlerCurrentChange" >
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="60" ></el-table-column>
          <el-table-column prop="department" label="科室" width="60" 
          :filters="departments"
          :filter-method="filterByProperty"></el-table-column>
          <el-table-column prop="position" label="职级" width="80" sortable ></el-table-column>
          <el-table-column prop="hospital" label="医院" width="100" 
           :filters="hospitals"
            :filter-method="filterByProperty" ></el-table-column>
        </el-table>
        <!-- <div class="center">
          <el-pagination class="pagination" layout="prev, pager, next" :page-size="pagesize" @current-change="handleChange" :total="orderList.length" background >
          </el-pagination>
        </div> -->
      </el-form>
      <el-form ref="form" :model="handler" label-width="70px" v-else-if="type=='护理'">
        <el-table :data="nurses" style="width: 100%" highlight-current-row @current-change="handlerCurrentChange" >
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="60" ></el-table-column>
          <el-table-column prop="department" label="业务" width="60" ></el-table-column>
          <el-table-column prop="position" label="级别" width="60" ></el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="setHandler()">确 定</el-button>
          <el-button @click="setHandlerForm = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>


     <!-- 添加右边栏Title -->
     <el-drawer
      title="用户详情"
      :visible.sync="drawer"
      direction="rtl">
      <el-container>
        <el-header>
          <!-- 个人信息 -->
          <!-- <span>{{user.phone}}</span> -->
            <el-descriptions class="margin-top" :column="1"  border>
              <el-descriptions-item  v-for="(item, name, index) of user.info" :key="index" >
                <template slot="label">
                  <!-- <el-tag> <i class="el-icon-price-tag" style="transform: rotate(90deg)" ></i> -->
                  {{ infoName[name] ? infoName[name] : name }}
                  <!-- </el-tag> -->
                </template>
                <span v-if="name === 'sex'">{{ item ? "男" : "女" }}</span>
                <span v-else>{{ item }}</span>
              </el-descriptions-item>
            </el-descriptions>
            <!-- 体检表 -->
            <el-table :data="user.cases" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <!-- <el-form border="true"  label-position="left" inline class="demo-table-expand" v-for="value,key of props.row" :key="key">
                    <el-form-item :label="caseNameMap[key] ? caseNameMap[key] : key " v-show="!(key == 'date'|| key =='sex' )">
                      {{ caseValue[key] ? " " + (typeof caseValue[key] === "string" ? value + " " + caseValue[key] : caseValue[key][value]) : value }}
                    </el-form-item>
                  </el-form> -->
                  <el-table :data="mapToArray(props.row)" stripe :row-class-name="tableRowClassNameTwo" >
                    <el-table-column prop="key" label="项" width="100" :formatter="keyStampToKey"></el-table-column>
                    <el-table-column prop="value" label="值" width="150" :formatter="valueStampToValue"></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="体检日期" prop="date" :formatter="timestampToTime" sortable >
              </el-table-column>
            </el-table>
            <!-- 备注表 -->
            <!--  -->
        </el-header>
        <el-container>
          <el-header>
         
          </el-header>  
            <!-- <el-aside>

            </el-aside>
            <el-main>
              <img src="" alt="">
            </el-main> -->
        </el-container>
        <el-footer>
        </el-footer>
      </el-container>  
    </el-drawer>

  </div>
</template>

<script>
import _caseName from "../data/caseName.js";
import _caseValue from "../data/caseValue.js";
export default {
  inject: ["reload"],
  data() {
    return {
      drawer: false,
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      host: "http://localhost:8088/admin",

      // 填写case相关
      caseName: "",
      dynamicTags: ["胆固醇", "ST段抑制", "心脏疼痛类型"],
      inputVisible: false,

      infoName: {},
      caseNameMap: {},//_caseName,
      caseValue: {},//_caseValue,
      casesArray: [],

      statusText: ["受理", "反馈"],
      Typefilters: [
        { text: "体检", value: "体检" },
        { text: "护理", value: "护理" },
        { text: "咨询", value: "咨询" },
      ],
      hospitals:[],
      departments:[],
      statusList: ["等待", "进行中", "完成"],
      setHandlerForm: false,
      setCaseForm: false,
      setInfoForm: false,
      setMemoForm: false,
      info:"",//反馈内容
      memo:"",
      memos:{},
      userCase: {},
      handler: {},
      currentPage: 1,
      pagesize: 8,
      count: 0,
      orderList: [],

      doctors: [],
      nurses: [],
      users:[],

      handlerId: "",
      orderId: "",
      userId: "",
      user:{},
      type:"",
      
      myCaseNameMap: {},  // key是中文字段cn value是英文字段en

      //rules:{} //规则
    };
  },
  methods: {
    refresh(){
      this.reload()
    },

    setCases(data) {
      this.caseNameMap = data[0].nameInfo;
      this.caseValue = data[0].valueInfo;

      var map = data[0].nameInfo;
      for (let key in map) {
        if (!(key == "id" || key == "sex")) this.casesArray.push({ key: key, value: map[key] });
      }
    },

    setInfoName(data) {
      this.infoName = data[0].nameInfo;
    },

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

    getUserById(id){
      for(var _user of this.users){
        if(_user.id === id){
          return _user
        }
      }
      return null
    },

    getHandle(type, id){
      if(type == '体检'){
        for(var doctor of this.doctors){
          if(doctor.id == id){
            return doctor
          }
        }
      }
      else{
        for(var nurse of this.nurses){
          if(nurse.id == id){
            return nurse
          }
        }
      }
      return null
    },


    getusers(){
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
            this.users = res.data;
            //console.log(this.users);
          }
        }
      });
    },

    myCaseNameCheck(tag) { // 通过tag寻找key
      // 查找caseNameMap的key , 存在返回 'caseName: '+myCaseName+'
      var map = this.myCaseNameMap
      var key = map[tag]
      if(key) {
        if(this.caseNameMap[key]){
          // console.log('caseName: '+key+' 已存在caseNameMap' + this.caseNameMap[key])
          return false
        }
        for(var cn in map){
          if(cn!==tag && map[cn] === key){
            // console.log('caseName: '+key+' 已存在myCaseNameMap' + cn)
            return false
          }
        }
        return true
      }
      // 查找myCaseNameMap的value 存在返回 'caseName: '+myCaseNameMap +'
      else  return false // 
    },

    findCaseKey(value) { // 在caseNameMap中，通过value查找key
      var map = this.caseNameMap;
      for (let key in map) {
        if (map[key] === value) return key;
      }
      return null;
    },

    caseNameSearch(str, cb) {
      var casesArray = this.casesArray;
      var results = str
        ? casesArray.filter(this.caseNameFilter(str))
        : casesArray;
      cb(results);
    },

    caseNameFilter(str) {
      return (casesArray) => {
        // console.log(casesArray.value.toLowerCase().indexOf(str.toLowerCase()));
        return casesArray.value.toLowerCase().indexOf(str.toLowerCase()) === 0;
      };
    },

    // 关闭标签
    tagClose(tag) {
      var key = this.findCaseKey(tag);
      var map = this.myCaseNameMap
      if(!key){  //  检查是否为myCaseName
          // console.log(tag)
          for (let _key in map) {
            if ( _key === tag) {
              key=map[_key]
              break
            }
          }
          // console.log(key)
      }
      // userCase 移除对应字段
      delete this.userCase[key]
      // 移除标签
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(item) {
      // console.log(item);
      let caseName = this.caseName;
      if (caseName) {
        if (this.dynamicTags.indexOf(caseName) + 1){
          alert(caseName + "已存在");
        } 
        else {
          // todo
          this.dynamicTags.push(caseName);
        }
      } else console.log("caseName is null");
      this.inputVisible = false;
      this.caseName = "";
    },

    timestampToTime(row) {
      var date1 = new Date(row.date)
      return date1.toLocaleString()
      //var date = row.date;
      // var year = date.substr(0, 4);
      // var month = date.substr(5, 2);
      // var day = date.substr(8, 2);
      // var time = date.substr(11, 5);
      // return year + "年" + month + "月" + day + "日" + " " + time;
    },

    keyStampToKey(row){
      var key = row.key
      return this.caseNameMap[key] ? this.caseNameMap[key] : key
    },

    valueStampToValue(row){
      var key = row.key
      var value = row.value
      return this.caseValue[key] ? " " + (typeof this.caseValue[key] === "string" ? value + " " + this.caseValue[key] : this.caseValue[key][value]) : value
    },

    handlerCurrentChange(value) {
      if (value != null) {
        this.handlerId = value.id;
      }
    },
    filterByProperty(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleChange(currentPage) {
      this.currentPage = currentPage;
    },
    feedback(orderId, userId,type) {
      this.findUserById(userId)
      if(type == '体检' ){
        this.setCaseForm = true;
      }
      else if(type == '护理'){
        this.setMemoForm = true;
      }
      this.userId = userId;
      this.orderId = orderId;
      // console.log(this.orderId , this.userId)
    },

    findUserById(id){
      var path = this.host + "/findUserById";
      this.$axios.get(path+"?id="+id,{
            headers: { token: sessionStorage.getItem("token") },
          }).then(
            (res) =>{
              if (!res.data) {
                console.log("非法请求" + path);
              }else{
                this.user = res.data
                //console.log(this.user.info)
              }

            }
          )      
    },

    getDoctors(){
      var path = this.host + "/allDoctorTrue";
      this.$axios
        .get(path, { headers: { token: sessionStorage.getItem("token") } })
        .then((res) => {
          if (!res.data) {
            console.log("非法请求" + path);
          } else {
            this.doctors = res.data;
          }
        });
    },

    getHospitalsAndDepartments(){
      this.getData('?key=hospital&collectionName=doctor',(data) =>{
        this.hospitals = []
        for(var item of data){
          this.hospitals.push({ value: item.name, text: item.name })
        }
      })
      this.getData('?key=department&collectionName=doctor',(data)=>{
        this.departments = []
        for(var item of data){
          this.departments.push({ value: item.name, text: item.name })
        }
      })
    },

    getData(value, fun){
      var path = this.host +'/chart'
      this.$axios.get(path+value, 
        { headers: { token: sessionStorage.getItem("token") }, }
        ).then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              console.log("非法请求" + path);
            } else {
              fun(res.data) 
            }
          }
        });      
    },

    getNurses(){
      var path = this.host + "/allNurseTrue";
      this.$axios.get(path, {headers:{ token: sessionStorage.getItem("token")}})
      .then((res) => {
          if (!res.data) {
            console.log("非法请求" + path);
          } else {
            
            var nurses = res.data;
            this.nurses = nurses;
          }
        });
    },

    handleEdit(orderId, type, info) {
      this.type = type
      this.orderId = orderId;
      this.handlerId = "";

      if (type == "体检") {
        this.getDoctors()
        this.setHandlerForm = true;  
      } else if (type == "护理") {
        this.getNurses()
        this.setHandlerForm = true;
      } else if (type == "咨询") {
        this.setInfoForm = true;
        this.info = info;
      }
      // this.idx = index;
      // this.editform = this.tableData[index + (this.currentPage - 1) * 8];
      // this.editVisible = true;
    },

    setOrderInfo(){
      //console.log(this.info)
      var path = "http://localhost:8088/admin/setOrderInfo";
      this.$axios.post(path,
      {id: this.orderId, info:this.info},
      { headers: { token: sessionStorage.getItem("token") }, } 
      ).then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              console.log("非法请求" + path);
            } else {
              console.log("设置成功");
              this.reload();
            }
          }
      });
    },

    pushMemo(){
      var path = "http://localhost:8088/admin/setMemo";
      this.$axios
        .post(
          path,
          { id: this.orderId, userId: this.userId, memo: this.memo },
          { headers: { token: sessionStorage.getItem("token") }, }
        ).then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              console.log("非法请求" + path);
            } else {
              console.log("设置成功");
              this.reload();
            }
          }
        });
        this.setMemoForm = false;     
        this.memo ="";
        this.user = {};
    },

    setCase() {
      var path = "http://localhost:8088/admin/setCase";
      if (this.user.info.id){ // 如果身份证信息存在
        var date = new Date()
        var age = date.getFullYear() - this.user.info.id.slice(6,10)
        this.userCase.age = age
      }

      if(this.user.info.sex){
        this.userCase.sex = this.user.info.sex
      }

      console.log(this.userCase);
      this.$axios
        .post(
          path,
          { id: this.orderId, userId: this.userId, case: this.userCase, },
          { headers: { token: sessionStorage.getItem("token") }, }
        ).then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              console.log("非法请求" + path);
            } else {
              console.log("设置成功");
              this.reload();
            }
          }
        });
      this.setCaseForm = false; 
      this.userCase = {} // 提交表单时要清空 userCase
      this.myCaseNameMap = {} // 清空 myCaseNameMap
      this.user = {}
    },
    setHandler() {
      this.setHandlerForm = false;
      var path = "http://localhost:8088/admin/setHandler";
      console.log(this.handlerId, this.orderId);
      this.$axios
        .post( path,
          { id: this.orderId, handler: this.handlerId },
          { headers: { token: sessionStorage.getItem("token") }, })
        .then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              alert("非法请求" + path);
            } else {
              alert("设置成功");
              this.reload();
            }
          }
        });
    },

    tableRowClassNameTwo(row, rowIndex ){
        if (row.row.key == 'date') {
          //console.log('key is '+ row.row.key) //坑
          return 'hidden-row';
        }
        return '';

    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },

    mapToArray(dataMap){
      var list = []
      for(var key in dataMap){
        list.push({"key": key, "value":dataMap[key]})
      }
      return list
    }

  },
  created() {
    // 这行代码的意思是定义一个全局变量，等于该组件的实例
    window.my = this;

    this.setInfo("userInfo", this.setInfoName);
    this.setInfo("cases", this.setCases);
    this.getusers()
    this.getDoctors()
    this.getHospitalsAndDepartments()
    this.getNurses()

    var _this = this;
    var path = this.host + "/allOrder";
    this.$axios
      .get(path, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        if (res.status == 200) {
          if (!res.data) {
            console.log("非法请求" + path);
          } else {
            var orderData = res.data;
            _this.count = orderData.length;

            for (var i = 0; i < this.count; i++) {
              _this.orderList.push({
                id: orderData[i].id,
                type: orderData[i].type,
                status: orderData[i].status,
                info: orderData[i].info,
                date: orderData[i].date,
                userId: orderData[i].userId,
                handler: orderData[i].handler,
              });
            }
          }
        }
      });
  },
};
</script>

<style>
#leftHead{
  margin-left: 25px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  vertical-align: bottom;
  
}
#tags_form{
  margin: 10px;
}

#tags_header{
  margin-bottom: 40px;
  padding-bottom: 40px;
}

.el-table .hidden-row{
  display: none;
}
</style>



