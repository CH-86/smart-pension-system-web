<template >
  <div style="width: 960px">
    <el-button size="mini" @click="handlerCurrentChange()">添加医生 <i class="el-icon-plus"></i></el-button>
    <el-input v-model="search" size="mini" placeholder="输入关键字筛选" style="width:300px;"/>
    <el-button size="mini" @click="sortByName('hospital')">医院名称排序 <i class="el-icon-sort"></i></el-button>
    <el-button size="mini" @click="sortByName('department')">科室排序 <i class="el-icon-sort"></i></el-button>
    <el-button size="mini" @click="refreshList">重置排序 <i class="el-icon-refresh"></i> </el-button>

    <el-descriptions
      class="margin-top"
      :column="5"
      border
      v-for="doctor of doctorsList"
      :key="doctor.id"
    >
      <el-descriptions-item label-class-name="my-label-80" contentStyle="width: 90px">
        <template slot="label">
          <i class="el-icon-user"></i>
          姓名 </template
        >{{ doctor.name }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label-80" contentStyle="width: 100px">
        <template slot="label">
          <i class="el-icon-tickets"></i>
          职称
        </template>
        <el-tag size="small">{{ doctor.position }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label-80" contentStyle="width: 90px">
        <template slot="label">
          <i class="el-icon-tickets"></i>
          科室
        </template>
        <el-tag size="small">{{ doctor.department }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label-120">
        <template slot="label">
          <i class="el-icon-office-building"></i>
          所属医院
        </template>
        {{ doctor.hospital }}
        <i class="el-icon-edit-outline" @click="handlerCurrentChange(doctor)"></i>
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog :title="title" :visible.sync="setDoctorForm" width="300">
      <el-form ref="form" :model="doctor" label-width="70px">
        <el-form-item label="姓名">
          <el-input
            v-model="doctor.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属医院">
          <el-input
            v-model="doctor.hospital"
            placeholder="请输入医院"
          ></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="doctor.department" placeholder="请选择">
            <el-option
              v-for="item in doctorDepartmentTags"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-select v-model="doctor.position" placeholder="请选择">
            <el-option
              v-for="item in doctorPositionTags"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="setDoctor()">确 定</el-button>
          <el-button @click="setDoctorForm = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>



<script>
export default {
  inject:['reload'],
  data() {
    return {
//连云港第一人民医院   浙江省立同德医院 杭州市西溪医院 浙江省中医院   杭州师范大学附属医院
      doctorDepartmentTags: ["心脏内科","呼吸内科","内分泌科","神经内科","心脏外科","心胸外科","骨科","泌尿外科","手外科","普通外科","肝胆外科", "皮肤科","耳鼻喉科","眼科","口腔科"],
      doctorPositionTags: ["住院医师", "主治医师", "副主任医师", "主任医师"],
      title:"",
      setDoctorForm: false,
      doctor: {},
      doctorsList: [],
      doctorsListTemp:[],

      orderbyName : 'hospital',
      search:""
    };
  },
  methods: {
    // compare(a,b){
    //   var aValue = a[this.orderbyName]
    //   var bValue = b[this.orderbyName]
    //   console.log(aValue,bValue, aValue < bValue)
    //   return aValue < bValue
    // },


    sortChinese (arr, dataLeven) { // 参数：arr 排序的数组; dataLeven 数组内的需要比较的元素属性
      /* 获取数组元素内需要比较的值 */
      function getValue (option) { // 参数： option 数组元素
        if (!dataLeven) return option
        var data = option
        dataLeven.split('.').filter(function (item) {
          data = data[item]
        })
        return data + ''
      }
      arr.sort(function (item1, item2) {
        return getValue(item1).localeCompare(getValue(item2), 'zh-CN');
      })
    },

    sortByName(name){
      this.orderbyName = name
      //this.doctorsList.sort(this.compare)
      this.sortChinese(this.doctorsList, this.orderbyName)
      
      //this.doctorsList.splice(5)
    },

    handlerCurrentChange(value) {
      this.setDoctorForm = true;
      if (value != null) {
        this.doctor = value;
        this.title="修改信息"
      }
      else {
        //this.doctor.id = null
       this.nurse = {}
      this.nurse.status = true
        this.title = "添加信息"
        //console.log("value is null")
      }
    },

    refreshList(){
      this.reload()
    },

    setDoctor() {
      this.setDoctorForm = false;
      var path = "http://localhost:8088/admin/doctor/update";
      //console.log(this.doctor);
      this.$axios
        .post(
          path,
          this.doctor,
          {
            headers: { token: sessionStorage.getItem("token") },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              alert("非法请求" + path);
            } else {
              //console.log(res.data)
              this.doctor = null
              this.reload();
            }
          }
        });
    },
  },
  created() {
    window.my = this;

    var path = "http://localhost:8088/admin/allDoctorTrue";
    this.$axios
      .get(path, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        if (res.status == 200) {
          if (!res.data) {
            alert("非法请求" + path);
          } else {
            this.doctorsList = res.data;
            this.doctorsListTemp = res.data;
          }
        }
      });
  },

  watch:{
    search(){      
      this.doctorsList = this.doctorsListTemp.filter(data => !this.search || data.name.includes(this.search))
    }
  }
};

//"status": null bug
</script>

<style>
.my-label-120{
  width: 120px;
}
.my-label-80{
  width: 80px;
}
.my-label-100{
  width: 100px;
}
</style>

